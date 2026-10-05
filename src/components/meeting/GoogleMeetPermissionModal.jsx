'use client';
import React, { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import {
  MdMic,
  MdVideocam,
  MdClose,
  MdTune,
  MdWarningAmber,
} from 'react-icons/md';

const emptySubscribe = () => () => {};

export default function GoogleMeetPermissionModal({
  isOpen,
  type = 'prompt',
  device = 'mic',
  onClose,
  onUseMic,
  onUseMicAndCamera,
}) {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!isOpen || !isMounted || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[440px] rounded-3xl bg-white text-slate-900 shadow-2xl p-7 overflow-hidden border border-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          title="Close"
        >
          <MdClose size={20} />
        </button>

        {type === 'prompt' ? (
          /* ── Google Meet "Do you want people to hear you in the meeting?" Modal ── */
          <div className="flex flex-col items-center text-center">
            {/* Illustration */}
            <div className="relative w-44 h-24 mb-4 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <MdVideocam size={24} />
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30">
                  <MdMic size={24} />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-medium text-slate-900 mb-2 leading-snug">
              Do you want people to hear you in the meeting?
            </h3>
            <p className="text-sm text-slate-500 mb-7 max-w-xs leading-relaxed">
              You can still turn off your microphone at any time during the meeting.
            </p>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={onUseMic}
                className="w-full py-3 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-[0.99] cursor-pointer"
              >
                <MdMic size={20} />
                <span>Use microphone</span>
              </button>

              <button
                onClick={onUseMicAndCamera}
                className="w-full py-3 px-5 rounded-full border border-slate-300 hover:bg-slate-50 text-blue-600 font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <MdVideocam size={20} />
                <span>Use microphone and camera</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── Google Meet "Meet has been blocked from using your microphone/camera" Modal ── */
          <div className="flex flex-col">
            {/* Visual Header with Chrome URL Bar Illustration */}
            <div className="w-full bg-slate-50 rounded-2xl p-4 mb-5 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div className="flex-1 bg-white border border-slate-200 rounded-md py-1 px-2.5 flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MdTune size={12} />
                  </div>
                  <span className="truncate font-mono text-[11px]">https://...</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="flex items-center gap-2 text-xs text-rose-600 font-medium bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                  <MdWarningAmber size={16} />
                  <span>Permission blocked in browser</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-slate-900 mb-4 leading-snug">
              HeyShishu Meet has been blocked from using your{' '}
              {device === 'both' ? 'microphone and camera' : device === 'camera' ? 'camera' : 'microphone'}
            </h3>

            <div className="space-y-3.5 text-sm text-slate-600 mb-6 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Click the <strong className="text-slate-800">page info / tune icon</strong> in your browser&apos;s address bar.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Turn on <strong className="text-slate-800">{device === 'both' ? 'Microphone & Camera' : device === 'camera' ? 'Camera' : 'Microphone'}</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p>Reload or click below to retry connecting your media.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onUseMicAndCamera}
                className="flex-1 py-2.5 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all cursor-pointer text-center"
              >
                Retry Permission
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
