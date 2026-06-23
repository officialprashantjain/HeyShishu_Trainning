'use client'

import { useState, useEffect } from 'react'
import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { MdPlayCircle, MdArrowForward } from 'react-icons/md'
import Link from 'next/link'
import { courseService } from '@/services/courseService'
import { showToast } from '@/utils/toast'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await courseService.getAllCourses()
        setCourses(data?.courses || [])
      } catch (error) {
        showToast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    loadCourses()
  }, [])

  if (loading) {
    return (
      <TraineeLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      </TraineeLayout>
    )
  }

  return (
    <TraineeLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Courses</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Complete all assigned courses to become eligible for the counselor review.
          </p>
        </div>

        {courses.length === 0 ? (
          <Card padding="lg" className="text-center bg-white">
            <h3 className="text-lg font-semibold text-neutral-700">No Courses Assigned Yet</h3>
            <p className="text-neutral-500 text-sm mt-1">
              Check back later or contact your administrator.
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => {
              const progressPct = course.myProgress ? course.myProgress.overallPercentage : 0
              const isCompleted = course.myProgress?.isCompleted || false
              const isStarted = !!course.myProgress
              
              // Handle optional status calculations based on completion
              const statusBadge = isCompleted 
                  ? { label: 'Completed', variant: 'green' }
                  : isStarted 
                  ? { label: 'In Progress', variant: 'blue' }
                  : { label: 'Not Started', variant: 'gray' }

              return (
                <Card key={course._id} className="flex flex-col">
                  <Card.Body className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shadow-sm overflow-hidden text-lg">
                         <MdPlayCircle size={22} />
                      </div>
                      <Badge variant={statusBadge.variant} dot>{statusBadge.label}</Badge>
                    </div>
                    
                    <h3 className="font-bold text-neutral-900 mb-2 line-clamp-1" title={course.title}>
                      {course.title}
                    </h3>
                    <p className="text-sm text-neutral-500 line-clamp-2 mb-6" title={course.subtitle}>
                      {course.subtitle || 'No description provided.'}
                    </p>

                    {/* Progress Bar Container */}
                    <div className="space-y-1.5 mt-auto">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-neutral-700">Course Progress</span>
                        <span className="font-bold text-neutral-900">{progressPct}%</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-success-500' : 'bg-primary-500'}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </Card.Body>

                  <Card.Footer className="border-t border-neutral-100 bg-neutral-50/50">
                    <Link href={`/courses/${course._id}`} className="w-full">
                      <Button 
                        variant={isCompleted ? 'outline' : 'primary'} 
                        className="w-full justify-between group"
                      >
                        {isCompleted ? 'Review Course' : isStarted ? 'Continue Learning' : 'Start Course'}
                        <MdArrowForward className="transition-transform group-hover:translate-x-1" size={18} />
                      </Button>
                    </Link>
                  </Card.Footer>
                </Card>
              )
            })}
          </div>
        )}

      </div>
    </TraineeLayout>
  )
}
