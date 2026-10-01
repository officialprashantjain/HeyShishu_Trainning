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
} from 'react-icons/md';

export default function MeetingControls({ meetingTitle }) {
  const router = useRouter();
  const { isMicOn, isCameraOn, toggleMic, toggleCamera, leave, agoraRole } = useAgora();

  const handleLeave = async () => {
    await leave();
    router.push('/meetings');
  };

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
            {/* Mic Toggle */}
            <button
              onClick={toggleMic}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                isMicOn
                  ? 'bg-dark-800 text-white hover:bg-dark-700 border border-white/10'
                  : 'bg-danger-500/20 text-danger-400 border border-danger-500/50 hover:bg-danger-500/30'
              }`}
            >
              {isMicOn ? <MdMic size={22} /> : <MdMicOff size={22} />}
            </button>

            {/* Camera Toggle */}
            <button
              onClick={toggleCamera}
              title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                isCameraOn
                  ? 'bg-dark-800 text-white hover:bg-dark-700 border border-white/10'
                  : 'bg-danger-500/20 text-danger-400 border border-danger-500/50 hover:bg-danger-500/30'
              }`}
            >
              {isCameraOn ? <MdVideocam size={22} /> : <MdVideocamOff size={22} />}
            </button>
          </>
        )}

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
    </div>
  );
}
