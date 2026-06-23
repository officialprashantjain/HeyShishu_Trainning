'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FaGraduationCap } from 'react-icons/fa'
import { MdEmail, MdLock } from 'react-icons/md'
import { authService } from '@/services/authService'
import { storage } from '@/utils/storage'
import { showToast } from '@/utils/toast'

export default function LoginPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      return showToast.error("Please fill in both email and password")
    }

    setIsSubmitting(true)
    const loaderId = showToast.loading("Signing you in...")

    try {
      // response directly contains JSON from the API backend
      const response = await authService.login(formData)
      showToast.dismiss(loaderId)
      
      if (response?.status === 'success' && response?.token) {
        showToast.success("Login successful!")
        
        // 1. Save Token into Local Storage
        storage.setToken(response.token)
        
        // 2. Save User Payload into Local Storage
        if (response.data) {
           storage.setUser(response.data)
        }

        // 3. Drive User directly to the Payment screen
        router.push('/payment')
      } else {
         showToast.error("Authentication failed. No token received.")
      }
      
    } catch (error) {
      showToast.dismiss(loaderId)
      showToast.error(error.message || "Invalid credentials. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Email Address" 
              name="email"
              type="email" 
              placeholder="you@example.com"
              icon={<MdEmail size={20} />}
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div className="space-y-1">
              <Input 
                label="Password" 
                name="password"
                type="password" 
                placeholder="••••••••"
                icon={<MdLock size={20} />}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="text-right">
                <a href="#" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="mt-6">
              <Button type="submit" variant="primary" className="w-full justify-center" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
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
