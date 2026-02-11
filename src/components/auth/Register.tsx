'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Phone, Briefcase, Eye, EyeOff, Shield } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import toast from 'react-hot-toast'
import { UserRole } from '@/types'

export const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        department: '',
        role: 'user' as UserRole
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { addUser, user: currentUser } = useDashboardStore()
    const router = useRouter()

    const canRegisterAdmin = currentUser?.role === 'admin'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validation
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match')
                return
            }

            if (formData.password.length < 6) {
                toast.error('Password must be at least 6 characters')
                return
            }

            await new Promise(resolve => setTimeout(resolve, 1000))

            const newUser = {
                id: Date.now().toString(),
                name: formData.name,
                email: formData.email,
                role: formData.role,
                phone: formData.phone,
                department: formData.department,
                createdAt: new Date(),
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
            }

            addUser(newUser)
            toast.success(`User ${formData.name} registered successfully!`)

            // If already logged in, redirect to users page
            if (currentUser) {
                router.push('/users')
            } else {
                // If not logged in, redirect to login page
                router.push('/')
            }
        } catch (error) {
            toast.error('Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md overflow-hidden">
            <div className="p-6 sm:p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {currentUser ? 'Register New User' : 'Create Account'}
                    </h1>
                    <p className="text-gray-600 mt-2 text-center">
                        {currentUser ? 'Register new user account' : 'Create your analytics account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter Your Full Name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="+8801234567890"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Department
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Marketing"
                                />
                            </div>
                        </div>
                    </div>

                    {canRegisterAdmin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                User Role *
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['user', 'manager', 'admin'] as UserRole[]).map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData({...formData, role})}
                                        className={`px-4 py-3 rounded-lg border transition-all duration-200 ${
                                            formData.role === role
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div className="font-medium capitalize">{role}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {role === 'admin' && 'Full access'}
                                                {role === 'manager' && 'Limited access'}
                                                {role === 'user' && 'Basic access'}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                        {currentUser ? 'Register User' : 'Create Account'}
                    </Button>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            {currentUser ? (
                                <>
                                    Back to{' '}
                                    <button
                                        type="button"
                                        onClick={() => router.push('/users')}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Users Management
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => router.push('/')}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Sign In
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </form>
            </div>
        </Card>
    )
}