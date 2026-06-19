'use client'

import TraineeLayout from '@/components/common/TraineeLayout'
import PageIndicator from '@/components/common/PageIndicator'

export default function CourseDetailPage({ params }) {
  return (
    <TraineeLayout>
      <PageIndicator 
        title={`Course: ${params.courseId}`}
        description="View course modules and content"
      />
    </TraineeLayout>
  )
}
