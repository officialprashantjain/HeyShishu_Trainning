'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { showToast } from '@/utils/toast'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

/**
 * TraineeLayout — the main shell for all protected trainee pages.
 * Sidebar (fixed left) + Header (fixed top) + scrollable content area.
 *
 * Props:
 *   user  — the logged-in trainee user object (passed from page/context)
 *   title — optional page title to show in the header
 */
export default function TraineeLayout({ children, title, subtitle }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // If auth state has resolved and the user is null, they should not be here.
    if (!loading && !user) {
      showToast.error("Please log in to access your portal.")
      router.push('/login')
    }
  }, [user, loading, router])

  // Prevent UI flashing unauthenticated content while token is being verified
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* Fixed Sidebar */}
      <Sidebar user={user} isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

      {/* Fixed Top Header */}
      <Header user={user} title={title} subtitle={subtitle} isOpen={isMobileOpen} onMenuClick={() => setIsMobileOpen(prev => !prev)} />

      {/* Scrollable main content */}
      <div className="pt-16 lg:ml-[240px] min-h-screen bg-neutral-100 flex-1 flex flex-col">
        <main className="p-4 md:p-6 w-full max-w-7xl mx-auto flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
