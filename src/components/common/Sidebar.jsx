'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MdDashboard,
  MdMenuBook,
  MdAssignment,
  MdRateReview,
  MdPayment,
  MdLogout,
} from 'react-icons/md'
import { FaGraduationCap } from 'react-icons/fa'

const navItems = [
  {
    label: 'Dashboard',
    href:  '/dashboard',
    icon:  <MdDashboard size={20} />,
  },
  {
    label: 'My Courses',
    href:  '/courses',
    icon:  <MdMenuBook size={20} />,
  },
  {
    label: 'Tests',
    href:  '/tests',
    icon:  <MdAssignment size={20} />,
  },
  {
    label: 'My Review',
    href:  '/review',
    icon:  <MdRateReview size={20} />,
  },
  {
    label: 'Payment',
    href:  '/payment',
    icon:  <MdPayment size={20} />,
  },
]

import { useAuth } from '@/context/AuthContext'

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Background Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[50] bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed left-0 top-0 h-screen w-[240px] flex flex-col bg-dark-900 text-white transform transition-transform duration-300 ease-in-out z-[60] ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
      {/* ── Logo ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
          <FaGraduationCap size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">HeyShishu</p>
          <p className="text-neutral-400 text-xs leading-tight">Training Portal</p>
        </div>
      </div>

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest px-6 mb-2">
          Menu
        </p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer border-r-[3px] border-transparent ${
              isActive(item.href)
                ? 'bg-primary-500/20 text-primary-400 border-primary-400 hover:bg-primary-500/30'
                : 'text-neutral-300 hover:bg-dark-800 hover:text-white'
            }`}
            onClick={() => {
              if (window.innerWidth < 1024) onClose()
            }}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* ── User + Logout ────────────────────────────────── */}
      <div className="border-t border-white/10 p-3">
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center
                          justify-center text-white text-sm font-bold flex-shrink-0">
            T
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.fullName || 'Trainee'}</p>
            <p className="text-neutral-400 text-xs truncate">In Training</p>
          </div>
        </div>

        <button
          className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer w-[calc(100%-1rem)] text-danger-400 hover:text-danger-300 hover:bg-danger-500/10"
          onClick={() => {
            onClose && onClose()
            logout()
          }}
        >
          <MdLogout size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  )
}
