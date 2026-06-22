'use client'

import { FiBell, FiSearch, FiMenu } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'

export default function Header({ title, subtitle, user, isOpen, onMenuClick }) {
  const displayName = user?.fullName || user?.name || 'Trainee'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="fixed top-0 right-0 left-0 bg-white border-b border-neutral-200 flex items-center px-4 md:px-6 gap-3 md:gap-4 z-20 h-16 lg:left-[240px]">
      {/* ── Mobile Menu Toggle ────────────────────────────────────── */}
      <button 
        type="button"
        className="lg:hidden w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors relative z-50"
        onClick={(e) => {
          e.preventDefault()
          onMenuClick()
        }}
      >
        {isOpen ? <div className="p-1 bg-primary-100 rounded"><FiMenu size={20} className="text-primary-600" /></div> : <FiMenu size={20} />}
      </button>

      {/* ── Search ─────────────────────────────────────────── */}
      <div className="relative flex-1 max-w-sm hidden md:block">
        <FiSearch
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          placeholder="Search courses, modules…"
          className="w-full bg-neutral-100 border border-neutral-200 rounded-xl
                     pl-9 pr-4 py-2 text-sm text-neutral-700 placeholder:text-neutral-400
                     focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400
                     transition-all"
        />
      </div>

      <div className="flex-1" />

      {/* ── Notification bell ─────────────────────────────── */}
      <button
        className="relative w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200
                   flex items-center justify-center text-neutral-600 transition-colors"
      >
        <FiBell size={17} />
        {/* Unread dot */}
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500
                         rounded-full border-2 border-white" />
      </button>

      {/* ── User avatar ──────────────────────────────────── */}
      <div className="flex items-center gap-2.5">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-neutral-800 leading-tight">
            {displayName}
          </p>
          <p className="text-xs text-neutral-400 leading-tight">Trainee</p>
        </div>
        <div
          className="w-9 h-9 rounded-full bg-primary-500 text-white
                     flex items-center justify-center text-sm font-bold
                     flex-shrink-0 shadow"
        >
          {initials || 'T'}
        </div>
      </div>
    </header>
  )
}
