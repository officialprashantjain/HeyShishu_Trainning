'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { MdArrowBack, MdPlayCircle, MdLock, MdCheckCircle } from 'react-icons/md'
import { courseService } from '@/services/courseService'
import { showToast } from '@/utils/toast'

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params?.courseId
  const router = useRouter()

  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!courseId) return
        const data = await courseService.getCourseDetails(courseId)
        const normalizedCourse = data?.course || data?.data?.course || data
        setCourseData(normalizedCourse)
      } catch (error) {
         showToast.error("Error loading course: " + error.message)
      } finally {
         setLoading(false)
      }
    }
    fetchDetails()
  }, [courseId])

  if (loading) {
    return (
      <TraineeLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      </TraineeLayout>
    )
  }

  if (!courseData) {
    return (
      <TraineeLayout>
        <div className="text-center py-20 text-neutral-500">Course not found.</div>
      </TraineeLayout>
    )
  }

  const moduleList = courseData?.modules?.data || courseData?.modules || []
  const myProgress = courseData?.myProgress || courseData?.progress
  const progressPct = myProgress?.overallPercentage || 0
  const isCompleted = myProgress?.isCompleted || false
  const isStarted = !!myProgress

  return (
    <TraineeLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors mb-2">
          <MdArrowBack size={18} />
          Back to Courses
        </Link>
        
        {/* Header */}
        <div className="bg-dark-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={isCompleted ? "green" : isStarted ? "blue" : "gray"}>
                {isCompleted ? `Completed` : isStarted ? `In Progress` : 'Not Started'}
              </Badge>
              {isStarted && (
                <span className="text-sm font-bold text-neutral-300">{progressPct}%</span>
              )}
            </div>

            {/* Overall Course Progress Bar */}
            {isStarted && (
              <div className="w-full max-w-md h-2 bg-dark-800 rounded-full overflow-hidden mb-6 border border-dark-700">
                <div 
                  className={`h-full transition-all duration-700 ${isCompleted ? 'bg-success-500' : 'bg-primary-500'}`}
                  style={{ width: `${isCompleted ? 100 : progressPct}%` }}
                />
              </div>
            )}

            <h1 className="text-3xl font-extrabold mb-3">Course Modules</h1>
            <p className="text-neutral-400 max-w-2xl leading-relaxed">
              Complete each module sequentially. Watch the videos attached and submit the final MCQ tests to advance to the next section.
            </p>
          </div>
        </div>

        {/* Modules List */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-4 px-1">Modules ({moduleList.length})</h2>
          
          <div className="space-y-3">
            {moduleList.map((mod, index) => {
              const moduleId = mod?._id || mod?.id
              const thisModProg = myProgress?.moduleProgress?.find(p => p.moduleId === moduleId)
              const isModCompleted = thisModProg?.isCompleted || mod?.isCompleted || mod?.completed || false

              let isModLocked = mod?.isLocked || mod?.locked || false

              // Sequential Frontend Locking Logic: Lock if previous module isn't completed
              if (index > 0 && !isModLocked) {
                const prevMod = moduleList[index - 1]
                const prevModId = prevMod?._id || prevMod?.id
                const prevModProg = myProgress?.moduleProgress?.find(p => p.moduleId === prevModId)
                const isPrevCompleted = prevModProg?.isCompleted || prevMod?.isCompleted || false
                
                if (!isPrevCompleted) {
                  isModLocked = true
                }
              }

              const isUpNext = !isModLocked && !isModCompleted

              return (
                <Card 
                  key={moduleId || index} 
                  className={`transition-all duration-200 relative ${isModLocked ? 'opacity-60 bg-neutral-50' : 'hover:border-primary-300 hover:shadow-card-md'}`}
                >
                  {/* "Up Next" Indicator */}
                  {isUpNext && (
                    <div className="absolute -top-3 left-6 flex">
                      <span className="bg-primary-500 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        Up Next
                      </span>
                    </div>
                  )}

                  <div className={`p-4 flex items-center gap-4 ${isUpNext ? 'pt-5' : ''}`}>
                    
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isModCompleted ? 'bg-success-100 text-success-600' :
                      isModLocked ? 'bg-neutral-100 text-neutral-400' : 
                      isUpNext ? 'bg-primary-500 text-white shadow-md' : 'bg-primary-100 text-primary-600'
                    }`}>
                      {isModCompleted ? <MdCheckCircle size={24} /> :
                       isModLocked ? <MdLock size={22} /> : <MdPlayCircle size={24} />}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-400 mb-0.5">Module {index + 1}</p>
                      <h3 className={`font-bold truncate ${isModLocked ? 'text-neutral-500' : 'text-neutral-900'}`} title={mod.title}>
                        {mod.title}
                      </h3>
                      
                      {/* Optional inline progress bar for the module if started but not done */}
                      {!isModLocked && !isModCompleted && (
                        (() => {
                          const pct = thisModProg?.progressPercentage || 0;
                          return pct > 0 ? (
                            <div className="mt-2 h-1 rounded-full bg-neutral-200 overflow-hidden max-w-[200px]">
                              <div
                                className="h-full bg-primary-400 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          ) : null;
                        })()
                      )}
                    </div>

                    {/* Duration / Progress Text */}
                    <div className="hidden sm:flex flex-col items-end px-4 min-w-[80px]">
                      <span className="text-sm font-semibold text-neutral-400">
                        {mod.durationText}
                      </span>
                      {!isModLocked && (
                        <span className="text-xs font-bold text-primary-600 mt-1">
                          {isModCompleted ? '100%' : (
                            (() => {
                              const pct = thisModProg?.progressPercentage || 0;
                              return pct > 0 ? `${pct}%` : '0%';
                            })()
                          )}
                        </span>
                      )}
                    </div>
                    
                    {/* Action */}
                    <div>
                      {isModLocked ? (
                        <Button variant="ghost" disabled className="min-w-[100px]">Locked</Button>
                      ) : isModCompleted ? (
                        <Button onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}`)} variant="outline" className="min-w-[100px]">Review</Button>
                      ) : (
                        <Button onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}`)} variant="primary" className="min-w-[100px]">
                          {isUpNext ? 'Start' : 'Resume'}
                        </Button>
                      )}
                    </div>

                  </div>
                </Card>
              )
            })}
          </div>
        </div>

      </div>
    </TraineeLayout>
  )
}
