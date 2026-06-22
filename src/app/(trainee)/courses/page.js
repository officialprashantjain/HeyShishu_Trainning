'use client'

import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { MdPlayCircle, MdCheckCircle, MdAccessTime, MdArrowForward } from 'react-icons/md'
import Link from 'next/link'

const dummyCourses = [
  {
    id: 'c1',
    title: 'Child Development Basics',
    description: 'Understand the physiological and psychological milestones in early childhood.',
    modules: 5,
    duration: '2h 30m',
    status: 'training_completed',
    progress: 100,
  },
  {
    id: 'c2',
    title: 'Nutrition & Safe Feeding',
    description: 'Learn preparing meals, handling allergies, and safe feeding practices for infants and toddlers.',
    modules: 4,
    duration: '1h 45m',
    status: 'training_in_progress',
    progress: 40,
  },
  {
    id: 'c3',
    title: 'First Aid & Emergency Response',
    description: 'Essential crisis management, CPR basics, and handling common childhood injuries.',
    modules: 6,
    duration: '3h 15m',
    status: 'pending',
    progress: 0,
  }
]

export default function CoursesPage() {
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

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dummyCourses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <Card.Body className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                    <MdPlayCircle size={22} />
                  </div>
                  {course.progress === 100 ? (
                    <Badge variant="green" dot>Completed</Badge>
                  ) : course.progress > 0 ? (
                    <Badge variant="blue" dot>In Progress</Badge>
                  ) : (
                    <Badge variant="gray">Not Started</Badge>
                  )}
                </div>
                
                <h3 className="font-bold text-neutral-900 mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-neutral-500 line-clamp-2 mb-6">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold text-neutral-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <MdCheckCircle className="text-neutral-400" size={16} />
                    <span>{course.modules} Modules</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MdAccessTime className="text-neutral-400" size={16} />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-neutral-700">Course Progress</span>
                    <span className="font-bold text-neutral-900">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${course.progress === 100 ? 'bg-success-500' : 'bg-primary-500'}`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </Card.Body>

              <Card.Footer className="border-t border-neutral-100 bg-neutral-50/50">
                <Link href={`/courses/${course.id}`} className="w-full">
                  <Button 
                    variant={course.progress === 100 ? 'outline' : 'primary'} 
                    className="w-full justify-between group"
                  >
                    {course.progress === 100 ? 'Review Course' : course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                    <MdArrowForward className="transition-transform group-hover:translate-x-1" size={18} />
                  </Button>
                </Link>
              </Card.Footer>
            </Card>
          ))}
        </div>

      </div>
    </TraineeLayout>
  )
}
