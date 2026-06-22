'use client'

import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { MdArrowBack, MdPlayCircle, MdLock, MdCheckCircle } from 'react-icons/md'

const dummyModules = [
  { id: 'm1', title: 'Introduction to Child Development', duration: '15m', isCompleted: true, isLocked: false },
  { id: 'm2', title: 'Cognitive Milestones', duration: '25m', isCompleted: true, isLocked: false },
  { id: 'm3', title: 'Emotional & Social Growth', duration: '20m', isCompleted: false, isLocked: false },
  { id: 'm4', title: 'Recognizing Developmental Delays', duration: '30m', isCompleted: false, isLocked: true },
]

export default function CourseDetailPage() {
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
            <Badge variant="blue" className="mb-4 inline-flex">In Progress — 50%</Badge>
            <h1 className="text-3xl font-extrabold mb-3">Child Development Basics</h1>
            <p className="text-neutral-400 max-w-2xl leading-relaxed">
              Understand the physiological and psychological milestones in early childhood. 
              This structured course will prepare you to handle different age groups effectively.
            </p>
          </div>
        </div>

        {/* Modules List */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-4 px-1">Course Modules</h2>
          
          <div className="space-y-3">
            {dummyModules.map((mod, index) => (
              <Card key={mod.id} className={`transition-all duration-200 ${mod.isLocked ? 'opacity-75' : 'hover:border-primary-300 hover:shadow-card-md'}`}>
                <div className="p-4 flex items-center gap-4">
                  
                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    mod.isCompleted ? 'bg-success-100 text-success-600' :
                    mod.isLocked ? 'bg-neutral-100 text-neutral-400' : 'bg-primary-100 text-primary-600'
                  }`}>
                    {mod.isCompleted ? <MdCheckCircle size={22} /> :
                     mod.isLocked ? <MdLock size={20} /> : <MdPlayCircle size={22} />}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-400 mb-0.5">Module {index + 1}</p>
                    <h3 className={`font-bold truncate ${mod.isLocked ? 'text-neutral-500' : 'text-neutral-900'}`}>
                      {mod.title}
                    </h3>
                  </div>

                  {/* Duration */}
                  <div className="hidden sm:block text-sm font-semibold text-neutral-400 px-4">
                    {mod.duration}
                  </div>
                  
                  {/* Action */}
                  <div>
                    {mod.isLocked ? (
                      <Button variant="ghost" disabled className="min-w-[100px]">Locked</Button>
                    ) : mod.isCompleted ? (
                      <Link href={`/courses/c1/modules/${mod.id}`}>
                        <Button variant="outline" className="min-w-[100px]">Review</Button>
                      </Link>
                    ) : (
                      <Link href={`/courses/c1/modules/${mod.id}`}>
                        <Button variant="primary" className="min-w-[100px]">Start</Button>
                      </Link>
                    )}
                  </div>

                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </TraineeLayout>
  )
}
