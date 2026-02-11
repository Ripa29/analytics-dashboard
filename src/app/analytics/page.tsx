'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { BarChart3, TrendingUp, Users, Eye, Clock, Download, Calendar, Filter, Globe, Smartphone, Monitor } from 'lucide-react'
import toast from 'react-hot-toast'

const analyticsData = {
    pageViews: 12543,
    sessions: 8456,
    bounceRate: 32.5,
    avgSessionDuration: 4.2,
    newUsers: 1234,
    returningUsers: 4567,
    topPages: [
        { page: '/dashboard', views: 3245, change: 12.5 },
        { page: '/products', views: 2876, change: 8.3 },
        { page: '/users', views: 1890, change: -2.1 },
        { page: '/orders', views: 1567, change: 15.7 },
        { page: '/settings', views: 987, change: 5.2 },
    ],
    trafficSources: [
        { source: 'Organic Search', value: 45, change: 8.2 },
        { source: 'Direct', value: 25, change: 3.1 },
        { source: 'Social Media', value: 18, change: 12.5 },
        { source: 'Referral', value: 12, change: -1.5 },
    ],
    devices: [
        { device: 'Desktop', value: 55, change: 2.3 },
        { device: 'Mobile', value: 38, change: 5.7 },
        { device: 'Tablet', value: 7, change: -0.8 },
    ]
}

export default function AnalyticsPage() {
    const { user } = useDashboardStore()
    const [dateRange, setDateRange] = useState('30d')

    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            You don't have permission to access analytics. Only Admin and Manager roles can view this page.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleExport = () => {
        const exportData = [
            ['Metric', 'Value', 'Change'],
            ['Page Views', analyticsData.pageViews, '+12.5%'],
            ['Sessions', analyticsData.sessions, '+8.3%'],
            ['Bounce Rate', `${analyticsData.bounceRate}%`, '-2.1%'],
            ['Avg Session Duration', `${analyticsData.avgSessionDuration}m`, '+0.5m'],
            ['New Users', analyticsData.newUsers, '+15.2%'],
            ['Returning Users', analyticsData.returningUsers, '+5.8%'],
            ...analyticsData.topPages.map(p => [`Top Page: ${p.page}`, p.views, `${p.change > 0 ? '+' : ''}${p.change}%`]),
            ...analyticsData.trafficSources.map(s => [`Traffic: ${s.source}`, `${s.value}%`, `${s.change > 0 ? '+' : ''}${s.change}%`]),
        ]

        const csv = exportData.map(row => row.join(',')).join('\n')
        downloadFile(csv, `analytics-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
        toast.success('Analytics data exported successfully')
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Website and user analytics</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-2">
                        <Calendar className="text-gray-400" size={18} />
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="12m">Last 12 months</option>
                        </select>
                    </div>
                    <Button variant="secondary" icon={<Download size={18} />} onClick={handleExport}>
                        Export
                    </Button>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                        {user.role.toUpperCase()} ACCESS
                    </span>
                </div>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Page Views</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {analyticsData.pageViews.toLocaleString()}
                                </p>
                                <div className="flex items-center text-green-600 dark:text-green-400 text-sm mt-2">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span>+12.5%</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {analyticsData.sessions.toLocaleString()}
                                </p>
                                <div className="flex items-center text-green-600 dark:text-green-400 text-sm mt-2">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span>+8.3%</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {analyticsData.bounceRate}%
                                </p>
                                <div className="flex items-center text-green-600 dark:text-green-400 text-sm mt-2">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span>-2.1%</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                                <BarChart3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Session</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {analyticsData.avgSessionDuration}m
                                </p>
                                <div className="flex items-center text-green-600 dark:text-green-400 text-sm mt-2">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span>+0.5m</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">New Users</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">This month</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {analyticsData.newUsers.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-green-600 dark:text-green-400">+234 this week</p>
                                    </div>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: '70%' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Returning Users</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">This month</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {analyticsData.returningUsers.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-purple-600 dark:text-purple-400">+156 this week</p>
                                    </div>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                                        style={{ width: '85%' }}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Conversion Rate</span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">4.3%</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-gray-600 dark:text-gray-400">Avg. Order Value</span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">$156.78</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analyticsData.topPages.map((page, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                                            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{page.page}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Page views</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {page.views.toLocaleString()}
                                        </p>
                                        <p className={`text-xs ${page.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {page.change > 0 ? '+' : ''}{page.change}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Traffic Sources & Devices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Globe className="w-5 h-5" />
                            <span>Traffic Sources</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analyticsData.trafficSources.map((source, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {source.source}
                                        </span>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {source.value}%
                                            </span>
                                            <span className={`text-xs ${source.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {source.change > 0 ? '+' : ''}{source.change}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${source.value}%`,
                                                background: index === 0 ? '#3B82F6' :
                                                    index === 1 ? '#10B981' :
                                                        index === 2 ? '#8B5CF6' : '#F59E0B'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Monitor className="w-5 h-5" />
                            <span>Device Breakdown</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analyticsData.devices.map((device, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            {device.device === 'Desktop' && <Monitor className="w-4 h-4 text-gray-500" />}
                                            {device.device === 'Mobile' && <Smartphone className="w-4 h-4 text-gray-500" />}
                                            {device.device === 'Tablet' && <Monitor className="w-4 h-4 text-gray-500" />}
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                {device.device}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {device.value}%
                                            </span>
                                            <span className={`text-xs ${device.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {device.change > 0 ? '+' : ''}{device.change}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${device.value}%`,
                                                background: index === 0 ? '#3B82F6' :
                                                    index === 1 ? '#8B5CF6' : '#10B981'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// Helper function
function downloadFile(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}