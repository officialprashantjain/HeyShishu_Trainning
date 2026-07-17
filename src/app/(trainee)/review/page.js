'use client'

import { useState, useEffect } from 'react'
import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import { MdOutlineRateReview, MdAccessTime, MdCheckCircle } from 'react-icons/md'
import { courseService } from '@/services/courseService'

export default function ReviewPage() {
  const [cycleStatus, setCycleStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await courseService.getAllCourses()
        setCycleStatus(data?.cycleStatus || data?.data?.cycleStatus || 'training_in_progress')
      } catch (error) {
        console.error('Failed to fetch cycleStatus', error)
        setCycleStatus('training_in_progress') // fallback
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
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

  const isApproved = cycleStatus === 'approved'
  
  // Logic for Step 1
  const s1Done = cycleStatus !== 'training_in_progress'
  // Logic for Step 2
  const s2InProgress = cycleStatus === 'review_requested' || cycleStatus === 'under_review'
  const s2Done = isApproved
  // Logic for Step 3
  const s3Done = isApproved

  return (
    <TraineeLayout>
      <div className="max-w-3xl mx-auto space-y-6 flex flex-col items-center justify-center min-h-[70vh] text-center">
        
        <div className={`w-24 h-24 ${isApproved ? 'bg-success-50 text-success-500' : 'bg-warning-50 text-warning-500'} rounded-full flex items-center justify-center mb-4 ${!isApproved ? 'animate-pulse' : ''}`}>
          {isApproved ? <MdCheckCircle size={48} /> : <MdOutlineRateReview size={48} />}
        </div>

        <h1 className="text-3xl font-extrabold text-neutral-900">
          {isApproved ? 'Application Approved!' : 'Application Under Review'}
        </h1>
        <p className="text-neutral-500 max-w-lg leading-relaxed mb-6">
          {isApproved 
            ? 'Congratulations! Your application has been approved and your credentials are ready.'
            : 'You have successfully completed all your training modules and tests. Your application is currently being reviewed by a HeyShishu counselor.'}
        </p>

        <Card className="w-full text-left p-6">
          <h3 className="font-bold text-neutral-900 mb-4">What happens next?</h3>
          <ul className="space-y-4">
            {/* Step 1 */}
            <li className={`flex gap-3 ${s1Done ? '' : 'opacity-50'}`}>
              {s1Done ? (
                <MdCheckCircle className="text-success-500 flex-shrink-0 mt-0.5" size={20} />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-neutral-300 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-semibold text-neutral-800">Training Completed</p>
                <p className="text-xs text-neutral-500">All tests passed successfully.</p>
              </div>
            </li>
            
            {/* Step 2 */}
            <li className={`flex gap-3 ${s2InProgress || s2Done ? '' : 'opacity-50'}`}>
              {s2Done ? (
                <MdCheckCircle className="text-success-500 flex-shrink-0 mt-0.5" size={20} />
              ) : s2InProgress ? (
                <MdAccessTime className="text-warning-500 flex-shrink-0 mt-0.5" size={20} />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-neutral-300 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  {s2Done ? 'Counselor Review (Completed)' : s2InProgress ? 'Counselor Review (In Progress)' : 'Counselor Review'} 
                </p>
                <p className="text-xs text-neutral-500">
                  {s2Done 
                    ? 'A counselor has successfully reviewed your results.'
                    : cycleStatus === 'under_review' 
                      ? 'A counselor is reviewing your results and will schedule a quick Zoom call soon.'
                      : cycleStatus === 'review_requested'
                        ? 'Your request has been received. A counselor will be assigned soon.'
                        : 'A counselor will review your results and schedule a call.'}
                </p>
              </div>
            </li>

            {/* Step 3 */}
            <li className={`flex gap-3 ${s3Done ? '' : 'opacity-50'}`}>
              {s3Done ? (
                <MdCheckCircle className="text-success-500 flex-shrink-0 mt-0.5" size={20} />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-neutral-300 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  {s3Done ? 'Admin Final Approval (Done)' : 'Admin Final Approval'}
                </p>
                <p className="text-xs text-neutral-500">
                  {s3Done 
                    ? 'Administration has finalized your credentials.' 
                    : 'After the counselor report, administration will finalize your credentials.'}
                </p>
              </div>
            </li>
          </ul>
        </Card>

      </div>
    </TraineeLayout>
  )
}
