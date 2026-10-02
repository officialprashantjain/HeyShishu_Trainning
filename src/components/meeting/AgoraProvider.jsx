'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import meetingService from '@/services/meetingService';
import GoogleMeetPermissionModal from './GoogleMeetPermissionModal';

const AgoraContext = createContext(null);

export function useAgora() {
  const ctx = useContext(AgoraContext);
  if (!ctx) throw new Error('useAgora must be used within AgoraProvider');
  return ctx;
}

export default function AgoraProvider({ meetingId, meetingTitle = 'Trainee Meeting Room', children }) {
  const clientRef = useRef(null);
  const agoraModuleRef = useRef(null);
  const pipWindowRef = useRef(null);

  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(true);
  const [joinError, setJoinError] = useState(null);
  const [agoraRole, setAgoraRole] = useState('host');

  const [micPermission, setMicPermission] = useState('prompt');
  const [cameraPermission, setCameraPermission] = useState('prompt');
  const [permissionModal, setPermissionModal] = useState(null);
  const [isPiPActive, setIsPiPActive] = useState(false);

  useEffect(() => {
    let mounted = true;

    const join = async () => {
      try {
        setIsJoining(true);
        setJoinError(null);

        // 1. Get token from backend
        const tokenData = await meetingService.getAgoraToken(meetingId);
        const role = tokenData.agoraRole || 'host';
        if (mounted) setAgoraRole(role);

        // 2. Dynamically import Agora SDK for Web (prevents SSR window issue)
        const AgoraRTCModule = (await import('agora-rtc-sdk-ng')).default;
        agoraModuleRef.current = AgoraRTCModule;

        // Autoplay policy fallback: resume audio if browser blocks it before user gesture
        AgoraRTCModule.onAudioAutoplayFailed = () => {
          const resumeAudio = () => {
            if (typeof AgoraRTCModule.audioAutoplay === 'function') {
              AgoraRTCModule.audioAutoplay();
            }
            window.removeEventListener('click', resumeAudio);
            window.removeEventListener('touchstart', resumeAudio);
          };
          window.addEventListener('click', resumeAudio);
          window.addEventListener('touchstart', resumeAudio);
        };

        // 3. Create Client
        const client = AgoraRTCModule.createClient({ codec: 'vp8', mode: 'rtc' });
        clientRef.current = client;

        // 4. Handle Remote Users
        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          setRemoteUsers((prev) => {
            const exists = prev.find((u) => u.uid === user.uid);
            return exists ? prev.map((u) => (u.uid === user.uid ? user : u)) : [...prev, user];
          });
        });

        client.on('user-unpublished', (user) => {
          setRemoteUsers((prev) => prev.map((u) => (u.uid === user.uid ? user : u)));
        });

        client.on('user-left', (user) => {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });

        // 5. Join Agora Channel FIRST — guarantees user enters room and hears remote audio
        try {
          await client.join(
            tokenData.agoraAppId,
            tokenData.channelName,
            tokenData.token,
            tokenData.uid
          );
        } catch (joinErr) {
          if (joinErr?.code === 'UID_CONFLICT' || joinErr?.message?.includes('UID_CONFLICT')) {
            console.warn('[Agora RTC] UID conflict detected. Automatically acquiring fresh session UID...');
            const freshTokenData = await meetingService.getAgoraToken(meetingId);
            await client.join(
              freshTokenData.agoraAppId,
              freshTokenData.channelName,
              freshTokenData.token,
              freshTokenData.uid
            );
          } else {
            throw joinErr;
          }
        }

        if (mounted) {
          setIsJoined(true);
        }

        // 6. If participant is broadcaster (1-to-1 or Group), gracefully attempt to publish local audio & video
        if (role !== 'audience') {
          // Attempt Mic
          try {
            const audioTrack = await AgoraRTCModule.createMicrophoneAudioTrack();
            await client.publish([audioTrack]);
            if (mounted) {
              setLocalAudioTrack(audioTrack);
              setIsMicOn(true);
              setMicPermission('granted');
            }
          } catch (audioErr) {
            console.warn('Microphone permission or hardware not available on join:', audioErr);
            if (mounted) {
              setLocalAudioTrack(null);
              setIsMicOn(false);
              if (audioErr?.name === 'NotAllowedError' || audioErr?.message?.includes('Permission denied')) {
                setMicPermission('denied');
              } else {
                setMicPermission('prompt');
              }
            }
          }

          // Attempt Camera
          try {
            const videoTrack = await AgoraRTCModule.createCameraVideoTrack({
              encoderConfig: '480p_1',
            });
            await client.publish([videoTrack]);
            if (mounted) {
              setLocalVideoTrack(videoTrack);
              setIsCameraOn(true);
              setCameraPermission('granted');
            }
          } catch (videoErr) {
            console.warn('Camera permission or hardware not available on join:', videoErr);
            if (mounted) {
              setLocalVideoTrack(null);
              setIsCameraOn(false);
              if (videoErr?.name === 'NotAllowedError' || videoErr?.message?.includes('Permission denied')) {
                setCameraPermission('denied');
              } else {
                setCameraPermission('prompt');
              }
            }
          }
        }
      } catch (err) {
        console.error('Agora Join Error:', err);
        if (mounted) {
          setJoinError(
            err?.response?.data?.message ||
              err?.message ||
              'Could not connect to meeting server. Please check your internet connection.'
          );
        }
      } finally {
        if (mounted) setIsJoining(false);
      }
    };

    join();

    const handleBeforeUnload = () => {
      clientRef.current?.leave().catch(() => {});
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      mounted = false;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (pipWindowRef.current && !pipWindowRef.current.closed) {
        pipWindowRef.current.close();
      }
      clientRef.current?.leave().catch(() => {});
    };
  }, [meetingId]);

  // Dynamic device permission request (for Google Meet dialog & retry)
  const requestDevicePermission = useCallback(
    async (device) => {
      const AgoraRTCModule = agoraModuleRef.current;
      const client = clientRef.current;
      if (!AgoraRTCModule || !client) return false;

      let micSuccess = !!localAudioTrack;
      let cameraSuccess = !!localVideoTrack;

      if ((device === 'mic' || device === 'both') && !localAudioTrack) {
        try {
          const audio = await AgoraRTCModule.createMicrophoneAudioTrack();
          await client.publish([audio]);
          setLocalAudioTrack(audio);
          setIsMicOn(true);
          setMicPermission('granted');
          micSuccess = true;
        } catch (err) {
          console.warn('Microphone request failed:', err);
          if (err?.name === 'NotAllowedError' || err?.message?.includes('Permission denied')) {
            setMicPermission('denied');
            setPermissionModal({ open: true, type: 'blocked', device: 'mic' });
            return false;
          }
        }
      }

      if ((device === 'camera' || device === 'both') && !localVideoTrack) {
        try {
          const video = await AgoraRTCModule.createCameraVideoTrack({
            encoderConfig: '480p_1',
          });
          await client.publish([video]);
          setLocalVideoTrack(video);
          setIsCameraOn(true);
          setCameraPermission('granted');
          cameraSuccess = true;
        } catch (err) {
          console.warn('Camera request failed:', err);
          if (err?.name === 'NotAllowedError' || err?.message?.includes('Permission denied')) {
            setCameraPermission('denied');
            setPermissionModal({ open: true, type: 'blocked', device: 'camera' });
            return false;
          }
        }
      }

      setPermissionModal(null);
      return micSuccess || cameraSuccess;
    },
    [localAudioTrack, localVideoTrack]
  );

  const toggleMic = useCallback(async () => {
    if (localAudioTrack) {
      const nextState = !isMicOn;
      await localAudioTrack.setEnabled(nextState);
      setIsMicOn(nextState);
    } else {
      if (micPermission === 'denied') {
        setPermissionModal({ open: true, type: 'blocked', device: 'mic' });
      } else {
        setPermissionModal({ open: true, type: 'prompt', device: 'mic' });
      }
    }
  }, [localAudioTrack, isMicOn, micPermission]);

  const toggleCamera = useCallback(async () => {
    if (localVideoTrack) {
      const nextState = !isCameraOn;
      await localVideoTrack.setEnabled(nextState);
      setIsCameraOn(nextState);
    } else {
      if (cameraPermission === 'denied') {
        setPermissionModal({ open: true, type: 'blocked', device: 'camera' });
      } else {
        setPermissionModal({ open: true, type: 'prompt', device: 'camera' });
      }
    }
  }, [localVideoTrack, isCameraOn, cameraPermission]);

  const leave = useCallback(async () => {
    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      pipWindowRef.current.close();
    }
    localVideoTrack?.stop();
    localVideoTrack?.close();
    localAudioTrack?.stop();
    localAudioTrack?.close();
    await clientRef.current?.leave();
    setIsJoined(false);
  }, [localVideoTrack, localAudioTrack]);

  // ── Document Picture-in-Picture (PiP) Implementation ─────────────────────
  const openDocumentPiP = useCallback(async () => {
    if (!('documentPictureInPicture' in window)) {
      console.warn('Document Picture-in-Picture is not supported in this browser.');
      return;
    }

    try {
      const dPip = window.documentPictureInPicture;
      const pipWin = await dPip.requestWindow({
        width: 360,
        height: 480,
      });
      pipWindowRef.current = pipWin;
      setIsPiPActive(true);

      // Copy all styles
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
          const style = pipWin.document.createElement('style');
          style.textContent = cssRules;
          pipWin.document.head.appendChild(style);
        } catch {
          if (styleSheet.href) {
            const link = pipWin.document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet.href;
            pipWin.document.head.appendChild(link);
          }
        }
      });

      pipWin.document.title = `${meetingTitle} • HeyShishu Meet`;
      pipWin.document.body.style.margin = '0';
      pipWin.document.body.style.backgroundColor = '#0b0f19';
      pipWin.document.body.style.color = '#ffffff';
      pipWin.document.body.style.overflow = 'hidden';
      pipWin.document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';

      const container = pipWin.document.createElement('div');
      container.style.cssText = `
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        background: #0b0f19;
        position: relative;
        overflow: hidden;
      `;

      // Top title bar
      const topBar = pipWin.document.createElement('div');
      topBar.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: rgba(15, 23, 42, 0.95);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 20;
      `;
      topBar.innerHTML = `
        <div style="display:flex;align-items:center;gap:6px;min-width:0;">
          <span style="width:8px;height:8px;border-radius:50%;background:#10b981;"></span>
          <span style="font-size:12px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${meetingTitle}
          </span>
        </div>
        <span style="font-size:11px;color:#94a3b8;font-weight:500;">Meet PiP</span>
      `;
      container.appendChild(topBar);

      // Video stage
      const videoStage = pipWin.document.createElement('div');
      videoStage.style.cssText = `
        flex: 1;
        position: relative;
        background: #040711;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      `;

      const remoteContainer = pipWin.document.createElement('div');
      remoteContainer.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
      videoStage.appendChild(remoteContainer);

      const localInset = pipWin.document.createElement('div');
      localInset.style.cssText = `
        position: absolute;
        bottom: 12px;
        right: 12px;
        width: 90px;
        height: 70px;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid rgba(255,255,255,0.2);
        background: #1e293b;
        z-index: 10;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      `;
      videoStage.appendChild(localInset);
      container.appendChild(videoStage);

      // Bottom bar
      const bottomBar = pipWin.document.createElement('div');
      bottomBar.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 10px 16px;
        background: rgba(15, 23, 42, 0.95);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 20;
      `;

      const micBtn = pipWin.document.createElement('button');
      micBtn.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        background: ${isMicOn ? '#334155' : '#ef4444'};
      `;
      micBtn.innerHTML = isMicOn
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" x2="22" y1="2" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`;

      micBtn.onclick = async () => {
        await toggleMic();
        const currentMic = !isMicOn;
        micBtn.style.backgroundColor = currentMic ? '#334155' : '#ef4444';
      };

      const camBtn = pipWin.document.createElement('button');
      camBtn.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        background: ${isCameraOn ? '#334155' : '#ef4444'};
      `;
      camBtn.innerHTML = isCameraOn
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" x2="22" y1="2" y2="22"/><path d="m22 8-6 4 6 4V8Z"/><path d="m2 6 12 12"/></svg>`;

      camBtn.onclick = async () => {
        await toggleCamera();
        const currentCam = !isCameraOn;
        camBtn.style.backgroundColor = currentCam ? '#334155' : '#ef4444';
      };

      const endBtn = pipWin.document.createElement('button');
      endBtn.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        background: #ef4444;
      `;
      endBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="22" x2="2" y1="2" y2="22"/></svg>`;
      endBtn.onclick = async () => {
        await leave();
        pipWin.close();
      };

      bottomBar.appendChild(micBtn);
      bottomBar.appendChild(camBtn);
      bottomBar.appendChild(endBtn);
      container.appendChild(bottomBar);

      pipWin.document.body.appendChild(container);

      const activeRemote = remoteUsers.find((u) => u.videoTrack);
      if (activeRemote?.videoTrack) {
        activeRemote.videoTrack.play(remoteContainer);
      } else {
        remoteContainer.innerHTML = `
          <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#64748b;gap:8px;">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span style="font-size:12px;">Participant camera off</span>
          </div>
        `;
      }

      if (localVideoTrack && isCameraOn) {
        localVideoTrack.play(localInset);
      } else {
        localInset.innerHTML = `
          <div style="height:100%;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:10px;">
            You (off)
          </div>
        `;
      }

      pipWin.addEventListener('pagehide', () => {
        pipWindowRef.current = null;
        setIsPiPActive(false);
      });
    } catch (err) {
      console.warn('Failed to open Document PiP:', err);
    }
  }, [meetingTitle, isMicOn, isCameraOn, toggleMic, toggleCamera, leave, remoteUsers, localVideoTrack]);

  const togglePiP = useCallback(async () => {
    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      pipWindowRef.current.close();
      pipWindowRef.current = null;
      setIsPiPActive(false);
    } else {
      await openDocumentPiP();
    }
  }, [openDocumentPiP]);

  // Tab switch listener: automatic Picture-in-Picture trigger when user switches tab or minimizes
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden' && isJoined) {
        if ('documentPictureInPicture' in window && !pipWindowRef.current) {
          try {
            await openDocumentPiP();
          } catch {
            // Browser may require user gesture for initial window creation
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isJoined, openDocumentPiP]);

  return (
    <AgoraContext.Provider
      value={{
        localVideoTrack,
        localAudioTrack,
        remoteUsers,
        isMicOn,
        isCameraOn,
        isJoined,
        isJoining,
        joinError,
        agoraRole,
        micPermission,
        cameraPermission,
        isPiPActive,
        permissionModal,
        setPermissionModal,
        toggleMic,
        toggleCamera,
        togglePiP,
        requestDevicePermission,
        leave,
      }}
    >
      {children}

      {/* Google Meet Permission Modals */}
      {permissionModal && (
        <GoogleMeetPermissionModal
          isOpen={permissionModal.open}
          type={permissionModal.type}
          device={permissionModal.device}
          onClose={() => setPermissionModal(null)}
          onUseMic={() => requestDevicePermission('mic')}
          onUseMicAndCamera={() => requestDevicePermission('both')}
        />
      )}
    </AgoraContext.Provider>
  );
}
