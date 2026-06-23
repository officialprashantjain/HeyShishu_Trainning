'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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

  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!courseId) return
        const data = await courseService.getCourseDetails(courseId)
        // Data contains { modules: [...], myProgress: {...} } based on our setup
        setCourseData(data)
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

  const { modules = [], myProgress } = courseData
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
            <Badge variant={isCompleted ? "green" : isStarted ? "blue" : "gray"} className="mb-4 inline-flex">
              {isCompleted ? `Completed` : isStarted ? `In Progress — ${progressPct}%` : 'Not Started'}
            </Badge>
            <h1 className="text-3xl font-extrabold mb-3">Course Modules</h1>
            <p className="text-neutral-400 max-w-2xl leading-relaxed">
              Complete each module sequentially. Watch the videos attached and submit the final MCQ tests to advance to the next section.
            </p>
          </div>
        </div>

        {/* Modules List */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-4 px-1">Modules ({modules.length})</h2>
          
          <div className="space-y-3">
            {modules.map((mod, index) => {
              // Note: Backend JSON did not explicitly declare 'isLocked' or 'isCompleted' per module inside the array natively without checking myProgress.moduleProgress array.
              // For demonstration, we allow all of them to be clickable according to strict design guidelines until backend locks them tightly.
              const isModCompleted = false; // We can evaluate this when myProgress.moduleProgress logic is visible
              const isLocked = false;       

              return (
                <Card key={mod._id} className={`transition-all duration-200 ${isLocked ? 'opacity-75' : 'hover:border-primary-300 hover:shadow-card-md'}`}>
                  <div className="p-4 flex items-center gap-4">
                    
                    {/* Status Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isModCompleted ? 'bg-success-100 text-success-600' :
                      isLocked ? 'bg-neutral-100 text-neutral-400' : 'bg-primary-100 text-primary-600'
                    }`}>
                      {isModCompleted ? <MdCheckCircle size={22} /> :
                       isLocked ? <MdLock size={20} /> : <MdPlayCircle size={22} />}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-400 mb-0.5">Module {index + 1}</p>
                      <h3 className={`font-bold truncate ${isLocked ? 'text-neutral-500' : 'text-neutral-900'}`} title={mod.title}>
                        {mod.title}
                      </h3>
                    </div>

                    {/* Duration */}
                    <div className="hidden sm:block text-sm font-semibold text-neutral-400 px-4">
                      {mod.durationText}
                    </div>
                    
                    {/* Action */}
                    <div>
                      {isLocked ? (
                        <Button variant="ghost" disabled className="min-w-[100px]">Locked</Button>
                      ) : isModCompleted ? (
                        <Link href={`/courses/${courseId}/modules/${mod._id}`}>
                          <Button variant="outline" className="min-w-[100px]">Review</Button>
                        </Link>
                      ) : (
                        <Link href={`/courses/${courseId}/modules/${mod._id}`}>
                          <Button variant="primary" className="min-w-[100px]">Start</Button>
                        </Link>
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
