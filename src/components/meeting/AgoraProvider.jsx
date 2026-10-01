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

const AgoraContext = createContext(null);

export function useAgora() {
  const ctx = useContext(AgoraContext);
  if (!ctx) throw new Error('useAgora must be used within AgoraProvider');
  return ctx;
}

export default function AgoraProvider({ meetingId, children }) {
  const clientRef = useRef(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(true);
  const [joinError, setJoinError] = useState(null);
  const [agoraRole, setAgoraRole] = useState('host');

  useEffect(() => {
    let mounted = true;
    let videoTrack = null;
    let audioTrack = null;

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

        // 5. Join Agora Channel
        await client.join(
          tokenData.agoraAppId,
          tokenData.channelName,
          tokenData.token,
          tokenData.uid
        );

        // 6. If participant is host/broadcaster (1-to-1 or Group), publish local audio & video
        if (role !== 'audience') {
          try {
            [audioTrack, videoTrack] = await AgoraRTCModule.createMicrophoneAndCameraTracks();
            await client.publish([audioTrack, videoTrack]);

            if (mounted) {
              setLocalVideoTrack(videoTrack);
              setLocalAudioTrack(audioTrack);
            }
          } catch (trackErr) {
            console.warn('Microphone/Camera creation issue:', trackErr);
          }
        }

        if (mounted) {
          setIsJoined(true);
        }
      } catch (err) {
        console.error('Agora Join Error:', err);
        if (mounted) {
          setJoinError(
            err?.response?.data?.message ||
              err?.message ||
              'Could not join meeting. Please check media permissions and try again.'
          );
        }
      } finally {
        if (mounted) setIsJoining(false);
      }
    };

    join();

    return () => {
      mounted = false;
      videoTrack?.stop();
      videoTrack?.close();
      audioTrack?.stop();
      audioTrack?.close();
      clientRef.current?.leave().catch(() => {});
    };
  }, [meetingId]);

  const toggleMic = useCallback(async () => {
    if (!localAudioTrack) return;
    await localAudioTrack.setEnabled(!isMicOn);
    setIsMicOn((prev) => !prev);
  }, [localAudioTrack, isMicOn]);

  const toggleCamera = useCallback(async () => {
    if (!localVideoTrack) return;
    await localVideoTrack.setEnabled(!isCameraOn);
    setIsCameraOn((prev) => !prev);
  }, [localVideoTrack, isCameraOn]);

  const leave = useCallback(async () => {
    localVideoTrack?.stop();
    localVideoTrack?.close();
    localAudioTrack?.stop();
    localAudioTrack?.close();
    await clientRef.current?.leave();
    setIsJoined(false);
  }, [localVideoTrack, localAudioTrack]);

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
        toggleMic,
        toggleCamera,
        leave,
      }}
    >
      {children}
    </AgoraContext.Provider>
  );
}
