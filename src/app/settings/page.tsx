'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { Settings, Bell, Lock, User, Globe, Shield, Database, Save, Moon, Sun, Mail, Phone, Building2, Smartphone, Monitor, Upload, Camera, X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { User as UserType } from '@/types'

export default function SettingsPage() {
    const { user, darkMode, toggleDarkMode, updateUser, checkPermission } = useDashboardStore()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [activeTab, setActiveTab] = useState('profile')
    const [isUploading, setIsUploading] = useState(false)
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        department: user?.department || '',
        avatar: user?.avatar || ''
    })
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        weeklyReports: false,
        marketing: false,
        systemAlerts: true
    })
    const [isSaving, setIsSaving] = useState(false)

    const canEditSettings = checkPermission('settings.edit')

    const handleSaveProfile = () => {
        if (!user) return

        setIsSaving(true)

        // Simulate API call
        setTimeout(() => {
            updateUser(user.id, profile)
            setIsSaving(false)
            toast.success('Profile updated successfully')
        }, 1000)
    }

    const handleSaveNotifications = () => {
        setIsSaving(true)

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false)
            toast.success('Notification preferences saved')
        }, 1000)
    }

    const handleChangePassword = () => {
        toast.success('Password reset email sent to your inbox')
    }

    const handleAvatarClick = () => {
        if (canEditSettings) {
            fileInputRef.current?.click()
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB')
            return
        }

        setIsUploading(true)

        // Simulate upload
        setTimeout(() => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const avatarUrl = e.target?.result as string
                setProfile({ ...profile, avatar: avatarUrl })
                if (user) {
                    updateUser(user.id, { avatar: avatarUrl })
                }
                setIsUploading(false)
                toast.success('Avatar updated successfully')
            }
            reader.readAsDataURL(file)
        }, 1500)
    }

    const handleRemoveAvatar = () => {
        if (!canEditSettings) return

        if (window.confirm('Are you sure you want to remove your avatar?')) {
            const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name || 'User'}`
            setProfile({ ...profile, avatar: defaultAvatar })
            if (user) {
                updateUser(user.id, { avatar: defaultAvatar })
            }
            toast.success('Avatar removed successfully')
        }
    }

    if (!checkPermission('settings.view')) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Settings className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            You don't have permission to access settings. Only Admin and Manager roles can view this page.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'appearance', label: 'Appearance', icon: darkMode ? Sun : Moon },
    ]

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your account and system preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <Card className="lg:w-64 shrink-0">
                    <CardContent className="p-4">
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}>
                                        <Icon size={20} />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                )
                            })}
                        </nav>

                        {/* User Info */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-3 px-4 py-3">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                                        {profile.avatar ? (
                                            <img src={profile.avatar} alt={profile.name}
                                                className="w-full h-full object-cover"/>
                                        ) : (
                                            profile.name?.charAt(0).toUpperCase() || 'U'
                                        )}
                                    </div>
                                    {canEditSettings && (
                                        <button
                                            onClick={handleAvatarClick}
                                            className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg"
                                            title="Change avatar">
                                            <Camera size={14} />
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{profile.name || 'User'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Content */}
                <div className="flex-1">
                    {/* Profile Settings */}
                    {activeTab === 'profile' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="w-5 h-5" />
                                    <span>Profile Settings</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {/* Avatar Section */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700">
                                        <div className="relative group">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                                                {profile.avatar ? (
                                                    <img src={profile.avatar} alt={profile.name}
                                                         className="w-full h-full object-cover"/>
                                                ) : (
                                                    profile.name?.charAt(0).toUpperCase() || 'U'
                                                )}
                                            </div>

                                            {canEditSettings && (
                                                <>
                                                    <button
                                                        onClick={handleAvatarClick}
                                                        disabled={isUploading}
                                                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        {isUploading ? (
                                                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <Camera className="w-8 h-8 text-white" />
                                                        )}
                                                    </button>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleAvatarChange}
                                                        className="hidden"
                                                    />
                                                </>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                Profile Picture
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                Upload a new avatar. JPG, PNG or GIF. Max 5MB.
                                            </p>
                                            <div className="flex items-center space-x-3">
                                                {canEditSettings && (
                                                    <>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            icon={<Upload size={16} />}
                                                            onClick={handleAvatarClick}
                                                            isLoading={isUploading}>
                                                            Upload Image
                                                        </Button>
                                                        {profile.avatar && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                icon={<X size={16} />}
                                                                onClick={handleRemoveAvatar}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                                Remove
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Form */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                                                    disabled={!canEditSettings}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                                    placeholder="John Doe"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                                                    disabled={!canEditSettings}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                                    placeholder="john@example.com"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="tel"
                                                    value={profile.phone}
                                                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                                    disabled={!canEditSettings}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                                    placeholder="+880 123-4567-123"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Department
                                            </label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={profile.department}
                                                    onChange={(e) => setProfile({...profile, department: e.target.value})}
                                                    disabled={!canEditSettings}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                                    placeholder="Engineering"/>
                                            </div>
                                        </div>
                                    </div>

                                    {canEditSettings && (
                                        <div className="flex justify-end pt-4">
                                            <Button
                                                icon={<Save size={18} />}
                                                onClick={handleSaveProfile}
                                                isLoading={isSaving}
                                                className="px-6">
                                                Save Changes
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notifications Settings */}
                    {activeTab === 'notifications' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Bell className="w-5 h-5" />
                                    <span>Notification Preferences</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                                        {Object.entries(notifications).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1')}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Receive {key.toLowerCase()} notifications via email
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
                                                        disabled={!canEditSettings}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {canEditSettings && (
                                        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <Button
                                                variant="secondary"
                                                icon={<Save size={18} />}
                                                onClick={handleSaveNotifications}
                                                isLoading={isSaving}
                                            >
                                                Save Preferences
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Lock className="w-5 h-5" />
                                    <span>Security Settings</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">Password</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    Last changed 30 days ago
                                                </p>
                                            </div>
                                            <Button variant="secondary" onClick={handleChangePassword}>
                                                Change Password
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    Add an extra layer of security to your account
                                                </p>
                                            </div>
                                            <Button
                                                variant="secondary"
                                                onClick={() => toast('2FA setup coming soon', { icon: '🔐', duration: 3000 })}
                                            >
                                                Enable 2FA
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Active Sessions</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                You're currently signed in on these devices
                                            </p>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900">
                                                    <div className="flex items-center space-x-3">
                                                        <Monitor className="w-5 h-5 text-gray-500" />
                                                        <div>
                                                            <p className="font-medium">Current Device</p>
                                                            <p className="text-xs text-gray-500">Windows • Chrome</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                                        Active now
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900">
                                                    <div className="flex items-center space-x-3">
                                                        <Smartphone className="w-5 h-5 text-gray-500" />
                                                        <div>
                                                            <p className="font-medium">iPhone 13</p>
                                                            <p className="text-xs text-gray-500">iOS • Safari</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">2 hours ago</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Appearance Settings */}
                    {activeTab === 'appearance' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                    <span>Appearance</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Toggle between light and dark theme
                                            </p>
                                        </div>
                                        <button
                                            onClick={toggleDarkMode}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                darkMode ? 'bg-blue-600' : 'bg-gray-200'
                                            }`}>
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    darkMode ? 'translate-x-6' : 'translate-x-1'
                                                }`}/>
                                        </button>
                                    </div>

                                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Theme Preview</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border-2 border-blue-500 shadow-lg">
                                                <div className="w-full h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md mb-2" />
                                                <div className="space-y-1">
                                                    <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                                                    <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-transparent">
                                                <div className="w-full h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-md mb-2" />
                                                <div className="space-y-1">
                                                    <div className="w-3/4 h-2 bg-gray-300 dark:bg-gray-600 rounded" />
                                                    <div className="w-1/2 h-2 bg-gray-300 dark:bg-gray-600 rounded" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* System Settings (Admin Only) */}
                    {user?.role === 'admin' && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Shield className="w-5 h-5" />
                                    <span>System Settings</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button
                                        variant="ghost"
                                        className="justify-start h-auto p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                                        onClick={() => toast('General settings', { icon: '⚙️', duration: 3000 })}
                                    >
                                        <Globe className="w-5 h-5 mr-3 text-blue-500" />
                                        <div className="text-left">
                                            <p className="font-medium">General Settings</p>
                                            <p className="text-xs text-gray-500">Company name, timezone, currency</p>
                                        </div>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="justify-start h-auto p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                                        onClick={() => toast.success('Database backup started')}>
                                        <Database className="w-5 h-5 mr-3 text-green-500" />
                                        <div className="text-left">
                                            <p className="font-medium">Database Backup</p>
                                            <p className="text-xs text-gray-500">Backup and restore data</p>
                                        </div>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="justify-start h-auto p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                                        onClick={() => toast('Security settings', { icon: '🔒', duration: 3000 })}>
                                        <Shield className="w-5 h-5 mr-3 text-purple-500" />
                                        <div className="text-left">
                                            <p className="font-medium">Security Settings</p>
                                            <p className="text-xs text-gray-500">API keys, authentication</p>
                                        </div>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="justify-start h-auto p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                                        onClick={() => toast('Audit logs', { icon: '📋', duration: 3000 })}>
                                        <Bell className="w-5 h-5 mr-3 text-amber-500" />
                                        <div className="text-left">
                                            <p className="font-medium">Audit Logs</p>
                                            <p className="text-xs text-gray-500">System activity tracking</p>
                                        </div>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}