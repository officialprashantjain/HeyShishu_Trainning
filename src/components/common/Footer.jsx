'use client'

export default function Footer() {
  return (
    <footer className="ml-0  border-t border-neutral-200 bg-white px-6 py-3 mt-auto">
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>© {new Date().getFullYear()} HeyShishu Training Portal</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  )
}
