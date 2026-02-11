'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card'
import { Button } from '@/src/components/ui/Button'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { Database, Filter, Download,
    Search, Calendar, Shield, Settings, Lock, AlertCircle, CheckCircle, XCircle, Info,
    ChevronRight, Clock, Activity, HardDrive, Trash2, Users, ShoppingCart, Package, FileText, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface AuditLog {
    id: string
    timestamp: string
    user: string
    userRole: string
    action: string
    resource: string
    resourceId?: string
    details: string
    ipAddress: string
    status: 'success' | 'failure' | 'pending'
    severity: 'info' | 'warning' | 'critical'
}

// Mock audit logs data
const mockAuditLogs: AuditLog[] = [
    {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        user: 'Admin ',
        userRole: 'admin',
        action: 'USER_CREATE',
        resource: 'User',
        resourceId: 'usr_123',
        details: 'Created new user account for john.doe@example.com',
        ipAddress: '192.168.1.100',
        status: 'success',
        severity: 'info'
    },
    {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        user: 'Admin ',
        userRole: 'admin',
        action: 'USER_DELETE',
        resource: 'User',
        resourceId: 'usr_456',
        details: 'Deleted user account for jane.smith@example.com',
        ipAddress: '192.168.1.100',
        status: 'success',
        severity: 'warning'
    },
    {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        user: 'Manager ',
        userRole: 'manager',
        action: 'ORDER_UPDATE',
        resource: 'Order',
        resourceId: 'ord_789',
        details: 'Updated order status from pending to processing',
        ipAddress: '192.168.1.101',
        status: 'success',
        severity: 'info'
    },
    {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        user: 'System',
        userRole: 'system',
        action: 'BACKUP_COMPLETE',
        resource: 'Database',
        details: 'Automated database backup completed successfully',
        ipAddress: '127.0.0.1',
        status: 'success',
        severity: 'info'
    },
    {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        user: 'Admin ',
        userRole: 'admin',
        action: 'PERMISSION_UPDATE',
        resource: 'Permission',
        resourceId: 'perm_123',
        details: 'Modified role permissions for manager role',
        ipAddress: '192.168.1.100',
        status: 'success',
        severity: 'warning'
    },
    {
        id: '6',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        user: 'User',
        userRole: 'user',
        action: 'LOGIN_FAILED',
        resource: 'Authentication',
        details: 'Failed login attempt with invalid credentials',
        ipAddress: '203.0.113.45',
        status: 'failure',
        severity: 'critical'
    },
    {
        id: '7',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        user: 'Admin ',
        userRole: 'admin',
        action: 'SYSTEM_CONFIG_UPDATE',
        resource: 'Configuration',
        details: 'Updated system email settings',
        ipAddress: '192.168.1.100',
        status: 'success',
        severity: 'info'
    },
    {
        id: '8',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        user: 'Manager ',
        userRole: 'manager',
        action: 'PRODUCT_CREATE',
        resource: 'Product',
        resourceId: 'prod_123',
        details: 'Created new product: Premium Widget Pro',
        ipAddress: '192.168.1.101',
        status: 'success',
        severity: 'info'
    }
]

export default function AuditLogsPage() {
    const { user } = useDashboardStore()
    const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs)
    const [searchTerm, setSearchTerm] = useState('')
    const [actionFilter, setActionFilter] = useState<string>('all')
    const [severityFilter, setSeverityFilter] = useState<string>('all')
    const [dateRange, setDateRange] = useState<string>('24h')
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    // Check if user is admin
    if (user?.role !== 'admin') {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            You don't have permission to access Audit Logs. This area is restricted to Administrators only.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.resourceId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesAction = actionFilter === 'all' || log.action === actionFilter
        const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter

        // Date filtering
        let matchesDate = true
        const logDate = new Date(log.timestamp)
        const now = new Date()
        if (dateRange === '24h') {
            matchesDate = logDate > new Date(now.getTime() - 24 * 60 * 60 * 1000)
        } else if (dateRange === '7d') {
            matchesDate = logDate > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        } else if (dateRange === '30d') {
            matchesDate = logDate > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }

        return matchesSearch && matchesAction && matchesSeverity && matchesDate
    })

    const uniqueActions = Array.from(new Set(logs.map(log => log.action)))
    const actionCounts = logs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const getActionIcon = (action: string) => {
        if (action.includes('USER')) return <Users className="w-4 h-4" />
        if (action.includes('ORDER')) return <ShoppingCart className="w-4 h-4" />
        if (action.includes('PRODUCT')) return <Package className="w-4 h-4" />
        if (action.includes('PERMISSION')) return <Shield className="w-4 h-4" />
        if (action.includes('CONFIG')) return <Settings className="w-4 h-4" />
        if (action.includes('BACKUP')) return <Database className="w-4 h-4" />
        if (action.includes('LOGIN')) return <Lock className="w-4 h-4" />
        if (action.includes('REPORT')) return <FileText className="w-4 h-4" />
        return <Activity className="w-4 h-4" />
    }

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'critical':
                return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                        CRITICAL
                    </span>
                )
            case 'warning':
                return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        WARNING
                    </span>
                )
            default:
                return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        INFO
                    </span>
                )
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
                return (
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Success</span>
                    </div>
                )
            case 'failure':
                return (
                    <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Failed</span>
                    </div>
                )
            default:
                return (
                    <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Pending</span>
                    </div>
                )
        }
    }

    const handleExportLogs = () => {
        const exportData = filteredLogs.map(log => ({
            Timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
            User: log.user,
            Role: log.userRole,
            Action: log.action,
            Resource: log.resource,
            'Resource ID': log.resourceId || '-',
            Details: log.details,
            'IP Address': log.ipAddress,
            Status: log.status,
            Severity: log.severity
        }))

        const csv = convertToCSV(exportData)
        downloadFile(csv, `audit-logs-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`, 'text/csv')
        toast.success('Audit logs exported successfully')
    }

    const handleClearOldLogs = () => {
        if (window.confirm('Are you sure you want to clear logs older than 30 days? This action cannot be undone.')) {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            setLogs(logs.filter(log => new Date(log.timestamp) > thirtyDaysAgo))
            toast.success('Old logs cleared successfully')
        }
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-600/20 shadow-lg">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-600">
                            <Database className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Audit Logs
                            </h1>
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                                ADMIN ONLY
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Track and monitor all system activities and user actions
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        icon={<Download size={18} />}
                        onClick={handleExportLogs}
                    >
                        Export Logs
                    </Button>
                    <Button
                        variant="ghost"
                        icon={<Trash2 size={18} />}
                        onClick={handleClearOldLogs}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        Clear Old
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Total Events</p>
                                <p className="text-2xl font-bold">{logs.length}</p>
                            </div>
                            <Activity className="w-8 h-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm mb-1">Today</p>
                                <p className="text-2xl font-bold">
                                    {logs.filter(log => new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-amber-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm mb-1">Critical</p>
                                <p className="text-2xl font-bold">
                                    {logs.filter(log => log.severity === 'critical').length}
                                </p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-red-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm mb-1">Failed Actions</p>
                                <p className="text-2xl font-bold">
                                    {logs.filter(log => log.status === 'failure').length}
                                </p>
                            </div>
                            <XCircle className="w-8 h-8 text-purple-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search logs by user, action, resource, or details..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center space-x-2">
                                <Calendar className="text-gray-400" size={18} />
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="24h">Last 24 Hours</option>
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                    <option value="all">All Time</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Filter className="text-gray-400" size={18} />
                                <select
                                    value={actionFilter}
                                    onChange={(e) => setActionFilter(e.target.value)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Actions</option>
                                    {uniqueActions.slice(0, 10).map(action => (
                                        <option key={action} value={action}>{action}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <AlertCircle className="text-gray-400" size={18} />
                                <select
                                    value={severityFilter}
                                    onChange={(e) => setSeverityFilter(e.target.value)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Severities</option>
                                    <option value="critical">Critical</option>
                                    <option value="warning">Warning</option>
                                    <option value="info">Info</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <HardDrive className="w-5 h-5" />
                            <span>System Activity Logs ({filteredLogs.length})</span>
                        </div>
                        <span className="text-sm font-normal text-gray-500">
                            Showing {filteredLogs.length} of {logs.length} events
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Timestamp</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">User</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Action</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Resource</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Severity</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">IP Address</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredLogs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    onClick={() => {
                                        setSelectedLog(log)
                                        setIsDetailOpen(true)
                                    }}
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {format(new Date(log.timestamp), 'HH:mm:ss')}
                                                </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-500">
                                                    {format(new Date(log.timestamp), 'MMM d, yyyy')}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {log.user}
                                                </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                                                    {log.userRole}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                                                {getActionIcon(log.action)}
                                            </div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {log.action.replace(/_/g, ' ')}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {log.resource}
                                                </span>
                                            {log.resourceId && (
                                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                                        ID: {log.resourceId}
                                                    </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {getStatusBadge(log.status)}
                                    </td>
                                    <td className="py-3 px-4">
                                        {getSeverityBadge(log.severity)}
                                    </td>
                                    <td className="py-3 px-4">
                                            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                                {log.ipAddress}
                                            </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {filteredLogs.length === 0 && (
                            <div className="text-center py-12">
                                <Database className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                                <p className="text-gray-600 dark:text-gray-400">No audit logs found</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                    Try adjusting your filters or search criteria
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Log Detail Modal */}
            {isDetailOpen && selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    <Info className="w-5 h-5" />
                                    <span>Audit Log Details</span>
                                </CardTitle>
                                <button
                                    onClick={() => setIsDetailOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Event ID</p>
                                        <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                                            {selectedLog.id}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Timestamp</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {format(new Date(selectedLog.timestamp), 'MMMM d, yyyy HH:mm:ss')}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">User</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedLog.user}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{selectedLog.userRole}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">IP Address</p>
                                        <p className="font-mono font-medium text-gray-900 dark:text-white">{selectedLog.ipAddress}</p>
                                    </div>
                                    <div className="col-span-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Action Details</p>
                                        <p className="font-medium text-gray-900 dark:text-white mb-2">
                                            {selectedLog.action.replace(/_/g, ' ')}
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {selectedLog.details}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Resource</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedLog.resource}</p>
                                        {selectedLog.resourceId && (
                                            <p className="text-xs text-gray-500 dark:text-gray-500">ID: {selectedLog.resourceId}</p>
                                        )}
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status & Severity</p>
                                        <div className="flex items-center space-x-2">
                                            {getStatusBadge(selectedLog.status)}
                                            {getSeverityBadge(selectedLog.severity)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

// Helper functions
function convertToCSV(data: any[]) {
    if (!data.length) return ''
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(obj =>
        Object.values(obj).map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
    )
    return [headers, ...rows].join('\n')
}

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