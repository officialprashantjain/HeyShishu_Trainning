'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import meetingService from '@/services/meetingService';
import AgoraProvider, { useAgora } from '@/components/meeting/AgoraProvider';
import LocalVideoView from '@/components/meeting/LocalVideoView';
import RemoteVideoGrid from '@/components/meeting/RemoteVideoGrid';
import MeetingControls from '@/components/meeting/MeetingControls';
import {
  MdArrowBack,
  MdErrorOutline,
  MdRefresh,
} from 'react-icons/md';

function TraineeRoomClient({ meeting }) {
  const { isJoining, joinError } = useAgora();

  if (isJoining) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        <div>
          <p className="text-white font-semibold text-lg">Joining Counselor Room…</p>
          <p className="text-neutral-400 text-sm mt-1">Please allow camera and microphone permissions if prompted.</p>
        </div>
      </div>
    );
  }

  if (joinError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-danger-500/10 text-danger-400 flex items-center justify-center">
          <MdErrorOutline size={32} />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg mb-1">Could not join meeting</h3>
          <p className="text-neutral-400 text-sm leading-relaxed">{joinError}</p>
        </div>
        <Link
          href="/meetings"
          className="px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-white font-semibold text-sm transition-all border border-white/10"
        >
          Back to Meetings
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-dark-900 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/meetings"
            className="w-9 h-9 rounded-xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center text-neutral-400 hover:text-white transition-all border border-white/5"
            title="Back to meetings"
          >
            <MdArrowBack size={20} />
          </Link>
          <div>
            <h2 className="text-white font-bold text-sm leading-tight">{meeting.title}</h2>
            <p className="text-neutral-400 text-xs capitalize leading-tight">
              {meeting.meetingType?.replace(/_/g, ' ')} • {meeting.status}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-400">Connected</span>
        </div>
      </div>

      {/* Main Video Stage */}
      <div className="relative flex-1 p-4 bg-dark-950 overflow-hidden">
        {/* Remote Stream Grid (Counselor / Presenter) */}
        <RemoteVideoGrid className="h-full" />

        {/* Local Self-View PIP */}
        <LocalVideoView className="absolute bottom-6 right-6 w-48 h-36 shadow-2xl z-20" />
      </div>

      {/* Control Bar */}
      <MeetingControls meetingTitle={meeting.title} />
    </div>
  );
}

export default function TraineeMeetingRoomPage({ params }) {
  const resolvedParams = use(params);
  const meetingId = resolvedParams?.meetingId;

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!meetingId) return;
    meetingService
      .getMeetingDetail(meetingId)
      .then((res) => {
        const detail = res?.data?.meeting || res?.meeting || res?.data || res;
        setMeeting(detail);
      })
      .catch((err) => {
        console.error('Failed to load meeting detail:', err);
        setError('Meeting not found or you do not have permission to join.');
      })
      .finally(() => setLoading(false));
  }, [meetingId]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-dark-950 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-neutral-400 text-sm font-medium">Preparing meeting room…</p>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="h-screen w-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-danger-500/10 text-danger-400 flex items-center justify-center">
          <MdErrorOutline size={32} />
        </div>
        <h2 className="text-white font-bold text-lg">{error || 'Meeting not found'}</h2>
        <Link
          href="/meetings"
          className="px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-white font-semibold text-sm transition-all border border-white/10"
        >
          Back to Meetings
        </Link>
      </div>
    );
  }

  return (
    <AgoraProvider meetingId={meetingId} meetingTitle={meeting.title}>
      <div className="h-screen w-screen bg-dark-950 text-white overflow-hidden flex flex-col">
        <TraineeRoomClient meeting={meeting} />
      </div>
    </AgoraProvider>
  );
}
