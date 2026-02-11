'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    BarChart3,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Package,
    FileText,
    Shield,
    Briefcase,
    UserCheck,
    Database,
    LogOut,
    Bell,
    ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { UserRole } from '@/types'

interface MenuItem {
    href: string
    icon: React.ReactNode
    label: string
    roles: UserRole[]
    badge?: number
}

const getMenuItems = (userRole: UserRole = 'user'): MenuItem[] => {
    const baseItems: MenuItem[] = [
        {
            href: '/',
            icon: <LayoutDashboard size={20} />,
            label: 'Dashboard',
            roles: ['admin', 'manager', 'user']
        }
    ]

    const userManagementItems: MenuItem[] = [
        {
            href: '/users',
            icon: <Users size={20} />,
            label: 'Users',
            roles: ['admin', 'manager'],
            badge: 3
        }
    ]

    const businessItems: MenuItem[] = [
        {
            href: '/orders',
            icon: <ShoppingCart size={20} />,
            label: 'Orders',
            roles: ['admin', 'manager', 'user'],
            badge: 12
        },
        {
            href: '/products',
            icon: <Package size={20} />,
            label: 'Products',
            roles: ['admin', 'manager', 'user']
        }
    ]

    const analyticsItems: MenuItem[] = [
        {
            href: '/analytics',
            icon: <BarChart3 size={20} />,
            label: 'Analytics',
            roles: ['admin', 'manager']
        },
        {
            href: '/reports',
            icon: <FileText size={20} />,
            label: 'Reports',
            roles: ['admin', 'manager']
        }
    ]

    const adminItems: MenuItem[] = userRole === 'admin' ? [
        {
            href: '/admin/settings',
            icon: <Shield size={20} />,
            label: 'Admin Settings',
            roles: ['admin']
        },
        {
            href: '/admin/audit',
            icon: <Database size={20} />,
            label: 'Audit Logs',
            roles: ['admin']
        }
    ] : []

    const managerItems: MenuItem[] = userRole === 'manager' ? [
        {
            href: '/manager/team',
            icon: <Briefcase size={20} />,
            label: 'Team Management',
            roles: ['manager']
        },
        {
            href: '/manager/approvals',
            icon: <UserCheck size={20} />,
            label: 'Approvals',
            roles: ['manager'],
            badge: 5
        }
    ] : []

    const supportItems: MenuItem[] = [
        {
            href: '/settings',
            icon: <Settings size={20} />,
            label: 'Settings',
            roles: ['admin', 'manager', 'user']
        },
        {
            href: '/help',
            icon: <HelpCircle size={20} />,
            label: 'Help & Support',
            roles: ['admin', 'manager', 'user']
        }
    ]

    return [
        ...baseItems,
        ...userManagementItems,
        ...businessItems,
        ...analyticsItems,
        ...adminItems,
        ...managerItems,
        ...supportItems
    ]
}

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()
    const { darkMode, user, logout } = useDashboardStore()

    const menuItems = getMenuItems(user?.role)
    const filteredItems = menuItems.filter(item =>
        item.roles.includes(user?.role || 'user')
    )

    const getRoleBadge = () => {
        if (!user) return null
        switch (user.role) {
            case 'admin':
                return (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                        ADMIN
                    </span>
                )
            case 'manager':
                return (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full">
                        MANAGER
                    </span>
                )
            default:
                return (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full">
                        USER
                    </span>
                )
        }
    }

    const getAvatarColor = () => {
        if (!user) return 'from-gray-500 to-gray-600'
        switch (user.role) {
            case 'admin': return 'from-blue-500 to-blue-600'
            case 'manager': return 'from-green-500 to-green-600'
            default: return 'from-purple-500 to-purple-600'
        }
    }

    return (
        <aside className={cn(
            "flex flex-col h-screen sticky top-0 z-30 transition-all duration-300",
            collapsed ? 'w-20' : 'w-64',
            darkMode
                ? 'bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700'
                : 'bg-gradient-to-b from-white to-gray-50 border-gray-200',
            "border-r shadow-lg"
        )}>
            {/* Logo Section */}
            <div className="flex items-center justify-between h-16 px-4 border-b">
                {!collapsed ? (
                    <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold gradient-text">
                            Analytics
                        </span>
                    </div>
                ) : (
                    <div className="w-8 h-8 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg" />
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        darkMode
                            ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    )}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* User Profile Section - Always Visible */}
            {user && (
                <div className={cn(
                    "p-4 border-b",
                    darkMode ? 'border-gray-700' : 'border-gray-200',
                    collapsed ? 'text-center' : ''
                )}>
                    <div className={cn(
                        "flex",
                        collapsed ? 'flex-col items-center' : 'items-center space-x-3'
                    )}>
                        {/* Avatar */}
                        <div className={cn(
                            "rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold shadow-lg",
                            getAvatarColor(),
                            collapsed ? 'w-10 h-10 text-lg' : 'w-12 h-12 text-xl'
                        )}>
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                user.name?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>

                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">
                                    {user.name}
                                </p>
                                <div className="flex items-center mt-1">
                                    {getRoleBadge()}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                    {user.email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 group relative",
                                collapsed ? 'justify-center' : 'justify-start',
                                isActive
                                    ? darkMode
                                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400'
                                        : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                                    : darkMode
                                        ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                        >
                            <div className={cn(
                                "transition-transform duration-200",
                                isActive && 'scale-110'
                            )}>
                                {item.icon}
                            </div>

                            {!collapsed && (
                                <>
                                    <span className="ml-3 font-medium flex-1">
                                        {item.label}
                                    </span>
                                    {item.badge && (
                                        <span className={cn(
                                            "px-2 py-0.5 text-xs font-semibold rounded-full",
                                            isActive
                                                ? 'bg-blue-500 text-white'
                                                : darkMode
                                                    ? 'bg-gray-700 text-gray-300'
                                                    : 'bg-gray-200 text-gray-700'
                                        )}>
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                                    {item.label}
                                    {item.badge && (
                                        <span className="ml-2 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className={cn(
                "p-4 border-t",
                darkMode ? 'border-gray-700' : 'border-gray-200'
            )}>
                {collapsed ? (
                    <button
                        onClick={logout}
                        className="w-full p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut size={20} className="mx-auto" />
                    </button>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Logged in as {user?.role}</span>
                            <span>v2.1.0</span>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut size={16} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    )
}