'use client'

import React, { useState } from 'react'
import { Calendar, Filter, Download, FileText, Table, ChevronDown, RefreshCw, TrendingUp, Users, BarChart3 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { useCRUDStore } from '@/lib/store/crudStore'
import toast from 'react-hot-toast'

export const FilterBar: React.FC = () => {
    const { dateRange, userType, setDateRange, setUserType } = useDashboardStore()
    const { exportToCSV, exportToExcel } = useCRUDStore()
    const [isExporting, setIsExporting] = useState<'csv' | 'excel' | null>(null)

    const handleExport = async (format: 'csv' | 'excel') => {
        setIsExporting(format)

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            if (format === 'csv') {
                exportToCSV('analytics')
            } else {
                exportToExcel('analytics')
            }

            toast.success(
                <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                        {format === 'csv' ? (
                            <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                            <Table className="w-4 h-4 text-green-600 dark:text-green-400" />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold">Export Successful</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Data exported as {format.toUpperCase()}
                        </p>
                    </div>
                </div>,
                { duration: 4000 }
            )
        } catch (error) {
            toast.error('Export failed. Please try again.')
        } finally {
            setIsExporting(null)
        }
    }

    const getDateRangeLabel = () => {
        switch (dateRange) {
            case '7d': return 'Last 7 days'
            case '30d': return 'Last 30 days'
            case '12m': return 'Last 12 months'
            default: return 'Select period'
        }
    }

    const getUserTypeLabel = () => {
        switch (userType) {
            case 'all': return 'All Users'
            case 'free': return 'Free Users'
            case 'premium': return 'Premium Users'
            case 'enterprise': return 'Enterprise'
            default: return 'All Users'
        }
    }

    return (
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5" />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-500/10 to-blue-500/10 rounded-full blur-3xl translate-y-32 -translate-x-32" />

            <div className="relative p-6">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 shadow-lg shadow-blue-500/10">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center space-x-3">
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Analytics Dashboard
                                </h1>
                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                                    Live
                                </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Monitor your business metrics and performance
                                </p>
                                <div className="hidden md:flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-500">
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Updated 1 min ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                1,245 total
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                +12.5% vs last month
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filters and Export Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Filter Group */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Date Range Selector */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500" />
                            <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-colors">
                                <div className="flex items-center px-3 py-2">
                                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                                        {getDateRangeLabel()}
                                    </span>
                                </div>
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value as any)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                >
                                    <option value="7d">Last 7 days</option>
                                    <option value="30d">Last 30 days</option>
                                    <option value="12m">Last 12 months</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                            </div>
                        </div>

                        {/* User Type Selector */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500" />
                            <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group-hover:border-green-500 dark:group-hover:border-green-500 transition-colors">
                                <div className="flex items-center px-3 py-2">
                                    <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                                        {getUserTypeLabel()}
                                    </span>
                                </div>
                                <select
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value as any)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                >
                                    <option value="all">All Users</option>
                                    <option value="free">Free Users</option>
                                    <option value="premium">Premium Users</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                            </div>
                        </div>

                        {/* Active Filters Indicator */}
                        {(dateRange !== '12m' || userType !== 'all') && (
                            <div className="flex items-center px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                                    {dateRange !== '12m' && 'Custom date'}
                                    {dateRange !== '12m' && userType !== 'all' && ' • '}
                                    {userType !== 'all' && `${userType} users`}
                                </span>
                                <button
                                    onClick={() => {
                                        setDateRange('12m')
                                        setUserType('all')
                                    }}
                                    className="ml-2 p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                                >
                                    <span className="sr-only">Clear filters</span>
                                    <span className="text-blue-700 dark:text-blue-400 text-xs">×</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Export Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            icon={isExporting === 'csv' ? undefined : <FileText size={18} />}
                            onClick={() => handleExport('csv')}
                            isLoading={isExporting === 'csv'}
                            className="relative group overflow-hidden bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center">
                                Export CSV
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        </Button>

                        <Button
                            variant="secondary"
                            icon={isExporting === 'excel' ? undefined : <Table size={18} />}
                            onClick={() => handleExport('excel')}
                            isLoading={isExporting === 'excel'}
                            className="relative group overflow-hidden bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center">
                                Export Excel
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        </Button>
                    </div>
                </div>

                {/* Bottom Stats Bar */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-gray-600 dark:text-gray-400">Data synced</span>
                            </div>
                            <span className="text-gray-400 dark:text-gray-600">|</span>
                            <span className="text-gray-600 dark:text-gray-400">
                                Last export: <span className="font-medium text-gray-900 dark:text-white">Today, 10:23 AM</span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Download className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                                CSV • Excel • PDF
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}