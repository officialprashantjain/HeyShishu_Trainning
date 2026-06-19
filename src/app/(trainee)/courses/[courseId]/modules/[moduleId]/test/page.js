'use client'

import TraineeLayout from '@/components/common/TraineeLayout'
import PageIndicator from '@/components/common/PageIndicator'

export default function ModuleTestPage({ params }) {
  return (
    <TraineeLayout>
      <PageIndicator 
        title="Module Test"
        description="Take the test for this module"
      />
    </TraineeLayout>
  )
}
