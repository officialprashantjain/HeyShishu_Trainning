'use client';

import React, { useEffect, useRef } from 'react';
import { useAgora } from './AgoraProvider';
import { MdVideocamOff } from 'react-icons/md';

export default function LocalVideoView({ className = '' }) {
  const containerRef = useRef(null);
  const { localVideoTrack, isCameraOn, agoraRole } = useAgora();

  useEffect(() => {
    if (localVideoTrack && containerRef.current && isCameraOn) {
      localVideoTrack.play(containerRef.current);
    }
    return () => {
      localVideoTrack?.stop();
    };
  }, [localVideoTrack, isCameraOn]);

  if (agoraRole === 'audience') {
    return null; // Audience does not have a local video view
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-dark-800 border-2 border-primary-500/50 shadow-2xl flex items-center justify-center ${className}`}
    >
      <div ref={containerRef} className="w-full h-full object-cover" />

      {!isCameraOn && (
        <div className="absolute inset-0 bg-dark-900 flex flex-col items-center justify-center gap-2 text-neutral-400">
          <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-neutral-400">
            <MdVideocamOff size={20} />
          </div>
          <span className="text-xs font-medium">Camera Off</span>
        </div>
      )}

      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white">
        You (Trainee)
      </div>
    </div>
  );
}
