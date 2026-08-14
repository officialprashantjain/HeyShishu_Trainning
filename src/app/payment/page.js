'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { MdPayment, MdCheckCircle } from 'react-icons/md'
import { useAuth } from '@/context/AuthContext'
import { paymentService } from '@/services/paymentService'
import { showToast } from '@/utils/toast'
import { storage } from '@/utils/storage'

export default function PaymentPage() {
  const router = useRouter()
  const { user, loading, setUser } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      showToast.error('Please login to access payment portal.')
      router.push('/login')
    }
  }, [user, loading, router])

  const handlePayment = async () => {
    if (!user) return

    setIsProcessing(true)
    const initLoader = showToast.loading('Initiating secure connection...')

    try {
      // 1. Create order on backend dynamically
      const initRes = await paymentService.createOrder(user._id)
      
      const { razorpayOrderId, amount, key } = initRes?.data || {}

      showToast.dismiss(initLoader)

      if (!razorpayOrderId) {
        throw new Error('Failed to generate secure order ID from backend')
      }

      // 2. Open Razorpay Checkout overlay
      const options = {
        key: key,
        amount: amount, // Amount is in paise
        currency: "INR",
        name: "HeyShishu",
        description: "Training Certification Fee",
        order_id: razorpayOrderId,
        prefill: {
          name: user.fullName || "",
          email: user.email || "",
          contact: user.phoneNumber || ""
        },
        theme: {
          color: "#346960"
        },
        handler: async function (response) {
          const verifyLoader = showToast.loading('Verifying secure payment...')
          try {
            const verificationPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }

            await paymentService.verifyPayment(verificationPayload)
            showToast.dismiss(verifyLoader)
            showToast.success('Payment verified! Your courses are now fully unlocked.')
            
            // Advance status immediately for fluid UI interaction
            const updatedUser = { ...user, paymentStatus: 'paid', status: 'pending_training' }
            storage.setUser(updatedUser)
            setUser(updatedUser)

            router.push('/dashboard')
          } catch (err) {
            showToast.dismiss(verifyLoader)
            showToast.error(err.message || 'Verification failed on server.')
          }
        }
      }
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        showToast.error(response.error.description || 'Payment Failed');
      })
      rzp.open();

    } catch (error) {
      showToast.dismiss(initLoader)
      showToast.error(error.message || 'Could not initiate payment')
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (user.paymentStatus === 'paid') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg p-8 text-center border-0">
            <div className="w-20 h-20 bg-success-50 text-success-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdCheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Payment Completed!</h2>
            <p className="text-neutral-600 mb-8 leading-relaxed">
              You have successfully paid <strong>{user?.trainingFeeSnapshot?.amount ? `₹${user.trainingFeeSnapshot.amount}` : "the fee"}</strong> for this course. Your training portal is officially unlocked!
            </p>
            <Button variant="primary" onClick={() => router.push('/dashboard')} className="w-full justify-center py-3 text-lg">
              Proceed to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Complete Payment</h1>
          <p className="text-neutral-500 mt-1">Unlock your training courses to begin</p>
        </div>

        <Card className="shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <p className="text-primary-100 text-sm mb-1">HeyShishu Certification</p>
            <h2 className="text-3xl font-extrabold">{user?.trainingFeeSnapshot?.amount ? `₹${user.trainingFeeSnapshot.amount}` : "Complete Payment"}</h2>
            <p className="text-xs text-primary-200 mt-2">One-time payment for lifetime validity</p>
          </div>

          <Card.Body className="space-y-4">
            <h3 className="font-semibold text-neutral-800 border-b border-neutral-100 pb-2">What you get:</h3>
            <ul className="space-y-3">
              {[
                'Full access to all training modules',
                'MCQ tests & instant grading',
                'Personal counselor interview',
                'Official HeyShishu Nanny credentials on approval',
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
              onClick={handlePayment}
              disabled={isProcessing}
            >
              <MdPayment size={20} className="mr-2" />
              {isProcessing ? 'Processing via Razorpay...' : 'Pay via Razorpay'}
            </Button>
            
            <button
              className="w-full py-2 text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
              onClick={() => router.push('/dashboard')}
              disabled={isProcessing}
            >
               Skip for now, go to Dashboard
            </button>
            <p className="text-center text-xs text-neutral-400 w-full mt-2">
              Secured by Razorpay • UPI, Cards, NetBanking supported
            </p>
          </Card.Footer>
        </Card>
      </div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </div>
  )
}
