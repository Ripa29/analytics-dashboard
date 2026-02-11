'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
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
        createdAt: new Date(),
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
        createdAt: new Date(),
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
        createdAt: new Date(),
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
                setUser(userWithoutPassword)
                toast.success(`Welcome back, ${user.name}!`, {
                    style: {
                        background: darkMode ? '#1F2937' : '#fff',
                        color: darkMode ? '#fff' : '#363636',
                        border: darkMode ? '1px solid #374151' : 'none'
                    },
                    iconTheme: {
                        primary: '#10B981',
                        secondary: darkMode ? '#1F2937' : '#fff'
                    }
                })
                router.push('/')
            } else {
                toast.error('Invalid credentials', {
                    style: {
                        background: darkMode ? '#1F2937' : '#fff',
                        color: darkMode ? '#fff' : '#363636',
                        border: darkMode ? '1px solid #374151' : 'none'
                    },
                    iconTheme: {
                        primary: '#EF4444',
                        secondary: darkMode ? '#1F2937' : '#fff'
                    }
                })
            }
        } catch (error) {
            toast.error('Login failed', {
                style: {
                    background: darkMode ? '#1F2937' : '#fff',
                    color: darkMode ? '#fff' : '#363636',
                    border: darkMode ? '1px solid #374151' : 'none'
                }
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleQuickLogin = (user: typeof users[0]) => {
        setEmail(user.email)
        setPassword(user.password)
    }

    // Get role-based color
    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'blue'
            case 'manager': return 'green'
            default: return 'purple'
        }
    }

    // Get role gradient
    const getRoleGradient = (role: string) => {
        switch (role) {
            case 'admin': return 'from-blue-500 to-blue-600'
            case 'manager': return 'from-green-500 to-green-600'
            default: return 'from-purple-500 to-purple-600'
        }
    }

    return (
        <Card className={cn(
            "w-full max-w-md overflow-hidden transition-colors duration-300",
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
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
                        Sign in to access your analytics dashboard
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
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
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
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                )}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={cn(
                                    "absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors",
                                    darkMode
                                        ? 'text-gray-400 hover:text-gray-300'
                                        : 'text-gray-400 hover:text-gray-600'
                                )}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className={cn(
                                    "w-4 h-4 rounded border transition-colors",
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-800'
                                        : 'bg-white border-gray-300 text-purple-600 focus:ring-purple-500'
                                )}
                            />
                            <label
                                htmlFor="remember"
                                className={cn(
                                    "ml-2 text-sm",
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                )}
                            >
                                Remember me
                            </label>
                        </div>
                        <button
                            type="button"
                            className={cn(
                                "text-sm font-medium hover:underline",
                                darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                            )}
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Sign In Button */}
                    <Button
                        type="submit"
                        className={cn(
                            "w-full bg-gradient-to-r from-purple-500 to-pink-600",
                            "hover:from-purple-600 hover:to-pink-700",
                            "text-white font-medium py-3"
                        )}
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
                                "px-2 bg-card",
                                darkMode ? 'text-gray-500 bg-gray-800' : 'text-gray-500 bg-white'
                            )}>
                                Quick Login for Testing
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4">
                        {users.map((user) => {
                            const roleColor = getRoleColor(user.role)
                            const roleGradient = getRoleGradient(user.role)

                            return (
                                <button
                                    key={user.role}
                                    type="button"
                                    onClick={() => handleQuickLogin(user)}
                                    className={cn(
                                        "flex flex-col items-center p-3 rounded-lg border transition-all duration-200",
                                        "hover:shadow-md transform hover:-translate-y-0.5",
                                        darkMode
                                            ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 mb-2 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-semibold",
                                        roleGradient
                                    )}>
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-xs font-medium capitalize",
                                        darkMode ? 'text-gray-300' : 'text-gray-700'
                                    )}>
                                        {user.role}
                                    </span>
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
                            onClick={() => router.push('/register')}
                            className={cn(
                                "font-medium hover:underline",
                                darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                            )}
                        >
                            Create account
                        </button>
                    </p>
                </div>

                {/* Version */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className={cn(
                        "text-xs text-center",
                        darkMode ? 'text-gray-500' : 'text-gray-500'
                    )}>
                        Analytics Dashboard v2.1.0
                    </p>
                </div>
            </div>
        </Card>
    )
}