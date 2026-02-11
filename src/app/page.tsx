'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FilterBar } from '../components/dashboard/FilterBar'
import { KPICard } from '../components/dashboard/KPICard'
import { RevenueChart } from '../components/charts/RevenueChart'
import { OrdersChart } from '../components/charts/OrdersChart'
import { UsersChart } from '../components/charts/UsersChart'
import { TrafficChart } from '../components/charts/TrafficChart'
import { RecentActivity } from '../components/dashboard/RecentActivity'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { staticData } from '@/lib/data'
import { Button } from '../components/ui/Button'
import { Download, Users, ShoppingBag, Shield, Briefcase, User, FileText,
    Package, ArrowRight, Star, Clock, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'

export default function DashboardPage() {
    const { user, dateRange, userType } = useDashboardStore()
    const [isLoading, setIsLoading] = useState(true)
    const [greeting, setGreeting] = useState('')
    const router = useRouter()

    // Redirect if no user
    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user, router])

    // Set greeting based on time
    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good Morning')
        else if (hour < 18) setGreeting('Good Afternoon')
        else setGreeting('Good Evening')
    }, [])

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [dateRange, userType])

    // Export function
    const exportToCSV = () => {
        try {
            const wb = XLSX.utils.book_new()

            const kpiData = [
                ['Metric', 'Value', 'Change'],
                ['Total Revenue', `$${staticData.stats.revenue}`, `${staticData.stats.revenueChange}%`],
                ['Total Users', staticData.stats.users, `${staticData.stats.usersChange}%`],
                ['Total Orders', staticData.stats.orders, `${staticData.stats.ordersChange}%`],
                ['Conversion Rate', `${staticData.stats.conversionRate}%`, `${staticData.stats.conversionChange}%`]
            ]
            const kpiWs = XLSX.utils.aoa_to_sheet(kpiData)
            XLSX.utils.book_append_sheet(wb, kpiWs, 'KPIs')

            const revenueWs = XLSX.utils.json_to_sheet(staticData.revenue)
            XLSX.utils.book_append_sheet(wb, revenueWs, 'Revenue')

            const ordersWs = XLSX.utils.json_to_sheet(staticData.orders)
            XLSX.utils.book_append_sheet(wb, ordersWs, 'Orders')

            const timestamp = new Date().toISOString().split('T')[0]
            const filename = `analytics_dashboard_${timestamp}.xlsx`

            XLSX.writeFile(wb, filename)
            toast.success('Data exported successfully!')
        } catch (error) {
            toast.error('Failed to export data')
        }
    }

    // Get role-based gradient
    const getRoleGradient = () => {
        switch (user?.role) {
            case 'admin': return 'from-blue-600 to-purple-600'
            case 'manager': return 'from-green-600 to-emerald-600'
            default: return 'from-purple-600 to-pink-600'
        }
    }

    // Get role icon
    const getRoleIcon = () => {
        switch (user?.role) {
            case 'admin': return <Shield className="w-6 h-6" />
            case 'manager': return <Briefcase className="w-6 h-6" />
            default: return <User className="w-6 h-6" />
        }
    }

    // Get role badge color
    const getRoleBadgeColor = () => {
        switch (user?.role) {
            case 'admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'manager': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            default: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
        }
    }

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                {/* Welcome  */}
                <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl animate-pulse" />

                {/* KPI Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                    ))}
                </div>

                {/* Charts Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    // ============ ADMIN DASHBOARD ============
    if (user?.role === 'admin') {
        return (
            <div className="p-4 sm:p-6 space-y-6">
                {/* Welcome Header - Admin */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <Shield className="w-8 h-8" />
                                <h1 className="text-2xl sm:text-3xl font-bold">
                                    {greeting}, {user?.name}! 👋
                                </h1>
                            </div>
                            <p className="text-blue-100 text-lg">
                                Welcome to your Admin Dashboard. Here's your business overview.
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center space-x-3">
                            <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg text-sm font-medium">
                                Last updated: {new Date().toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                            <p className="text-blue-100 text-xs">Total Revenue</p>
                            <p className="text-xl font-bold">${staticData.stats.revenue.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                            <p className="text-blue-100 text-xs">Total Users</p>
                            <p className="text-xl font-bold">{staticData.stats.users.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                            <p className="text-blue-100 text-xs">Total Orders</p>
                            <p className="text-xl font-bold">{staticData.stats.orders.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                            <p className="text-blue-100 text-xs">Conversion</p>
                            <p className="text-xl font-bold">{staticData.stats.conversionRate}%</p>
                        </div>
                    </div>
                </div>

                {/* Admin Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/users">
                        <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                            <CardContent className="p-4 flex items-center space-x-3">
                                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-500 transition-colors">
                                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">Users</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/products">
                        <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                            <CardContent className="p-4 flex items-center space-x-3">
                                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 group-hover:bg-green-500 transition-colors">
                                    <Package className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">Products</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/orders">
                        <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                            <CardContent className="p-4 flex items-center space-x-3">
                                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-500 transition-colors">
                                    <ShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">Orders</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/reports">
                        <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                            <CardContent className="p-4 flex items-center space-x-3">
                                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-500 transition-colors">
                                    <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Generate</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">Reports</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <FilterBar />

                {/* Export Button */}
                <div className="flex justify-end">
                    <Button onClick={exportToCSV} icon={<Download size={18} />} variant="secondary">
                        Export Dashboard Data
                    </Button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                        title="Total Revenue"
                        value={staticData.stats.revenue}
                        change={staticData.stats.revenueChange}
                        icon="revenue"
                        trend="up"
                    />
                    <KPICard
                        title="Total Users"
                        value={staticData.stats.users}
                        change={staticData.stats.usersChange}
                        icon="users"
                        trend="up"
                    />
                    <KPICard
                        title="Orders"
                        value={staticData.stats.orders}
                        change={staticData.stats.ordersChange}
                        icon="orders"
                        trend={staticData.stats.ordersChange > 0 ? "up" : "down"}
                    />
                    <KPICard
                        title="Conversion Rate"
                        value={`${staticData.stats.conversionRate}%`}
                        change={staticData.stats.conversionChange}
                        icon="conversion"
                        trend="up"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RevenueChart data={staticData.revenue} />
                    <OrdersChart data={staticData.orders} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <UsersChart data={staticData.users} />
                    <TrafficChart data={staticData.traffic} />
                </div>

                {/* Recent Activity */}
                <RecentActivity />
            </div>
        )
    }

    // ============ MANAGER DASHBOARD ============
    if (user?.role === 'manager') {
        return (
            <div className="p-4 sm:p-6 space-y-6">
                {/* Welcome Header - Manager */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <Briefcase className="w-8 h-8" />
                                <h1 className="text-2xl sm:text-3xl font-bold">
                                    {greeting}, {user?.name}! 📊
                                </h1>
                            </div>
                            <p className="text-green-100 text-lg">
                                Track your team's performance and manage daily operations.
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center space-x-2">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm">
                                Team Lead
                            </span>
                        </div>
                    </div>

                    {/* Manager Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                            <p className="text-green-100 text-xs">Team Members</p>
                            <p className="text-xl font-bold">12</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                            <p className="text-green-100 text-xs">Pending Orders</p>
                            <p className="text-xl font-bold">8</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                            <p className="text-green-100 text-xs">This Month</p>
                            <p className="text-xl font-bold">$45.2K</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                            <p className="text-green-100 text-xs">Target</p>
                            <p className="text-xl font-bold">78%</p>
                        </div>
                    </div>
                </div>

                {/* Manager Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Link href="/orders">
                        <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-l-4 border-l-green-500">
                            <CardContent className="p-4 flex items-center space-x-3">
                                <ShoppingBag className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Process</p>
                                    <p className="font-semibold">New Orders</p>
                                </div>
                                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">12</span>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/products">
                        <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-l-4 border-l-green-500">
                            <CardContent className="p-4 flex items-center space-x-3">
                                <Package className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Update</p>
                                    <p className="font-semibold">Inventory</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/reports">
                        <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-l-4 border-l-green-500">
                            <CardContent className="p-4 flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Generate</p>
                                    <p className="font-semibold">Reports</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Manager Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* KPI Cards - 2 columns */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <KPICard
                            title="Total Revenue"
                            value={staticData.stats.revenue}
                            change={staticData.stats.revenueChange}
                            icon="revenue"
                            trend="up"
                        />
                        <KPICard
                            title="Orders"
                            value={staticData.stats.orders}
                            change={staticData.stats.ordersChange}
                            icon="orders"
                            trend={staticData.stats.ordersChange > 0 ? "up" : "down"}
                        />
                        <KPICard
                            title="Products"
                            value={156}
                            change={5.2}
                            icon="orders"
                            trend="up"
                        />
                        <KPICard
                            title="Conversion"
                            value={`${staticData.stats.conversionRate}%`}
                            change={staticData.stats.conversionChange}
                            icon="conversion"
                            trend="up"
                        />
                    </div>

                    {/* Team Performance Card */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-lg">
                                <Users className="w-5 h-5 text-green-500" />
                                <span>Team Performance</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Sales Target</span>
                                    <span className="font-bold">78%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }} />
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-sm text-gray-600">Customer Satisfaction</span>
                                    <span className="font-bold">4.8/5</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '96%' }} />
                                </div>

                                <div className="mt-6 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Team Members</span>
                                        <Link href="/team" className="text-sm text-green-600 hover:text-green-700 flex items-center">
                                            View All <ArrowRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                    <div className="flex -space-x-2 mt-3">
                                        {[1,2,3,4,5].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                                                {String.fromCharCode(64 + i)}
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                                            +3
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts for Manager */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RevenueChart data={staticData.revenue} />
                    <OrdersChart data={staticData.orders} />
                </div>

                {/* Recent Activity */}
                <RecentActivity />
            </div>
        )
    }

    // ============ USER DASHBOARD ============
    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Welcome Header - User */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <User className="w-8 h-8" />
                            <h1 className="text-2xl sm:text-3xl font-bold">
                                {greeting}, {user?.name}! ✨
                            </h1>
                        </div>
                        <p className="text-purple-100 text-lg">
                            Your personal dashboard. Track your orders and activity.
                        </p>
                    </div>
                    <div className="hidden sm:block">
                        <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                            <p className="text-xs text-purple-200">Member since</p>
                            <p className="text-sm font-semibold">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2024'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                        <p className="text-purple-100 text-xs">My Orders</p>
                        <p className="text-xl font-bold">24</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                        <p className="text-purple-100 text-xs">Wishlist</p>
                        <p className="text-xl font-bold">8</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                        <p className="text-purple-100 text-xs">Reviews</p>
                        <p className="text-xl font-bold">12</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                        <p className="text-purple-100 text-xs">Points</p>
                        <p className="text-xl font-bold">1,250</p>
                    </div>
                </div>
            </div>

            {/* User Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/orders">
                    <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-purple-200 dark:border-purple-900">
                        <CardContent className="p-4 text-center">
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">My Orders</p>
                            <p className="text-xs text-gray-500">Track your orders</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/products">
                    <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-purple-200 dark:border-purple-900">
                        <CardContent className="p-4 text-center">
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">Products</p>
                            <p className="text-xs text-gray-500">Browse catalog</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/wishlist">
                    <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-purple-200 dark:border-purple-900">
                        <CardContent className="p-4 text-center">
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">Wishlist</p>
                            <p className="text-xs text-gray-500">8 items</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/profile">
                    <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-purple-200 dark:border-purple-900">
                        <CardContent className="p-4 text-center">
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">Profile</p>
                            <p className="text-xs text-gray-500">Edit profile</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* User Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-purple-500" />
                                <span>Recent Orders</span>
                            </div>
                            <Link href="/orders" className="text-sm text-purple-600 hover:text-purple-700 flex items-center">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { id: '#ORD-001', date: '2024-01-15', amount: 299.99, status: 'Delivered' },
                                { id: '#ORD-002', date: '2024-01-14', amount: 149.99, status: 'Processing' },
                                { id: '#ORD-003', date: '2024-01-12', amount: 599.99, status: 'Shipped' },
                                { id: '#ORD-004', date: '2024-01-10', amount: 79.99, status: 'Delivered' },
                            ].map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                                        <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 dark:text-white">${order.amount}</p>
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full",
                                            order.status === 'Delivered' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                                            order.status === 'Processing' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                                            order.status === 'Shipped' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        )}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* User Stats Card */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-purple-500" />
                            <span>Your Activity</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Orders this month</span>
                                <span className="font-bold text-purple-600">12</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }} />
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-gray-600">Wishlist items</span>
                                <span className="font-bold text-purple-600">8</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-pink-500 rounded-full" style={{ width: '40%' }} />
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-gray-600">Reviews given</span>
                                <span className="font-bold text-purple-600">12</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: '80%' }} />
                            </div>

                            <div className="mt-6 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium">Reward Points</span>
                                    </div>
                                    <span className="text-lg font-bold text-purple-600">1,250</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recommended Products */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span>Recommended for You</span>
                        </div>
                        <Link href="/products" className="text-sm text-purple-600 hover:text-purple-700 flex items-center">
                            Browse All <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'Premium Widget', price: 299.99, image: '🖥️' },
                            { name: 'Smart Watch', price: 199.99, image: '⌚' },
                            { name: 'Wireless Earbuds', price: 149.99, image: '🎧' },
                            { name: 'Gaming Mouse', price: 79.99, image: '🖱️' },
                        ].map((product, i) => (
                            <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                                <div className="text-4xl mb-3 text-center">{product.image}</div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-center">{product.name}</h3>
                                <p className="text-purple-600 font-bold text-center mt-2">${product.price}</p>
                                <Button size="sm" className="w-full mt-3">View</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <RecentActivity />
        </div>
    )
}