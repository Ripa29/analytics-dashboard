'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import toast from 'react-hot-toast'

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
        name: 'User',
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
    const { setUser } = useDashboardStore()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const user = users.find(u => u.email === email && u.password === password)

            if (user) {
                // Destructure to exclude password and create proper User object
                const { password: _, ...userWithoutPassword } = user
                setUser(userWithoutPassword)
                toast.success(`Welcome back, ${user.name}!`)
                router.push('/')
            } else {
                toast.error('Invalid credentials')
            }
        } catch (error) {
            toast.error('Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleQuickLogin = (user: typeof users[0]) => {
        setEmail(user.email)
        setPassword(user.password)
        // Auto submit after 500ms
        setTimeout(() => {
            const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement
            if (submitButton) {
                submitButton.click()
            }
        }, 500)
    }

    return (
        <Card className="w-full max-w-md overflow-hidden">
            <div className="p-8">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Analytic Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Sign in to access your analytics
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                placeholder="Enter your email"
                                required/>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                placeholder="Enter your password"
                                required/>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>

                <div className="mt-8">
                    <p className="text-sm text-gray-600 text-center mb-4">
                        Quick login for testing:
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        {users.map((user) => (
                            <button
                                key={user.role}
                                type="button"
                                onClick={() => handleQuickLogin(user)}
                                className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                <div className="w-8 h-8 rounded-full mb-2 overflow-hidden">
                                    <img src={user.avatar} alt={user.name}
                                        className="w-full h-full object-cover"/>
                                </div>
                                <span className="text-xs font-medium capitalize">{user.role}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            For demo purposes, use the credentials above.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Analytics Dashboard v2.1
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    )
}