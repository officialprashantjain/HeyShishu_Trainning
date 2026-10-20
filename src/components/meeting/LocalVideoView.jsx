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

  const isAbsolute = /(?:^|\s)(absolute|fixed)(?:\s|$)/.test(className);
  const positionClass = isAbsolute ? '' : 'relative';

  return (
    <div
      style={isAbsolute ? { position: 'absolute' } : undefined}
      className={`${positionClass} rounded-2xl overflow-hidden bg-dark-800 border-2 border-primary-500/50 shadow-2xl flex items-center justify-center transition-all ${className}`}
    >
      <div
        ref={containerRef}
        className="w-full h-full object-cover [&>video]:object-cover [&>video]:w-full [&>video]:h-full"
      />

      {!isCameraOn && (
        <div className="absolute inset-0 bg-dark-900 flex flex-col items-center justify-center gap-1.5 text-neutral-400 p-2 text-center">
          <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-neutral-400">
            <MdVideocamOff size={18} />
          </div>
          <span className="text-[11px] font-medium">Camera Off</span>
        </div>
      )}

      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold text-white pointer-events-none">
        You (Trainee)
      </div>
    </div>
  );
}
