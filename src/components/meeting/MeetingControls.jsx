'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAgora } from './AgoraProvider';
import {
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
  MdCallEnd,
  MdPictureInPictureAlt,
} from 'react-icons/md';

export default function MeetingControls({ meetingTitle }) {
  const router = useRouter();
  const {
    isMicOn,
    isCameraOn,
    micPermission,
    cameraPermission,
    localAudioTrack,
    localVideoTrack,
    toggleMic,
    toggleCamera,
    togglePiP,
    isPiPActive,
    leave,
    agoraRole,
  } = useAgora();

  const handleLeave = async () => {
    await leave();
    router.push('/meetings');
  };

  const isMicBlockedOrUnallowed = !localAudioTrack || micPermission === 'denied';
  const isCameraBlockedOrUnallowed = !localVideoTrack || cameraPermission === 'denied';

  return (
    <div className="bg-dark-900 border-t border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
      {/* Meeting Title */}
      <div className="hidden sm:block min-w-0">
        <p className="text-white font-semibold text-sm truncate">{meetingTitle || 'Meeting Room'}</p>
        <p className="text-neutral-400 text-xs">Agora RTC Audio & Video</p>
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-3 mx-auto sm:mx-0">
        {agoraRole !== 'audience' && (
          <>
            {/* Mic Toggle with Google Meet Yellow Exclamation Badge */}
            <div className="relative">
              <button
                onClick={toggleMic}
                title={
                  isMicBlockedOrUnallowed
                    ? 'Microphone permission blocked or not granted. Click to enable.'
                    : isMicOn
                    ? 'Mute Microphone'
                    : 'Unmute Microphone'
                }
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                  isMicOn
                    ? 'bg-dark-800 text-white hover:bg-dark-700 border border-white/10'
                    : 'bg-danger-500/20 text-danger-400 border border-danger-500/50 hover:bg-danger-500/30'
                }`}
              >
                {isMicOn ? <MdMic size={22} /> : <MdMicOff size={22} />}
              </button>

              {/* Yellow Exclamation Badge (Google Meet style) */}
              {isMicBlockedOrUnallowed && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-dark-900 shadow-sm pointer-events-none"
                  title="Microphone permission required"
                >
                  !
                </span>
              )}
            </div>

            {/* Camera Toggle with Google Meet Yellow Exclamation Badge */}
            <div className="relative">
              <button
                onClick={toggleCamera}
                title={
                  isCameraBlockedOrUnallowed
                    ? 'Camera permission blocked or not granted. Click to enable.'
                    : isCameraOn
                    ? 'Turn Off Camera'
                    : 'Turn On Camera'
                }
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                  isCameraOn
                    ? 'bg-dark-800 text-white hover:bg-dark-700 border border-white/10'
                    : 'bg-danger-500/20 text-danger-400 border border-danger-500/50 hover:bg-danger-500/30'
                }`}
              >
                {isCameraOn ? <MdVideocam size={22} /> : <MdVideocamOff size={22} />}
              </button>

              {/* Yellow Exclamation Badge (Google Meet style) */}
              {isCameraBlockedOrUnallowed && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-dark-900 shadow-sm pointer-events-none"
                  title="Camera permission required"
                >
                  !
                </span>
              )}
            </div>
          </>
        )}

        {/* Picture-in-Picture Floating Pop-up Window */}
        <button
          onClick={togglePiP}
          title={isPiPActive ? 'Exit Picture-in-Picture' : 'Open Picture-in-Picture floating pop-up'}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
            isPiPActive
              ? 'bg-blue-600 text-white ring-2 ring-blue-400/50 shadow-lg shadow-blue-600/30'
              : 'bg-dark-800 text-white hover:bg-dark-700 border border-white/10'
          }`}
        >
          <MdPictureInPictureAlt size={22} />
        </button>

        {/* Leave Button */}
        <button
          onClick={handleLeave}
          title="Leave Meeting"
          className="px-5 h-12 rounded-2xl bg-danger-500 hover:bg-danger-600 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-danger-500/20 transition-all cursor-pointer"
        >
          <MdCallEnd size={20} />
          <span>Leave Room</span>
        </button>
      </div>

      {/* Right spacer / PiP status */}
      <div className="hidden sm:flex items-center justify-end">
        {isPiPActive && (
          <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Floating Window Active
          </span>
        )}
      </div>
    </div>
  );
}
