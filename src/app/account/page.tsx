'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { Settings, Lock, User, Shield, Bell, Globe, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AccountPage() {
    const { user, updateUser } = useDashboardStore()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        department: user?.department || ''
    })
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        weeklyReports: false,
        marketing: false
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            if (user) {
                updateUser(user.id, formData)
                toast.success('Account updated successfully!')
            }
        } catch (error) {
            toast.error('Failed to update account')
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Please Sign In</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            You need to be logged in to access account settings.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your account preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="w-5 h-5" />
                                <span>Profile Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.department}
                                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" icon={<Save size={18} />} isLoading={isLoading}>
                                    Save Changes
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Notification Preferences */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Bell className="w-5 h-5" />
                                <span>Notification Preferences</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(notifications).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                                                {key.replace(/([A-Z])/g, ' $1')} Notifications
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Receive {key} notifications
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={(e) => setNotifications({
                                                    ...notifications,
                                                    [key]: e.target.checked
                                                })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                                <Button variant="secondary" icon={<Save size={18} />}>
                                    Save Preferences
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Security & Role Info */}
                <div className="space-y-6">
                    {/* Security Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Lock className="w-5 h-5" />
                                <span>Security</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="ghost" className="w-full justify-start">
                                Change Password
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                Two-Factor Authentication
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                Login History
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Role Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Shield className="w-5 h-5" />
                                <span>Role Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Current Role</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Your assigned role</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        user.role === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                            user.role === 'manager' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                    }`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white mb-2">Permissions</p>
                                    <div className="space-y-2">
                                        {user.role === 'admin' && (
                                            <>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">• Full system access</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">• User management</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">• System settings</p>
                                            </>
                                        )}
                                        {user.role === 'manager' && (
                                            <>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">• Limited admin access</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">• Team management</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">• Report generation</p>
                                            </>
                                        )}
                                        {user.role === 'user' && (
                                            <>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">• View dashboard</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">• Basic operations</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">• Personal settings</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}