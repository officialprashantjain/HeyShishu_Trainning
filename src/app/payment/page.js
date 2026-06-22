'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { MdPayment, MdCheckCircle } from 'react-icons/md'
import Link from 'next/link'

export default function PaymentPage() {
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
            <Link href="/dashboard" className="w-full">
              <Button variant="primary" className="w-full justify-center py-3">
                <MdPayment size={20} className="mr-2" />
                Pay via Razorpay
              </Button>
            </Link>
            <p className="text-center text-xs text-neutral-400 w-full">
              Secured by Razorpay • UPI, Cards, NetBanking supported
            </p>
          </Card.Footer>
        </Card>
      </div>

    </div>
  )
}
