'use client'

import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import { MdOutlineRateReview, MdAccessTime, MdCheckCircle } from 'react-icons/md'

export default function ReviewPage() {
  return (
    <TraineeLayout>
      <div className="max-w-3xl mx-auto space-y-6 flex flex-col items-center justify-center min-h-[70vh] text-center">
        
        <div className="w-24 h-24 bg-warning-50 rounded-full flex items-center justify-center text-warning-500 mb-4 animate-pulse">
          <MdOutlineRateReview size={48} />
        </div>

        <h1 className="text-3xl font-extrabold text-neutral-900">Application Under Review</h1>
        <p className="text-neutral-500 max-w-lg leading-relaxed mb-6">
          You have successfully completed all your training modules and tests. 
          Your application is currently being reviewed by a HeyShishu counselor.
        </p>

        <Card className="w-full text-left p-6">
          <h3 className="font-bold text-neutral-900 mb-4">What happens next?</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <MdCheckCircle className="text-success-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-neutral-800">Training Completed</p>
                <p className="text-xs text-neutral-500">All tests passed successfully.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <MdAccessTime className="text-warning-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-neutral-800">Counselor Review (In Progress)</p>
                <p className="text-xs text-neutral-500">A counselor is reviewing your results and will schedule a quick Zoom call soon.</p>
              </div>
            </li>
            <li className="flex gap-3 opacity-50">
              <div className="w-5 h-5 rounded-full border-2 border-neutral-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-neutral-800">Admin Final Approval</p>
                <p className="text-xs text-neutral-500">After the counselor report, administration will finalize your credentials.</p>
              </div>
            </li>
          </ul>
        </Card>

      </div>
    </TraineeLayout>
  )
}
