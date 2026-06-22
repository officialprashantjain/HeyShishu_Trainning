'use client'

import TraineeLayout from '@/components/common/TraineeLayout'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { MdArrowBack, MdPlayCircle } from 'react-icons/md'

export default function ModulePage() {
  return (
    <TraineeLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link href="/courses/c1" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors mb-2">
          <MdArrowBack size={18} />
          Back to Course
        </Link>
        
        {/* Video Player Dummy */}
        <div className="w-full aspect-video bg-dark-950 rounded-2xl flex flex-col items-center justify-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-primary-500/10" />
          <MdPlayCircle size={64} className="text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer z-10" />
          <p className="mt-4 font-semibold z-10">Play Training Video</p>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Module 1: Introduction to Child Development</h1>
          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-600 leading-relaxed">
              Welcome to the first module of the Child Development Basics course. In this module, 
              we will cover the foundational physiological milestones that infants and toddlers experience 
              during their first 24 months. 
            </p>
            <p className="text-neutral-600 leading-relaxed mt-4">
              Please watch the video above entirely. Once you have completed the video and read through 
              any attached PDF materials, you may proceed to the Module MCQ Test. You must pass the test 
              with a minimum score of 80% to unlock Module 2.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end">
            <Link href="/courses/c1/modules/m1/test">
              <Button variant="primary">Take Module Test</Button>
            </Link>
          </div>
        </div>

      </div>
    </TraineeLayout>
  )
}
