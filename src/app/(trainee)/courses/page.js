'use client'

import TraineeLayout from '@/components/common/TraineeLayout'
import PageIndicator from '@/components/common/PageIndicator'

export default function CoursesPage() {
  return (
    <TraineeLayout>
      <PageIndicator 
        title="Courses"
        description="Browse your assigned training courses"
      />
    </TraineeLayout>
  )
}
