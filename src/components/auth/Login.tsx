'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff, Shield, Briefcase, User } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const users = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin' as const,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        createdAt: '2024-01-01',
        phone: '+8801234567890',
        department: 'Administration'
    },
    {
        id: '2',
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'manager123',
        role: 'manager' as const,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager',
        createdAt: '2024-01-01',
        phone: '+8801234567891',
        department: 'Sales'
    },
    {
        id: '3',
        name: 'Regular User',
        email: 'user@example.com',
        password: 'user123',
        role: 'user' as const,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
        createdAt: '2024-01-01',
        phone: '+8801782384784',
        department: 'Marketing'
    }
]

export const Login: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { setUser, darkMode } = useDashboardStore()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const user = users.find(u => u.email === email && u.password === password)

            if (user) {
                const { password: _, ...userWithoutPassword } = user
                setUser({
                    ...userWithoutPassword,
                    createdAt: new Date(userWithoutPassword.createdAt)
                })
                toast.success(`Welcome back, ${user.name}!`, {
                    style: {
                        background: darkMode ? '#1F2937' : '#fff',
                        color: darkMode ? '#fff' : '#363636',
                    },
                })
                router.push('/')
            } else {
                toast.error('Invalid credentials', {
                    style: {
                        background: darkMode ? '#1F2937' : '#fff',
                        color: darkMode ? '#fff' : '#363636',
                    },
                })
            }
        } catch (error) {
            toast.error('Login failed', {
                style: {
                    background: darkMode ? '#1F2937' : '#fff',
                    color: darkMode ? '#fff' : '#363636',
                },
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleQuickLogin = (user: typeof users[0]) => {
        setEmail(user.email)
        setPassword(user.password)
    }

    // Get role icon
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Shield className="w-4 h-4" />
            case 'manager':
                return <Briefcase className="w-4 h-4" />
            default:
                return <User className="w-4 h-4" />
        }
    }

    // Get role colors
    const getRoleColors = (role: string) => {
        switch (role) {
            case 'admin':
                return {
                    bg: 'bg-blue-100 dark:bg-blue-900/30',
                    text: 'text-blue-700 dark:text-blue-400',
                    border: 'border-blue-200 dark:border-blue-800',
                    hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/50',
                    gradient: 'from-blue-500 to-blue-600',
                    light: 'bg-blue-50 dark:bg-blue-950'
                }
            case 'manager':
                return {
                    bg: 'bg-green-100 dark:bg-green-900/30',
                    text: 'text-green-700 dark:text-green-400',
                    border: 'border-green-200 dark:border-green-800',
                    hover: 'hover:bg-green-50 dark:hover:bg-green-900/50',
                    gradient: 'from-green-500 to-green-600',
                    light: 'bg-green-50 dark:bg-green-950'
                }
            default:
                return {
                    bg: 'bg-purple-100 dark:bg-purple-900/30',
                    text: 'text-purple-700 dark:text-purple-400',
                    border: 'border-purple-200 dark:border-purple-800',
                    hover: 'hover:bg-purple-50 dark:hover:bg-purple-900/50',
                    gradient: 'from-purple-500 to-purple-600',
                    light: 'bg-purple-50 dark:bg-purple-950'
                }
        }
    }

    return (
        <Card className={cn(
            "w-full max-w-md overflow-hidden transition-colors duration-300",
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        )}>
            <div className="p-8">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">

                    <h1 className={cn(
                        "text-2xl font-bold",
                        darkMode ? 'text-white' : 'text-gray-900'
                    )}>
                        Welcome Back
                    </h1>
                    <p className={cn(
                        "text-sm mt-2",
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                    )}>
                        Sign in to access your dashboard
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label className={cn(
                            "block text-sm font-medium mb-2",
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        )}>
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className={cn(
                                "absolute left-3 top-1/2 transform -translate-y-1/2",
                                darkMode ? 'text-gray-500' : 'text-gray-400'
                            )} size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={cn(
                                    "w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200",
                                    "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                    darkMode
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                )}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className={cn(
                            "block text-sm font-medium mb-2",
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        )}>
                            Password
                        </label>
                        <div className="relative">
                            <Lock className={cn(
                                "absolute left-3 top-1/2 transform -translate-y-1/2",
                                darkMode ? 'text-gray-500' : 'text-gray-400'
                            )} size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={cn(
                                    "w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200",
                                    "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                    darkMode
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                )}
                                placeholder="Enter your password"
                                required
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

                    {/* Forgot Password Link */}
                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            className={cn(
                                "text-sm font-medium transition-colors duration-200",
                                darkMode
                                    ? 'text-purple-400 hover:text-purple-300'
                                    : 'text-purple-600 hover:text-purple-700'
                            )}
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                        isLoading={isLoading}
                    >
                        Sign In
                    </Button>
                </form>

                {/* Quick Login Section */}
                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className={cn(
                                "w-full border-t",
                                darkMode ? 'border-gray-700' : 'border-gray-200'
                            )} />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className={cn(
                                "px-2",
                                darkMode
                                    ? 'bg-gray-900 text-gray-500'
                                    : 'bg-white text-gray-500'
                            )}>
                                Quick Login (Demo)
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                        {users.map((user) => {
                            const colors = getRoleColors(user.role)
                            return (
                                <button
                                    key={user.role}
                                    type="button"
                                    onClick={() => handleQuickLogin(user)}
                                    className={cn(
                                        "flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200",
                                        "hover:shadow-md transform hover:scale-105",
                                        colors.border,
                                        colors.hover,
                                        darkMode ? 'bg-gray-800/50' : 'bg-white'
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-full mb-2 flex items-center justify-center",
                                        colors.bg
                                    )}>
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {getRoleIcon(user.role)}
                                        <span className={cn(
                                            "text-xs font-medium capitalize",
                                            colors.text
                                        )}>
                                            {user.role}
                                        </span>
                                    </div>

                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className={cn(
                        "text-sm",
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                    )}>
                        Don't have an account?{' '}
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
                            Register here
                        </button>
                    </p>
                </div>

                {/* Version */}
                <div className="mt-6 text-center">
                    <p className={cn(
                        "text-xs",
                        darkMode ? 'text-gray-600' : 'text-gray-500'
                    )}>
                        Analytics Dashboard v2.1.0
                    </p>
                </div>
            </div>
        </Card>
    )
}