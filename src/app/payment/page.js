'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { MdPayment, MdCheckCircle } from 'react-icons/md'
import { useAuth } from '@/context/AuthContext'
import { paymentService } from '@/services/paymentService'
import { showToast } from '@/utils/toast'
import { storage } from '@/utils/storage'

export default function PaymentPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      showToast.error("Please login to access payment portal.")
      router.push('/login')
    }
  }, [user, loading, router])

  const handleDummyPayment = async () => {
    if (!user) return
    
    setIsProcessing(true)
    const initLoader = showToast.loading("Initiating secure connection...")
    
    try {
      // 1. Initiate 
      const initRes = await paymentService.initiatePayment(99900) // ₹999
      const orderId = initRes.data?.orderId
      
      showToast.dismiss(initLoader)
      
      if (!orderId) {
        throw new Error("Failed to generate order ID from backend")
      }

      const verifyLoader = showToast.loading("Processing Razorpay transaction...")
      
      // Simulate Razorpay popup delay 
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 2. Verify with Dummy Payload
      const verificationPayload = {
        razorpay_order_id: orderId,
        razorpay_payment_id: "dummy_pay_" + Date.now(),
        razorpay_signature: "dummy_signature"
      }

      const verifyRes = await paymentService.verifyPayment(verificationPayload)
      showToast.dismiss(verifyLoader)
      showToast.success("Payment verified! Your courses are now fully unlocked.")

      // Update local storage user state to unlocked if returned
      if (verifyRes.data?.trainee) {
         storage.setUser(verifyRes.data.trainee)
      }

      // 3. Route to main dashboard
      router.push('/dashboard')

    } catch (error) {
      showToast.dismiss(initLoader)
      showToast.error(error.message)
      setIsProcessing(false)
    }
  }

  // Loading wrapper to prevent unauthenticated flash
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Complete Payment</h1>
          <p className="text-neutral-500 mt-1">Unlock your training courses to begin</p>
        </div>

        <Card className="shadow-lg overflow-hidden">
          {/* Order Summary */}
          <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <p className="text-primary-100 text-sm mb-1">HeyShishu Nanny Certification</p>
            <h2 className="text-4xl font-extrabold">₹999</h2>
            <p className="text-xs text-primary-200 mt-2">One-time payment for lifetime certification validity</p>
          </div>

          <Card.Body className="space-y-4">
            <h3 className="font-semibold text-neutral-800 border-b border-neutral-100 pb-2">What you get:</h3>
            <ul className="space-y-3">
              {[
                'Full access to all training modules',
                'MCQ tests & instant grading',
                'Personal counselor interview',
                'Official HeyShishu Nanny credentials on approval'
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-neutral-600">
                  <MdCheckCircle className="text-success-500 flex-shrink-0 mt-0.5" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </Card.Body>

          <Card.Footer className="bg-neutral-50 flex-col gap-3">
            <Button 
                variant="primary" 
                className="w-full justify-center py-3" 
                onClick={handleDummyPayment}
                disabled={isProcessing}
            >
              <MdPayment size={20} className="mr-2" />
              {isProcessing ? "Processing via Razorpay..." : "Pay via Razorpay"}
            </Button>
            <p className="text-center text-xs text-neutral-400 w-full">
              Secured by Razorpay • UPI, Cards, NetBanking supported
            </p>
          </Card.Footer>
        </Card>
      </div>

    </div>
  )
}
