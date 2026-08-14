'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { MdLockOutline } from 'react-icons/md'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

export default function PaymentLockOverlay({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) return <div>{children}</div>

  const isLocked = user && user.paymentStatus !== 'paid'

  return (
    <div className="relative w-full h-full min-h-full flex-1">
      {/* Background content (Locked) */}
      <div className={isLocked ? "filter blur-[2px] select-none pointer-events-none opacity-70 transition-all duration-300 h-full" : "h-full"}>
        {children}
      </div>

      {/* Foreground Lock Screen */}
      {isLocked && (
        <div className="absolute inset-0 z-40 flex flex-col items-start justify-start pt-[15vh] pb-[10vh] px-4 overflow-y-auto w-full h-full bg-white/20 backdrop-blur-[1px]">
          <div className="bg-white/95 p-8 rounded-2xl shadow-xl max-w-sm text-center mx-auto border border-neutral-100 mt-10">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdLockOutline size={32} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Training Locked</h2>
            <p className="text-neutral-600 mb-6 text-sm">
              You must complete your certification registration fee before you can access courses and tests.
            </p>
            <Button 
              variant="primary" 
              className="w-full justify-center py-3"
              onClick={() => router.push('/payment')}
            >
              Pay {user?.trainingFeeSnapshot?.amount ? `₹${user.trainingFeeSnapshot.amount}` : "Now"} to Unlock
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
