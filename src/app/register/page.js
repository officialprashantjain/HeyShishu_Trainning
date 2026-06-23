'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaGraduationCap } from 'react-icons/fa'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { authService } from '@/services/authService'
import { roleService } from '@/services/roleService'
import { showToast } from '@/utils/toast'
import { storage } from '@/utils/storage'

export default function RegisterPage() {
  const router = useRouter()
  const [roles, setRoles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    countryCode: '+91',
    dateOfBirth: '',
    gender: '',
    address: '',
    selectedRole: ''
  })

  useEffect(() => {
    // Fetch dynamic roles on component mount
    const fetchRoles = async () => {
      const fetchedRoles = await roleService.getRoles()
      setRoles(fetchedRoles)
    }
    fetchRoles()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.selectedRole) {
      return showToast.error("Please select a role to apply for.")
    }
    
    const loaderId = showToast.loading("Registering your account...")
    setIsSubmitting(true)

    try {
      const response = await authService.register(formData)
      showToast.dismiss(loaderId)
      showToast.success(response.message || "Registration successful!")
      
      // Save minimal active user states returned by the backend
      if (response.data) {
         storage.setUser(response.data)
      }

      // Route to user portal or payment immediately after success
      router.push('/login')
    } catch (error) {
      showToast.dismiss(loaderId)
      showToast.error(error.message || "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <Input 
              label="Full Name" 
              name="fullName"
              placeholder="Jane Doe" 
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <Input 
              label="Email Address" 
              name="email"
              type="email" 
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              required 
            />

            <div className="grid grid-cols-3 gap-4">
              <Input 
                label="Country Code" 
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="col-span-1"
                required
              />
              <div className="col-span-2">
                <Input 
                  label="Phone Number" 
                  name="phoneNumber"
                  type="tel" 
                  placeholder="9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Date of Birth" 
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-neutral-700">Gender <span className="text-danger-500">*</span></label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 transition-all duration-150 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <Input 
              label="Home Address" 
              name="address"
              placeholder="123 Main St, City, State" 
              value={formData.address}
              onChange={handleChange}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-neutral-700">Applying Role <span className="text-danger-500">*</span></label>
              <select 
                name="selectedRole"
                value={formData.selectedRole}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 transition-all duration-150 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                required
              >
                <option value="">Select a role...</option>
                {roles.map(role => (
                   <option key={role._id} value={role._id}>{role.name}</option>
                ))}
              </select>
            </div>

            <Input 
              label="Password" 
              name="password"
              type="password" 
              placeholder="••••••••" 
              hint="Must be at least 8 characters long"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="pt-2">
               <Button 
                type="submit" 
                variant="primary" 
                disabled={isSubmitting}
                className="w-full justify-center py-3"
               >
                 {isSubmitting ? "Creating Account..." : "Create Account"}
               </Button>
            </div>
            
            <p className="text-xs text-neutral-400 text-center leading-relaxed mt-4">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
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
