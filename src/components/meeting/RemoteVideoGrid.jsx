'use client';

import React, { useEffect, useRef } from 'react';
import { useAgora } from './AgoraProvider';
import { FaUserCircle } from 'react-icons/fa';

function SingleRemoteUser({ user }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (user.videoTrack && containerRef.current) {
      user.videoTrack.play(containerRef.current);
    }
    return () => {
      user.videoTrack?.stop();
    };
  }, [user.videoTrack]);

  useEffect(() => {
    if (user.audioTrack) {
      user.audioTrack.play();
    }
    return () => {
      user.audioTrack?.stop();
    };
  }, [user.audioTrack]);

  const hasVideo = Boolean(user.hasVideo && user.videoTrack);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-dark-800 border border-white/10 flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full object-cover" />

      {!hasVideo && (
        <div className="absolute inset-0 bg-dark-900 flex flex-col items-center justify-center gap-3 text-neutral-400">
          <FaUserCircle size={56} className="text-neutral-600" />
          <span className="text-sm font-medium text-neutral-300">Counselor / Participant</span>
        </div>
      )}

      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Counselor</span>
      </div>
    </div>
  );
}

export default function RemoteVideoGrid({ className = '' }) {
  const { remoteUsers } = useAgora();

  if (remoteUsers.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-2xl bg-dark-900 border border-white/5 p-8 text-center ${className}`}>
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 text-primary-400 flex items-center justify-center mb-4">
          <FaUserCircle size={36} />
        </div>
        <h3 className="text-white font-semibold text-base mb-1">Waiting for Counselor</h3>
        <p className="text-neutral-400 text-sm max-w-sm">
          You are connected to the meeting room. The counselor will join shortly.
        </p>
      </div>
    );
  }

  // Grid layout depending on participant count
  const gridCols =
    remoteUsers.length === 1
      ? 'grid-cols-1'
      : remoteUsers.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-4 w-full h-full ${className}`}>
      {remoteUsers.map((u) => (
        <SingleRemoteUser key={u.uid} user={u} />
      ))}
    </div>
  );
}
