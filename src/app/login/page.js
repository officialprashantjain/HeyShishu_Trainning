'use client'

import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FaGraduationCap } from 'react-icons/fa'
import { MdEmail, MdLock } from 'react-icons/md'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <FaGraduationCap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Welcome Back</h1>
          <p className="text-neutral-500 mt-1">Login to your training dashboard</p>
        </div>

        <Card className="shadow-lg p-6">
          <div className="space-y-5">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="you@example.com"
              leftIcon={<MdEmail size={20} />}
            />
            
            <div className="space-y-1">
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••"
                leftIcon={<MdLock size={20} />}
              />
              <div className="text-right">
                <a href="#" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>
            </div>

            <Link href="/dashboard" className="block mt-6">
              <Button variant="primary" className="w-full justify-center">Login</Button>
            </Link>
          </div>
        </Card>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700">
            Register here
          </Link>
        </p>
      </div>

    </div>
  )
}
