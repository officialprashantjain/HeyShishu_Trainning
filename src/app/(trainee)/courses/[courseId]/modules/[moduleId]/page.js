'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { MdArrowBack, MdCheckCircle, MdLock } from 'react-icons/md'
import { courseService } from '@/services/courseService'
import { showToast } from '@/utils/toast'

export default function ModulePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.courseId
  const moduleId = params?.moduleId

  const [moduleData, setModuleData] = useState(null)
  const [progressRecords, setProgressRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)

  // Video player refs
  const videoRef = useRef(null)
  const heartbeatRef = useRef(null)
  const hasSeekRef = useRef(false)
  const maxWatchedRef = useRef(0) // tracks furthest watched second locally

  // ── Helper: find a progress record ───────────────────────────
  const findRecord = useCallback(
    (records, { contentType, subModuleId = null }) =>
      records.find(
        (r) =>
          r.moduleId === moduleId &&
          r.contentType === contentType &&
          (subModuleId ? r.subModuleId === subModuleId : !r.subModuleId)
      ),
    [moduleId]
  )

  // ── Heartbeat helpers ─────────────────────────────────────────
  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current)
      heartbeatRef.current = null
    }
  }, [])

  const doSync = useCallback(() => {
    const video = videoRef.current
    if (!video || !courseId || !moduleId) return
    courseService.syncProgress({
      courseId,
      moduleId,
      contentType: 'module_video',
      currentPositionInSeconds: Math.floor(video.currentTime),
      totalVideoDurationInSeconds: Math.floor(video.duration) || 0,
    })
  }, [courseId, moduleId])

  const startHeartbeat = useCallback(() => {
    stopHeartbeat()
    heartbeatRef.current = setInterval(doSync, 10000)
  }, [doSync, stopHeartbeat])

  // ── Fetch data ────────────────────────────────────────────────
  useEffect(() => {
    if (!courseId || !moduleId) return
    let cancelled = false

    const load = async () => {
      try {
        const [modData, progData] = await Promise.all([
          courseService.getModuleDetails(courseId, moduleId),
          courseService.getCourseProgress(courseId),
        ])
        if (cancelled) return
        const mod = modData?.module || modData?.data?.module || modData
        setModuleData(mod)
        setProgressRecords(progData)
      } catch (err) {
        showToast.error('Error loading module: ' + err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [courseId, moduleId])

  // ── Seek to saved position once video metadata is ready ───────
  const handleLoadedMetadata = useCallback(() => {
    if (hasSeekRef.current) return
    const rec = findRecord(progressRecords, { contentType: 'module_video' })
    if (rec?.currentPositionInSeconds > 0 && videoRef.current) {
      videoRef.current.currentTime = rec.currentPositionInSeconds
    }
    hasSeekRef.current = true
  }, [progressRecords, findRecord])

  // ── Video event handlers ──────────────────────────────────────
  const handlePlay = useCallback(() => {
    startHeartbeat()
    // Also trigger startCourse on first play
    courseService.startCourse(courseId).catch(() => {})
  }, [startHeartbeat, courseId])

  const handlePause = useCallback(() => {
    stopHeartbeat()
    doSync() // sync current position on pause
  }, [stopHeartbeat, doSync])

  const handleEnded = useCallback(() => {
    stopHeartbeat()
    // Final sync at full duration
    const video = videoRef.current
    if (video && courseId && moduleId) {
      courseService.syncProgress({
        courseId,
        moduleId,
        contentType: 'module_video',
        currentPositionInSeconds: Math.floor(video.duration),
        totalVideoDurationInSeconds: Math.floor(video.duration),
      })
    }
  }, [stopHeartbeat, courseId, moduleId])

  // ── Anti-Scrubbing Logic ──────────────────────────────────────
  const isVideoDone = findRecord(progressRecords, { contentType: 'module_video' })?.isCompleted === true

  useEffect(() => {
    const rec = findRecord(progressRecords, { contentType: 'module_video' })
    if (rec?.currentPositionInSeconds && !hasSeekRef.current) {
      maxWatchedRef.current = Math.max(maxWatchedRef.current, rec.currentPositionInSeconds)
    }
  }, [progressRecords, findRecord])

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

  // Cleanup heartbeat on unmount
  useEffect(() => () => stopHeartbeat(), [stopHeartbeat])

  // ── Take Test ─────────────────────────────────────────────────
  const handleTakeTest = async () => {
    if (!courseId || !moduleId) return
    setIsCompleting(true)
    try {
      await courseService.updateCourseProgress(courseId, {
        moduleId,
        isCompleted: true,
        progressPercentage: 100,
      })
      router.push(`/tests?courseId=${courseId}&moduleId=${moduleId}`)
    } catch (error) {
      showToast.error(`Unable to update progress: ${error.message}`)
    } finally {
      setIsCompleting(false)
    }
  }

  // ── Render guards ─────────────────────────────────────────────
  if (loading) {
    return (
      <TraineeLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </TraineeLayout>
    )
  }

  if (!moduleData) {
    return (
      <TraineeLayout>
        <div className="text-center py-20 text-neutral-500">Module not found.</div>
      </TraineeLayout>
    )
  }

  let videoUrl = moduleData?.mainVideo?.url || moduleData?.videoUrl || ''
  if (!videoUrl.trim()) {
    videoUrl = 'https://content-management-files.canva.com/e712a1dd-f5e6-4ca3-9265-b5c4c4cec99a/feature_ai-generated-video_promo-showcase_01.mp4'
  }

  const subModules = moduleData?.subModules || []

  // Progress for the module's own video
  const modVideoRec = findRecord(progressRecords, { contentType: 'module_video' })
  const modVideoPct = modVideoRec?.progressPercentage ?? 0

  // ── Compute Test Eligibility ────────────────────────────────────
  const canTakeTest = (() => {
    const isMainVideoDone = modVideoRec?.isCompleted === true
    const areAllSubsDone = subModules.every((sub) => {
      const rec = findRecord(progressRecords, { contentType: 'submodule_video', subModuleId: sub._id })
      return rec?.isCompleted === true
    })
    return isMainVideoDone && areAllSubsDone
  })()

  // ── Check if max attempts reached ───────────────────────────────
  const hasReachedMaxAttempts = (() => {
    const maxAttempts = moduleData?.test?.maxAttempts
    const attemptCount = moduleData?.myModuleProgress?.testAttemptCount || 0
    return maxAttempts && attemptCount >= maxAttempts
  })()

  return (
    <TraineeLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Link */}
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors mb-2"
        >
          <MdArrowBack size={18} />
          Back to Modules
        </Link>

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
          {/* Video progress bar overlay */}
          {modVideoPct > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-primary-400 transition-all duration-500"
                style={{ width: `${modVideoPct}%` }}
              />
            </div>
          )}
        </div>

        {/* Content Card */}
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            {moduleData.title || 'Module Details'}
          </h1>
          <div className="space-y-6 text-neutral-700 leading-relaxed">
            {moduleData.summary && <p>{moduleData.summary}</p>}
            {moduleData.about && (
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">About this module</h3>
                <p className="text-sm">{moduleData.about}</p>
              </div>
            )}
            {moduleData.whyItMatters && (
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Why it matters</h3>
                <p className="text-sm">{moduleData.whyItMatters}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Submodules Section */}
        {subModules.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-neutral-900 mb-4 px-1">
              Submodules ({subModules.length})
            </h2>
            <div className="space-y-3">
              {subModules.map((sub, index) => {
                const subRec = findRecord(progressRecords, {
                  contentType: 'submodule_video',
                  subModuleId: sub._id,
                })
                const subPct = subRec?.progressPercentage ?? 0
                const subDone = subRec?.isCompleted === true

                return (
                  <Card
                    key={sub._id || index}
                    className="hover:border-primary-300 hover:shadow-card-md transition-all duration-200 cursor-pointer overflow-hidden"
                    onClick={() =>
                      router.push(`/courses/${courseId}/modules/${moduleId}/submodules/${sub._id}`)
                    }
                  >
                    <div className="p-4 flex items-center gap-4">
                      {/* Play / Done icon */}
                      <div className={`w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 ${subDone ? 'bg-success-100' : 'bg-primary-100'}`}>
                        {subDone ? (
                          <MdCheckCircle size={28} className="text-success-600" />
                        ) : (
                          <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </div>

                      {/* Info + progress bar */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-neutral-400 mb-0.5">Submodule {index + 1}</p>
                        <h3 className="font-bold text-neutral-900 truncate" title={sub.title}>
                          {sub.title}
                        </h3>
                        {sub.synopsis && (
                          <p className="text-sm text-neutral-500 truncate mt-0.5">{sub.synopsis}</p>
                        )}
                        {/* Thin progress bar under title */}
                        {(subPct > 0 || subDone) && (
                          <div className="mt-2 h-1 rounded-full bg-neutral-200 overflow-hidden max-w-[200px]">
                            <div
                              className="h-full bg-primary-400 rounded-full transition-all duration-500"
                              style={{ width: `${subDone ? 100 : subPct}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Duration & Progress text */}
                      <div className="hidden sm:flex flex-col items-end px-4 min-w-[80px]">
                        {sub.durationText && (
                          <span className="text-sm font-semibold text-neutral-400">
                            {sub.durationText}
                          </span>
                        )}
                        {(subPct > 0 || subDone) && (
                           <span className="text-xs font-bold text-primary-600 mt-1">
                             {subDone ? 100 : subPct}%
                           </span>
                        )}
                      </div>

                      {/* Status badge / arrow */}
                      {subDone ? (
                        <span className="text-xs font-bold text-success-600 bg-success-100 px-2 py-1 rounded-full flex-shrink-0">
                          Done
                        </span>
                      ) : (
                        <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Take Module Test — after all submodules */}
        <div className="flex flex-col items-end pt-2 pb-6">
          {!canTakeTest ? (
            <div className="text-right flex flex-col items-end">
              <p className="text-sm font-semibold text-neutral-500 mb-3 bg-neutral-100 px-4 py-2 rounded-lg inline-block">
                Watch the module video and all submodules to 100% to unlock the test.
              </p>
              <Button variant="ghost" size="lg" disabled className="opacity-50 cursor-not-allowed">
                <MdLock size={18} className="mr-2" />
                Test Locked
              </Button>
            </div>
          ) : hasReachedMaxAttempts ? (
            <div className="text-right flex flex-col items-end">
              <p className="text-sm font-semibold text-neutral-500 mb-3 bg-neutral-100 px-4 py-2 rounded-lg inline-block">
                You have reached the maximum attempts for this test.
              </p>
              <Link href={`/courses/${courseId}/modules/${moduleId}/test`}>
                <Button variant="secondary" size="lg">
                  Review Test Results
                </Button>
              </Link>
            </div>
          ) : (
            <Button variant="primary" size="lg" onClick={handleTakeTest} disabled={isCompleting}>
              {isCompleting ? 'Saving Progress...' : 'Take Module Test'}
            </Button>
          )}
        </div>

      </div>
    </TraineeLayout>
  )
}
