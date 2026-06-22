'use client'

import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FaGraduationCap } from 'react-icons/fa'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 py-12">
      
      <div className="w-full max-w-lg">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <FaGraduationCap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Create an Account</h1>
          <p className="text-neutral-500 mt-1">Start your HeyShishu certification journey</p>
        </div>

        <Card className="shadow-lg p-6 md:p-8">
          <div className="space-y-5">
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="Priya" />
              <Input label="Last Name" placeholder="Sharma" />
            </div>

            <Input label="Email Address" type="email" placeholder="priya@example.com" />
            <Input label="Phone Number" type="tel" placeholder="+91 98765 43210" prefix="+91" />

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-neutral-700">Applying Role</label>
              <select className="input-base w-full">
                <option value="">Select a role...</option>
                <option value="nanny">Nanny</option>
                <option value="senior_nanny">Senior Nanny</option>
                <option value="infant_specialist">Infant Specialist</option>
                <option value="counselor">Child Counselor</option>
              </select>
            </div>

            <Input label="Password" type="password" placeholder="••••••••" hint="Must be at least 8 characters long" />

            <div className="pt-2">
              <Link href="/payment" className="w-full">
                <Button variant="primary" className="w-full justify-center py-3">Create Account</Button>
              </Link>
            </div>
            
            <p className="text-xs text-neutral-400 text-center leading-relaxed mt-4">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </Card>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
            Login here
          </Link>
        </p>

      </div>

    </div>
  )
}
