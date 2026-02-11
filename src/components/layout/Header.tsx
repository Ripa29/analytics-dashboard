'use client'

import React, { useState } from 'react'
import { Bell, Search, Sun, Moon, User, LogOut,
    Settings, ChevronDown, Shield, Briefcase, HelpCircle, UserCircle, Mail, Phone } from 'lucide-react'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { Card } from '../../components/ui/Card'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const Header: React.FC = () => {
    const { darkMode, toggleDarkMode, user, logout, getFilteredNotifications, markNotificationAsRead } = useDashboardStore()
    const [showNotifications, setShowNotifications] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    const filteredNotifications = getFilteredNotifications()
    const unreadCount = filteredNotifications.filter(n => !n.read).length

    const getRoleNotifications = () => {
        if (!user) return 0
        switch (user.role) {
            case 'admin':
                return unreadCount + 2
            case 'manager':
                return unreadCount + 1
            default:
                return unreadCount
        }
    }

    const roleBasedUnread = getRoleNotifications()

    const getRoleSpecificNotifications = () => {
        if (!user) return []

        const roleNotifications = []

        if (user.role === 'admin') {
            roleNotifications.push({
                id: 'sys-1',
                title: 'System Update Required',
                message: 'Security patch available for v2.1.0',
                type: 'warning' as const,
                read: false,
                createdAt: new Date(Date.now() - 1800000),
                roles: ['admin'] as const
            })
        }

        if (user.role === 'manager') {
            roleNotifications.push({
                id: 'team-1',
                title: 'Team Meeting',
                message: 'Weekly sync in 30 minutes',
                type: 'info' as const,
                read: false,
                createdAt: new Date(Date.now() - 3600000),
                roles: ['manager'] as const
            })
        }

        return roleNotifications
    }

    const allNotifications = [...filteredNotifications, ...getRoleSpecificNotifications()]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const handleNotificationClick = (id: string) => {
        markNotificationAsRead(id)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
        }
    }

    const getAvatarGradient = () => {
        if (!user) return 'from-gray-500 to-gray-600'
        switch (user.role) {
            case 'admin': return 'from-blue-500 to-blue-600'
            case 'manager': return 'from-green-500 to-green-600'
            default: return 'from-purple-500 to-purple-600'
        }
    }

    const getRoleIcon = () => {
        if (!user) return <User className="w-4 h-4" />
        switch (user.role) {
            case 'admin': return <Shield className="w-4 h-4" />
            case 'manager': return <Briefcase className="w-4 h-4" />
            default: return <UserCircle className="w-4 h-4" />
        }
    }

    const getRoleColor = () => {
        if (!user) return 'text-gray-500'
        switch (user.role) {
            case 'admin': return 'text-blue-500'
            case 'manager': return 'text-green-500'
            default: return 'text-purple-500'
        }
    }

    const getRoleBadgeColor = () => {
        if (!user) return 'bg-gray-500'
        switch (user.role) {
            case 'admin': return 'bg-blue-500'
            case 'manager': return 'bg-green-500'
            default: return 'bg-purple-500'
        }
    }

    return (
        <header className={cn(
            "sticky top-0 z-40 transition-all duration-300",
            darkMode
                ? "bg-gray-900/95 backdrop-blur-lg border-gray-800"
                : "bg-white/95 backdrop-blur-lg border-gray-200",
            "border-b shadow-sm"
        )}>
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
                {/* Search Bar */}
                <div className="flex-1 max-w-xl">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="search"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={cn(
                                    "w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300",
                                    darkMode
                                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
                                        : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-500",
                                    "border"
                                )}
                            />
                        </div>
                    </form>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            darkMode
                                ? "text-yellow-400 hover:bg-gray-800"
                                : "text-gray-600 hover:bg-gray-100"
                        )}
                        aria-label="Toggle theme"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Role-Based Notifications - Only show if user exists */}
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={cn(
                                    "p-2 rounded-lg relative transition-colors",
                                    darkMode
                                        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                )}
                                aria-label="Notifications">
                                <Bell size={20} />
                                {roleBasedUnread > 0 && (
                                    <span className={cn(
                                        "absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center text-white border-2",
                                        darkMode ? 'border-gray-900' : 'border-white',
                                        getRoleBadgeColor()
                                    )}>
                                        {roleBasedUnread}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowNotifications(false)}/>
                                    <Card className={cn(
                                        "absolute right-0 top-12 w-80 sm:w-96 z-50 shadow-xl animate-in slide-in-from-top-5",
                                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
                                    )}>
                                        <div className="p-4 border-b flex items-center justify-between">
                                            <h3 className={cn(
                                                "font-semibold",
                                                darkMode ? 'text-white' : 'text-gray-900'
                                            )}>
                                                Notifications
                                            </h3>
                                            <div className="flex items-center space-x-2">
                                                <span className={cn(
                                                    "px-2 py-1 text-xs rounded-full",
                                                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                                )}>
                                                    {user?.role || 'User'}
                                                </span>
                                                <span className={cn(
                                                    "px-2 py-1 text-xs rounded-full",
                                                    user?.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        user?.role === 'manager' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                )}>
                                                    {unreadCount} new
                                                </span>
                                            </div>
                                        </div>

                                        <div className="max-h-96 overflow-y-auto">
                                            {allNotifications.length > 0 ? (
                                                allNotifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        onClick={() => handleNotificationClick(notification.id)}
                                                        className={cn(
                                                            "p-4 border-b last:border-b-0 transition-colors cursor-pointer",
                                                            !notification.read && (
                                                                user?.role === 'admin' ? 'bg-blue-50/50 dark:bg-blue-900/10' :
                                                                    user?.role === 'manager' ? 'bg-green-50/50 dark:bg-green-900/10' :
                                                                        'bg-purple-50/50 dark:bg-purple-900/10'
                                                            ),
                                                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                                        )}>
                                                        <div className="flex items-start space-x-3">
                                                            <div className={cn(
                                                                "w-2 h-2 rounded-full mt-1.5",
                                                                notification.type === 'success' && "bg-green-500",
                                                                notification.type === 'warning' && "bg-yellow-500",
                                                                notification.type === 'error' && "bg-red-500",
                                                                notification.type === 'info' && "bg-blue-500"
                                                            )} />
                                                            <div className="flex-1">
                                                                <p className={cn(
                                                                    "font-medium",
                                                                    darkMode ? 'text-white' : 'text-gray-900',
                                                                    !notification.read && 'font-semibold'
                                                                )}>
                                                                    {notification.title}
                                                                </p>
                                                                <p className={cn(
                                                                    "text-sm mt-1",
                                                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                                                )}>
                                                                    {notification.message}
                                                                </p>
                                                                <p className={cn(
                                                                    "text-xs mt-2",
                                                                    darkMode ? 'text-gray-500' : 'text-gray-500'
                                                                )}>
                                                                    {new Date(notification.createdAt).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <Bell className={cn(
                                                        "w-12 h-12 mx-auto mb-4",
                                                        darkMode ? 'text-gray-600' : 'text-gray-300'
                                                    )} />
                                                    <p className={cn(
                                                        "text-sm",
                                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                                    )}>
                                                        No notifications
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3 border-t">
                                            <button
                                                onClick={() => {
                                                    setShowNotifications(false)
                                                    router.push('/notifications')
                                                }}
                                                className={cn(
                                                    "w-full py-2 text-sm rounded-lg transition-colors",
                                                    darkMode
                                                        ? 'text-blue-400 hover:bg-gray-700'
                                                        : 'text-blue-600 hover:bg-gray-50'
                                                )}>
                                                View all notifications
                                            </button>
                                        </div>
                                    </Card>
                                </>
                            )}
                        </div>
                    )}

                    {/* Profile Dropdown - Only show if user exists */}
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setShowProfile(!showProfile)}
                                className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Profile menu">
                                {/* Avatar with Role-based Gradient */}
                                <div className={cn(
                                    "w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold shadow-md",
                                    getAvatarGradient()
                                )}>
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name}
                                            className="w-full h-full rounded-full object-cover"/>
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase() || 'U'
                                    )}
                                </div>

                                <div className="hidden md:block text-left">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    )}>
                                        {user?.name || 'User'}
                                    </p>
                                    <div className="flex items-center space-x-1">
                                        <span className={cn("text-xs", getRoleColor())}>
                                            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                                        </span>
                                    </div>
                                </div>

                                <ChevronDown className={cn(
                                    "w-4 h-4 transition-transform duration-200",
                                    showProfile && 'rotate-180',
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                )} />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {showProfile && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowProfile(false)}
                                    />
                                    <Card className={cn(
                                        "absolute right-0 top-12 w-64 z-50 shadow-xl animate-in slide-in-from-top-5",
                                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
                                    )}>
                                        {/* User Info */}
                                        <div className="p-4 border-b">
                                            <div className="flex items-center space-x-3">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold text-lg shadow-md",
                                                    getAvatarGradient()
                                                )}>
                                                    {user?.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.name}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        user?.name?.charAt(0).toUpperCase() || 'U'
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn(
                                                        "font-semibold truncate",
                                                        darkMode ? 'text-white' : 'text-gray-900'
                                                    )}>
                                                        {user?.name}
                                                    </p>
                                                    <div className="flex items-center mt-0.5">
                                                        <span className={cn(
                                                            "text-xs px-2 py-0.5 rounded-full",
                                                            user?.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                user?.role === 'manager' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                        )}>
                                                            {user?.role?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 space-y-1">
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                    <Mail className="w-3 h-3 mr-2" />
                                                    <span className="truncate">{user?.email}</span>
                                                </div>
                                                {user?.phone && (
                                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                        <Phone className="w-3 h-3 mr-2" />
                                                        <span>{user.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Menu Items - Role Based */}
                                        <div className="p-2">
                                            {/* Common for all roles */}
                                            <Link
                                                href="/profile"
                                                onClick={() => setShowProfile(false)}
                                                className={cn(
                                                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                                                    darkMode
                                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                )}
                                            >
                                                <User size={18} />
                                                <span>My Profile</span>
                                            </Link>

                                            <Link
                                                href="/account"
                                                onClick={() => setShowProfile(false)}
                                                className={cn(
                                                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                                                    darkMode
                                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                )}
                                            >
                                                <Settings size={18} />
                                                <span>Account Settings</span>
                                            </Link>

                                            {/* Role-specific menu items */}
                                            {user?.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setShowProfile(false)}
                                                    className={cn(
                                                        "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                                                        darkMode
                                                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                    )}
                                                >
                                                    <Shield size={18} />
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            )}

                                            {user?.role === 'manager' && (
                                                <Link
                                                    href="/manager"
                                                    onClick={() => setShowProfile(false)}
                                                    className={cn(
                                                        "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                                                        darkMode
                                                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                    )}
                                                >
                                                    <Briefcase size={18} />
                                                    <span>Manager Dashboard</span>
                                                </Link>
                                            )}

                                            <Link
                                                href="/help"
                                                onClick={() => setShowProfile(false)}
                                                className={cn(
                                                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                                                    darkMode
                                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                )}
                                            >
                                                <HelpCircle size={18} />
                                                <span>Help & Support</span>
                                            </Link>

                                            <div className="border-t my-2" />

                                            {/* Sign Out */}
                                            <button
                                                onClick={() => {
                                                    logout()
                                                    setShowProfile(false)
                                                    router.push('/')
                                                }}
                                                className={cn(
                                                    "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                                                    darkMode
                                                        ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                                                        : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                                                )}
                                            >
                                                <LogOut size={18} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>

                                        <div className={cn(
                                            "p-3 border-t text-xs text-center",
                                            darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-500'
                                        )}>
                                            <p>Analytics Dashboard v2.1.0</p>
                                        </div>
                                    </Card>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}