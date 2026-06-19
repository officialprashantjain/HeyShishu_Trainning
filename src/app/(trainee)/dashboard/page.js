'use client'

import TraineeLayout from '@/components/common/TraineeLayout'
import PageIndicator from '@/components/common/PageIndicator'

export default function DashboardPage() {
  return (
    <TraineeLayout>
      <PageIndicator 
        title="Dashboard"
        description="View your training progress and courses"
      />
    </TraineeLayout>
  )
}
