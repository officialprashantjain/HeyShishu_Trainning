'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { MdArrowBack } from 'react-icons/md'
import { courseService } from '@/services/courseService'
import { showToast } from '@/utils/toast'

export default function ModulePage() {
  const params = useParams()
  const courseId = params?.courseId
  const moduleId = params?.moduleId

  const [moduleData, setModuleData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModule = async () => {
      try {
        if (!courseId || !moduleId) return
        const data = await courseService.getModuleDetails(courseId, moduleId)
        setModuleData(data)
      } catch (error) {
         showToast.error("Error loading module: " + error.message)
      } finally {
         setLoading(false)
      }
    }
    fetchModule()
  }, [courseId, moduleId])

  if (loading) {
    return (
      <TraineeLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      </TraineeLayout>
    )
  }

  if (!moduleData) {
    return (
      <TraineeLayout>
        <div className="text-center py-20 text-neutral-500">Module not found.</div>
      </TraineeLayout>
    )
  }

  // Fallback video logic
  let videoUrl = moduleData.mainVideo?.url
  if (!videoUrl || videoUrl.trim() === '') {
     videoUrl = "https://content-management-files.canva.com/e712a1dd-f5e6-4ca3-9265-b5c4c4cec99a/feature_ai-generated-video_promo-showcase_01.mp4"
  }

  return (
    <TraineeLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link href={`/courses/${courseId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors mb-2">
          <MdArrowBack size={18} />
          Back to Modules
        </Link>
        
        {/* Video Player Section */}
        <div className="aspect-video bg-dark-900 rounded-3xl overflow-hidden shadow-xl relative">
           <video 
             src={videoUrl} 
             controls 
             className="w-full h-full object-cover"
             poster="https://example.com/thumbnail.png"
           >
             Your browser does not support the video tag.
           </video>
        </div>

        {/* Content Section */}
        <Card className="p-8">
           <h1 className="text-2xl font-bold text-neutral-900 mb-4">
             {moduleData.title || "Module Details"}
           </h1>
           
           <div className="space-y-6 text-neutral-700 leading-relaxed">
             {moduleData.summary && (
                <div>
                   <p>{moduleData.summary}</p>
                </div>
             )}

             {moduleData.about && (
                <div>
                   <h3 className="font-semibold text-neutral-900 mb-1">About this module</h3>
                   <p className="text-sm">{moduleData.about}</p>
                </div>
             )}

             {moduleData.whyItMatters && (
                <div>
                   <h3 className="font-semibold text-neutral-900 mb-1">Why it matters</h3>
                   <p className="text-sm">{moduleData.whyItMatters}</p>
                </div>
             )}
           </div>

           <hr className="my-8 border-neutral-100" />

           <div className="flex justify-end">
              <Button variant="primary" size="lg">
                 Take Module Test
              </Button>
           </div>
        </Card>
      </div>
    </TraineeLayout>
  )
}
