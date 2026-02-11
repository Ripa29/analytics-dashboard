'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Phone, Briefcase, Eye, EyeOff, Shield } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import toast from 'react-hot-toast'
import { UserRole } from '@/types'
import { cn } from '@/lib/utils'

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
    const { addUser, setUser, user: currentUser, darkMode } = useDashboardStore()
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
                createdAt: new Date().toISOString(),
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name.replace(/\s+/g, '')}`
            }

            // Add user to store
            addUser({
                ...newUser,
                createdAt: new Date(newUser.createdAt)
            })

            // If no user is logged in (public registration), auto-login the new user
            if (!currentUser) {
                setUser({
                    ...newUser,
                    createdAt: new Date(newUser.createdAt)
                })
                toast.success(`Welcome, ${formData.name}! Your ${formData.role} account has been created.`)

                // Redirect based on role
                switch (formData.role) {
                    case 'admin':
                        router.push('/')
                        break
                    case 'manager':
                        router.push('/')
                        break
                    case 'user':
                        router.push('/')
                        break
                }
            } else {
                // Admin is creating a user
                toast.success(`User ${formData.name} registered as ${formData.role} successfully!`)
                router.push('/users')
            }
        } catch (error) {
            toast.error('Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    // Get role description
    const getRoleDescription = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'Full system access, user management, settings'
            case 'manager':
                return 'Team management, orders, products, reports'
            case 'user':
                return 'Personal dashboard, orders, profile'
        }
    }

    // Get role color
    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'blue'
            case 'manager':
                return 'green'
            case 'user':
                return 'purple'
        }
    }

    // Get role icon
    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return <Shield className="w-5 h-5" />
            case 'manager':
                return <Briefcase className="w-5 h-5" />
            case 'user':
                return <User className="w-5 h-5" />
        }
    }

    return (
        <Card className={cn(
            "w-full max-w-md overflow-hidden transition-colors duration-300",
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        )}>
            <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <h1 className={cn(
                        "text-2xl font-bold",
                        darkMode ? 'text-white' : 'text-gray-900'
                    )}>
                        {currentUser ? 'Register New User' : 'Create Your Account'}
                    </h1>
                    <p className={cn(
                        "text-sm mt-2 text-center",
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                    )}>
                        {currentUser
                            ? `Register a new ${formData.role} account`
                            : 'Choose your role and start your journey'
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={cn(
                                "block text-sm font-medium mb-2",
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Full Name *
                            </label>
                            <div className="relative">
                                <User className={cn(
                                    "absolute left-3 top-1/2 transform -translate-y-1/2",
                                    darkMode ? 'text-gray-500' : 'text-gray-400'
                                )} size={20} />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className={cn(
                                        "w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200",
                                        "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                        darkMode
                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    )}
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={cn(
                                "block text-sm font-medium mb-2",
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail className={cn(
                                    "absolute left-3 top-1/2 transform -translate-y-1/2",
                                    darkMode ? 'text-gray-500' : 'text-gray-400'
                                )} size={20} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className={cn(
                                        "w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200",
                                        "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                        darkMode
                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    )}
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={cn(
                                "block text-sm font-medium mb-2",
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className={cn(
                                    "absolute left-3 top-1/2 transform -translate-y-1/2",
                                    darkMode ? 'text-gray-500' : 'text-gray-400'
                                )} size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className={cn(
                                        "w-full pl-10 pr-12 py-2.5 rounded-lg border transition-all duration-200",
                                        "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                        darkMode
                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    )}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={cn(
                                        "absolute right-3 top-1/2 transform -translate-y-1/2",
                                        "transition-colors duration-200",
                                        darkMode
                                            ? 'text-gray-500 hover:text-gray-300'
                                            : 'text-gray-400 hover:text-gray-600'
                                    )}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className={cn(
                                "block text-sm font-medium mb-2",
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <Lock className={cn(
                                    "absolute left-3 top-1/2 transform -translate-y-1/2",
                                    darkMode ? 'text-gray-500' : 'text-gray-400'
                                )} size={20} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    className={cn(
                                        "w-full pl-10 pr-12 py-2.5 rounded-lg border transition-all duration-200",
                                        "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                        darkMode
                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    )}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className={cn(
                                        "absolute right-3 top-1/2 transform -translate-y-1/2",
                                        "transition-colors duration-200",
                                        darkMode
                                            ? 'text-gray-500 hover:text-gray-300'
                                            : 'text-gray-400 hover:text-gray-600'
                                    )}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={cn(
                                "block text-sm font-medium mb-2",
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className={cn(
                                    "absolute left-3 top-1/2 transform -translate-y-1/2",
                                    darkMode ? 'text-gray-500' : 'text-gray-400'
                                )} size={20} />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className={cn(
                                        "w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200",
                                        "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                        darkMode
                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    )}
                                    placeholder="+8801234567890"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={cn(
                                "block text-sm font-medium mb-2",
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Department
                            </label>
                            <div className="relative">
                                <Briefcase className={cn(
                                    "absolute left-3 top-1/2 transform -translate-y-1/2",
                                    darkMode ? 'text-gray-500' : 'text-gray-400'
                                )} size={20} />
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                                    className={cn(
                                        "w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200",
                                        "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                        darkMode
                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    )}
                                    placeholder="Marketing, Sales, etc."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role Selection - Only show if admin is creating user OR during public registration */}
                    {(!currentUser || canRegisterAdmin) && (
                        <div className="space-y-3">
                            <label className={cn(
                                "block text-sm font-medium",
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Select Your Role *
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {(['user', 'manager', 'admin'] as UserRole[]).map((role) => {
                                    const isSelected = formData.role === role
                                    const roleColor = getRoleColor(role)

                                    return (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setFormData({...formData, role})}
                                            className={cn(
                                                "relative p-4 rounded-lg border-2 transition-all duration-200",
                                                isSelected
                                                    ? `border-${roleColor}-500 bg-${roleColor}-50 dark:bg-${roleColor}-900/20`
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                                                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                            )}
                                        >
                                            {/* Role Icon */}
                                            <div className={cn(
                                                "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center",
                                                isSelected
                                                    ? `bg-${roleColor}-500 text-white`
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                            )}>
                                                {getRoleIcon(role)}
                                            </div>

                                            {/* Role Name */}
                                            <p className={cn(
                                                "font-semibold capitalize",
                                                isSelected
                                                    ? `text-${roleColor}-700 dark:text-${roleColor}-400`
                                                    : 'text-gray-700 dark:text-gray-300'
                                            )}>
                                                {role}
                                            </p>

                                            {/* Role Description */}
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {getRoleDescription(role)}
                                            </p>

                                            {/* Selected Indicator */}
                                            {isSelected && (
                                                <div className="absolute top-2 right-2">
                                                    <div className={cn(
                                                        "w-3 h-3 rounded-full",
                                                        `bg-${roleColor}-500`
                                                    )} />
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Role Info Message */}
                            {!currentUser && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                    💡 You can register as any role for demo purposes.
                                    In production, role selection would be restricted.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className={cn(
                            "w-full mt-6",
                            !currentUser && formData.role === 'admin' && 'bg-gradient-to-r from-blue-500 to-blue-600',
                            !currentUser && formData.role === 'manager' && 'bg-gradient-to-r from-green-500 to-green-600',
                            !currentUser && formData.role === 'user' && 'bg-gradient-to-r from-purple-500 to-purple-600'
                        )}
                        isLoading={isLoading}
                    >
                        {currentUser
                            ? `Register as ${formData.role}`
                            : `Create ${formData.role} Account`
                        }
                    </Button>

                    {/* Login Link - Only for public registration */}
                    {!currentUser && (
                        <div className="text-center mt-6">
                            <p className={cn(
                                "text-sm",
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => router.push('/')}
                                    className={cn(
                                        "font-medium transition-colors duration-200",
                                        darkMode
                                            ? 'text-purple-400 hover:text-purple-300'
                                            : 'text-purple-600 hover:text-purple-700'
                                    )}
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Back to Users - Only for admin */}
                    {currentUser && (
                        <div className="text-center mt-6">
                            <button
                                type="button"
                                onClick={() => router.push('/users')}
                                className={cn(
                                    "text-sm transition-colors duration-200",
                                    darkMode
                                        ? 'text-gray-400 hover:text-gray-300'
                                        : 'text-gray-600 hover:text-gray-900'
                                )}
                            >
                                ← Back to Users Management
                            </button>
                        </div>
                    )}
                </form>

                {/* Registration Summary */}
                {!currentUser && formData.role && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                    formData.role === 'admin' ? 'bg-blue-500' :
                                        formData.role === 'manager' ? 'bg-green-500' : 'bg-purple-500'
                                )}>
                                    {getRoleIcon(formData.role)}
                                </div>
                                <div>
                                    <p className={cn(
                                        "text-sm font-medium",
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    )}>
                                        You're registering as: <span className="font-bold capitalize">{formData.role}</span>
                                    </p>
                                    <p className={cn(
                                        "text-xs",
                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                    )}>
                                        {getRoleDescription(formData.role)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}