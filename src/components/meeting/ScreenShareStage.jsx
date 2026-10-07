'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAgora } from './AgoraProvider';
import {
  MdPerson,
  MdVideocamOff,
  MdMicOff,
  MdStopScreenShare,
  MdFullscreen,
  MdFullscreenExit,
} from 'react-icons/md';

// ── Filmstrip Remote Camera Tile ──────────────────────────────────────────
function FilmstripRemoteTile({ user }) {
  const containerRef = useRef(null);
  const hasVideo = !!user.videoTrack;
  const hasAudio = !!user.audioTrack;

  useEffect(() => {
    if (user.videoTrack && containerRef.current) {
      user.videoTrack.play(containerRef.current);
    }
    if (user.audioTrack) {
      user.audioTrack.play();
    }
    return () => {
      user.videoTrack?.stop();
      user.audioTrack?.stop();
    };
  }, [user.videoTrack, user.audioTrack]);

  return (
    <div className="relative w-44 h-28 shrink-0 overflow-hidden rounded-xl bg-dark-900 border border-white/10 shadow-md">
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full"
      />

      {!hasVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-dark-900">
          <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center">
            <MdPerson size={18} className="text-neutral-400" />
          </div>
          <span className="text-[10px] text-neutral-400">Camera off</span>
        </div>
      )}

      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
        <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded truncate max-w-[100px]">
          Participant {user.uid}
        </span>
        {!hasAudio && (
          <span className="bg-danger-500/90 text-white p-0.5 rounded" title="Muted">
            <MdMicOff size={11} />
          </span>
        )}
      </div>
    </div>
  );
}

// ── Filmstrip Local Camera Tile ───────────────────────────────────────────
function FilmstripLocalTile() {
  const { localVideoTrack, isCameraOn, isMicOn } = useAgora();
  const containerRef = useRef(null);

  useEffect(() => {
    if (localVideoTrack && containerRef.current && isCameraOn) {
      localVideoTrack.play(containerRef.current);
    }
    return () => {
      localVideoTrack?.stop();
    };
  }, [localVideoTrack, isCameraOn]);

  return (
    <div className="relative w-44 h-28 shrink-0 overflow-hidden rounded-xl bg-dark-900 border border-emerald-500/40 shadow-md">
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full"
      />

      {!isCameraOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-dark-900">
          <MdVideocamOff size={20} className="text-neutral-400" />
          <span className="text-[10px] text-neutral-400">Camera off</span>
        </div>
      )}

      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
        <span className="bg-black/60 backdrop-blur-sm text-emerald-400 text-[10px] font-semibold px-1.5 py-0.5 rounded">
          You
        </span>
        {!isMicOn && (
          <span className="bg-danger-500/90 text-white p-0.5 rounded" title="Muted">
            <MdMicOff size={11} />
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Screen Share Stage (Google Meet Layout) ──────────────────────────
export default function ScreenShareStage({ className = '' }) {
  const {
    isScreenSharing,
    localScreenTrack,
    remoteScreenTrack,
    remoteScreenUser,
    stopScreenShare,
    remoteUsers,
  } = useAgora();

  const screenContainerRef = useRef(null);
  const stageWrapperRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const container = screenContainerRef.current;
    if (!container) return;

    if (isScreenSharing && localScreenTrack) {
      localScreenTrack.play(container);
      return () => {
        localScreenTrack.stop();
      };
    } else if (remoteScreenTrack) {
      remoteScreenTrack.play(container);
      return () => {
        remoteScreenTrack.stop();
      };
    }
  }, [isScreenSharing, localScreenTrack, remoteScreenTrack]);

  const toggleFullscreen = () => {
    if (!stageWrapperRef.current) return;
    if (!document.fullscreenElement) {
      stageWrapperRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`flex flex-col h-full w-full min-h-0 min-w-0 overflow-hidden gap-3 ${className}`}>
      {/* ── Main Stage (Shared Screen) ─────────────────────────────────── */}
      <div
        ref={stageWrapperRef}
        className="relative flex-1 min-h-0 min-w-0 bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center group"
      >
        {/* Screen Video Container — object-contain ensures text and slides are never cropped */}
        <div
          ref={screenContainerRef}
          className="w-full h-full [&>video]:object-contain [&>video]:w-full [&>video]:h-full"
        />

        {/* Top Floating Control / Status Bar (Google Meet Style) */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-2">
            {isScreenSharing ? (
              <div className="flex items-center gap-2 bg-dark-900/90 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-lg pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white text-xs font-semibold">You are presenting to everyone</span>
                <button
                  onClick={stopScreenShare}
                  className="ml-2 inline-flex items-center gap-1 bg-danger-500 hover:bg-danger-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <MdStopScreenShare size={14} />
                  Stop presenting
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-dark-900/90 backdrop-blur-md border border-blue-500/30 px-3 py-1.5 rounded-full shadow-lg pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-white text-xs font-semibold">
                  Participant {remoteScreenUser?.uid} is presenting
                </span>
              </div>
            )}
          </div>

          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-dark-900/80 hover:bg-dark-800 text-neutral-300 hover:text-white border border-white/10 shadow-lg transition-all pointer-events-auto cursor-pointer"
            title={isFullscreen ? 'Exit full screen' : 'Full screen'}
          >
            {isFullscreen ? <MdFullscreenExit size={20} /> : <MdFullscreen size={20} />}
          </button>
        </div>
      </div>

      {/* ── Bottom Filmstrip (Participants Webcams) ────────────────────── */}
      <div className="h-32 shrink-0 flex items-center gap-3 overflow-x-auto overflow-y-hidden px-1 py-1 no-scrollbar">
        {/* Local user camera tile */}
        <FilmstripLocalTile />

        {/* Remote participant camera tiles */}
        {remoteUsers.map((user) => (
          <FilmstripRemoteTile key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
}
