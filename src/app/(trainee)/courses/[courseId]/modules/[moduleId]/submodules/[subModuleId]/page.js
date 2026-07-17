'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import { MdArrowBack } from 'react-icons/md'
import { courseService } from '@/services/courseService'
import { showToast } from '@/utils/toast'

export default function SubModulePage() {
  const params = useParams()
  const courseId = params?.courseId
  const moduleId = params?.moduleId
  const subModuleId = params?.subModuleId

  const [subModule, setSubModule] = useState(null)
  const [savedRec, setSavedRec] = useState(null)
  const [loading, setLoading] = useState(true)

  // Video player refs
  const videoRef = useRef(null)
  const heartbeatRef = useRef(null)
  const hasSeekRef = useRef(false)
  const maxWatchedRef = useRef(0)

  // ── Heartbeat helpers ─────────────────────────────────────────
  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current)
      heartbeatRef.current = null
    }
  }, [])

  const doSync = useCallback(() => {
    const video = videoRef.current
    if (!video || !courseId || !moduleId || !subModuleId) return
    courseService.syncProgress({
      courseId,
      moduleId,
      subModuleId,
      contentType: 'submodule_video',
      currentPositionInSeconds: Math.floor(video.currentTime),
      totalVideoDurationInSeconds: Math.floor(video.duration) || 0,
    })
  }, [courseId, moduleId, subModuleId])

  const startHeartbeat = useCallback(() => {
    stopHeartbeat()
    heartbeatRef.current = setInterval(doSync, 10000)
  }, [doSync, stopHeartbeat])

  // ── Fetch data ────────────────────────────────────────────────
  useEffect(() => {
    if (!courseId || !moduleId || !subModuleId) return
    let cancelled = false

    const load = async () => {
      try {
        const [modData, progData] = await Promise.all([
          courseService.getModuleDetails(courseId, moduleId),
          courseService.getCourseProgress(courseId),
        ])
        if (cancelled) return

        const mod = modData?.module || modData?.data?.module || modData
        const found = (mod?.subModules || []).find((s) => s._id === subModuleId)
        if (!found) { showToast.error('Submodule not found'); return }
        setSubModule(found)

        // Find saved progress for THIS submodule
        const rec = (progData || []).find(
          (r) =>
            r.moduleId === moduleId &&
            r.subModuleId === subModuleId &&
            r.contentType === 'submodule_video'
        )
        setSavedRec(rec ?? null)
      } catch (err) {
        showToast.error('Error loading submodule: ' + err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [courseId, moduleId, subModuleId])

  // ── Seek to saved position ────────────────────────────────────
  const handleLoadedMetadata = useCallback(() => {
    if (hasSeekRef.current) return
    if (savedRec?.currentPositionInSeconds > 0 && videoRef.current) {
      videoRef.current.currentTime = savedRec.currentPositionInSeconds
    }
    hasSeekRef.current = true
  }, [savedRec])

  // ── Video event handlers ──────────────────────────────────────
  const handlePlay = useCallback(() => startHeartbeat(), [startHeartbeat])

  const handlePause = useCallback(() => {
    stopHeartbeat()
    doSync()
  }, [stopHeartbeat, doSync])

  const handleEnded = useCallback(() => {
    stopHeartbeat()
    const video = videoRef.current
    if (video && courseId && moduleId && subModuleId) {
      courseService.syncProgress({
        courseId,
        moduleId,
        subModuleId,
        contentType: 'submodule_video',
        currentPositionInSeconds: Math.floor(video.duration),
        totalVideoDurationInSeconds: Math.floor(video.duration),
      })
    }
  }, [stopHeartbeat, courseId, moduleId, subModuleId])

  // ── Anti-Scrubbing Logic ──────────────────────────────────────
  const isVideoDone = savedRec?.isCompleted === true

  useEffect(() => {
    if (savedRec?.currentPositionInSeconds && !hasSeekRef.current) {
      maxWatchedRef.current = Math.max(maxWatchedRef.current, savedRec.currentPositionInSeconds)
    }
  }, [savedRec])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (!isVideoDone && !video.seeking) {
      maxWatchedRef.current = Math.max(maxWatchedRef.current, video.currentTime)
    }
  }, [isVideoDone])

  const handleSeeking = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (!isVideoDone && video.currentTime > maxWatchedRef.current) {
      video.currentTime = maxWatchedRef.current
    }
  }, [isVideoDone])

  // Cleanup
  useEffect(() => () => stopHeartbeat(), [stopHeartbeat])

  // ── Render ────────────────────────────────────────────────────
  if (loading) {
    return (
      <TraineeLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </TraineeLayout>
    )
  }

  if (!subModule) {
    return (
      <TraineeLayout>
        <div className="text-center py-20 text-neutral-500">Submodule not found.</div>
      </TraineeLayout>
    )
  }

  let videoUrl = subModule?.mainVideo?.url || ''
  if (!videoUrl.trim()) {
    videoUrl = 'https://content-management-files.canva.com/e712a1dd-f5e6-4ca3-9265-b5c4c4cec99a/feature_ai-generated-video_promo-showcase_01.mp4'
  }

  const pct = savedRec?.progressPercentage ?? 0
  const isDone = savedRec?.isCompleted === true

  return (
    <TraineeLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Link */}
        <Link
          href={`/courses/${courseId}/modules/${moduleId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors mb-2"
        >
          <MdArrowBack size={18} />
          Back to Module
        </Link>

        {/* Completion banner */}
        {isDone && (
          <div className="flex items-center gap-3 bg-success-50 border border-success-200 rounded-2xl px-5 py-3">
            <span className="text-success-600 text-xl">✅</span>
            <p className="text-sm font-semibold text-success-700">
              You have completed this submodule. You can re-watch any time.
            </p>
          </div>
        )}

        {/* Video Player */}
        <div className="aspect-video bg-dark-900 rounded-3xl overflow-hidden shadow-xl relative">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-cover"
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
            onSeeking={handleSeeking}
          >
            Your browser does not support the video tag.
          </video>
          {/* Progress bar overlay */}
          {pct > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-primary-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
        </div>

        {/* Content Card */}
        <Card className="p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-neutral-900">
              {subModule.title || 'Submodule'}
            </h1>
            {subModule.durationText && (
              <span className="text-sm font-semibold text-neutral-400 flex-shrink-0 mt-1">
                {subModule.durationText}
              </span>
            )}
          </div>

          <div className="space-y-6 text-neutral-700 leading-relaxed">
            {subModule.synopsis && <p>{subModule.synopsis}</p>}

            {subModule.whatYouWillLearn?.length > 0 && (
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">What you will learn</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {subModule.whatYouWillLearn.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}

            {subModule.extraContents?.reflectionQuestions?.length > 0 && (
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Reflection Questions</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {subModule.extraContents.reflectionQuestions.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            )}

            {subModule.extraContents?.activities?.length > 0 && (
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Activities</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {subModule.extraContents.activities.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            )}
          </div>

          <hr className="my-8 border-neutral-100" />

          <div className="flex justify-between items-center">
            <Link
              href={`/courses/${courseId}/modules/${moduleId}`}
              className="text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors"
            >
              ← Back to Module
            </Link>
            {pct > 0 && (
              <span className="text-xs font-semibold text-neutral-400">
                {isDone ? '100% — Completed' : `${pct}% watched`}
              </span>
            )}
          </div>
        </Card>

      </div>
    </TraineeLayout>
  )
}
