'use client'

import TraineeLayout from '@/components/common/TraineeLayout'
import PageIndicator from '@/components/common/PageIndicator'

export default function ModuleContentPage({ params }) {
  return (
    <TraineeLayout>
      <PageIndicator 
        title={`Module: ${params.moduleId}`}
        description="View module content and lessons"
      />
    </TraineeLayout>
  )
}
