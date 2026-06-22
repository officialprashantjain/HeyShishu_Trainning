'use client'

import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function TestPage() {
  return (
    <TraineeLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-primary-50 p-4 border border-primary-100 rounded-xl">
          <div>
            <h1 className="font-bold text-primary-900">Module 1 Final Test</h1>
            <p className="text-xs text-primary-600">Question 1 of 5</p>
          </div>
          <div className="text-lg font-mono font-bold text-danger-500 bg-white px-3 py-1.5 rounded-lg border border-danger-100 shadow-sm">
            14:59
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <Card.Body>
            <h2 className="text-lg font-bold text-neutral-900 mb-6">
              When do most infants typically begin to exhibit the &quot;pincer grasp&quot;?
            </h2>
            
            <div className="space-y-3">
              {[
                'Between 2 to 4 months',
                'Between 4 to 6 months',
                'Between 9 to 12 months',
                'After 15 months'
              ].map((option, i) => (
                <label key={i} className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:border-primary-300 cursor-pointer transition-colors">
                  <input type="radio" name="q1" className="w-5 h-5 text-primary-500" />
                  <span className="text-neutral-700 font-medium">{option}</span>
                </label>
              ))}
            </div>
          </Card.Body>
          <Card.Footer className="flex justify-between items-center bg-neutral-50/50">
            <Button variant="ghost" disabled>Previous</Button>
            <Button variant="primary">Next Question</Button>
          </Card.Footer>
        </Card>

      </div>
    </TraineeLayout>
  )
}
