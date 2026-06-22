'use client'

import { useState } from 'react'
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
export default function TraineeLayout({ children, user, title, subtitle }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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
