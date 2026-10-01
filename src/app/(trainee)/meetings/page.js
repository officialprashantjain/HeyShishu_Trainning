'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import TraineeLayout from '@/components/common/TraineeLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import meetingService from '@/services/meetingService';
import {
  MdVideocam,
  MdCalendarToday,
  MdAccessTime,
  MdPerson,
  MdArrowForward,
  MdRefresh,
} from 'react-icons/md';

const STATUS_BADGES = {
  scheduled: { variant: 'orange', label: 'Scheduled' },
  live: { variant: 'green', label: 'Live Now' },
  ended: { variant: 'gray', label: 'Ended' },
  cancelled: { variant: 'red', label: 'Cancelled' },
};

const TYPE_LABELS = {
  one_to_one: '1-to-1 Counselor Review',
  group: 'Group Training Session',
  webinar: 'Webinar',
};

export default function TraineeMeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await meetingService.getMyMeetings();
      // res is response body (array or { meetings: [] })
      const list = res?.data?.meetings || res?.meetings || res?.data || (Array.isArray(res) ? res : []);
      setMeetings(list);
    } catch (err) {
      console.error('Failed to fetch trainee meetings:', err);
      setError('Failed to load your meetings. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <TraineeLayout title="My Meetings" subtitle="View and join your scheduled counselor sessions and webinars">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Counselor Meetings & Webinars</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Join live review calls with your assigned counselor or live group training webinars.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconLeft={<MdRefresh />}
          onClick={fetchMeetings}
          className="self-start sm:self-auto"
        >
          Refresh
        </Button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-neutral-500">Loading your meetings…</p>
        </div>
      ) : error ? (
        <Card padding="md" className="bg-danger-50 border-danger-200 text-center py-8">
          <p className="text-danger-600 font-semibold text-sm mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchMeetings}>
            Try Again
          </Button>
        </Card>
      ) : meetings.length === 0 ? (
        <Card padding="lg" className="text-center py-12">
          <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MdVideocam size={32} />
          </div>
          <h3 className="text-base font-bold text-neutral-800 mb-1">No Meetings Scheduled Yet</h3>
          <p className="text-sm text-neutral-500 max-w-md mx-auto mb-4">
            Once an admin or counselor schedules a 1-to-1 review or group training meeting for you, it will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((m) => {
            const badge = STATUS_BADGES[m.status] || { variant: 'gray', label: m.status };
            const isLive = m.status === 'live';
            const isScheduled = m.status === 'scheduled';
            const canJoin = isLive || isScheduled;
            const scheduledDate = new Date(m.scheduledAt);

            return (
              <Card
                key={m._id}
                padding="md"
                className={`flex flex-col justify-between transition-all border ${
                  isLive
                    ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/5 bg-gradient-to-br from-white to-emerald-50/20'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div>
                  {/* Top Bar: Type + Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-500/10 text-primary-600">
                      {TYPE_LABELS[m.meetingType] || m.meetingType}
                    </span>
                    <Badge variant={badge.variant} dot={isLive}>
                      {badge.label}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-neutral-900 mb-2 leading-snug">
                    {m.title}
                  </h3>

                  {/* Description */}
                  {m.description && (
                    <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
                      {m.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="space-y-2 mb-4 text-xs text-neutral-600">
                    {m.counselorId?.name && (
                      <div className="flex items-center gap-2">
                        <MdPerson size={16} className="text-primary-500 flex-shrink-0" />
                        <span>Counselor: <strong className="text-neutral-800 font-semibold">{m.counselorId.name}</strong></span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MdCalendarToday size={16} className="text-primary-500 flex-shrink-0" />
                      <span>
                        {scheduledDate.toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdAccessTime size={16} className="text-primary-500 flex-shrink-0" />
                      <span>
                        {scheduledDate.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {m.durationMinutes && ` (${m.durationMinutes} mins)`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <span className="text-xs text-neutral-400 font-medium">
                    {isLive ? '🔴 Session is live' : isScheduled ? 'Upcoming Session' : 'Completed Session'}
                  </span>
                  {canJoin ? (
                    <Link href={`/meetings/${m._id}/room`}>
                      <Button
                        variant={isLive ? 'primary' : 'primary'}
                        size="sm"
                        iconRight={<MdArrowForward />}
                        className={isLive ? 'animate-pulse' : ''}
                      >
                        {isLive ? 'Join Live Meeting' : 'Join Meeting'}
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      {m.status === 'ended' ? 'Ended' : 'Cancelled'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </TraineeLayout>
  );
}
