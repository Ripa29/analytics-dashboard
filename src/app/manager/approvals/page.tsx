'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, CheckCircle, XCircle, Clock, AlertCircle, FileText, Calendar, User, DollarSign,
    CreditCard, Plane, Home,Search, Filter, Download, CheckCheck,Eye, MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/src/components/ui/Card'
import { Button } from '@/src/components/ui/Button'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ApprovalRequest {
    id: string
    type: 'leave' | 'expense' | 'purchase' | 'travel' | 'overtime' | 'remote'
    title: string
    description: string
    requester: {
        id: string
        name: string
        avatar: string
        department: string
        position: string
    }
    amount?: number
    currency?: string
    date: Date
    startDate?: Date
    endDate?: Date
    days?: number
    status: 'pending' | 'approved' | 'rejected' | 'more_info'
    priority: 'high' | 'medium' | 'low'
    attachments?: number
    comments?: number
}

export default function ApprovalsPage() {
    const { user, darkMode } = useDashboardStore()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('pending')

    // Check if user is manager
    if (!user || user.role !== 'manager') {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <Briefcase className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Access Denied
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            You don't have permission to access Approvals.
                        </p>
                        <Button
                            onClick={() => router.push('/')}
                            className="mt-6"
                        >
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Mock approval requests
    const [approvals, setApprovals] = useState<ApprovalRequest[]>([
        {
            id: '1',
            type: 'leave',
            title: 'Annual Leave Request',
            description: '2 weeks vacation to Japan',
            requester: {
                id: '1',
                name: 'Sarah Johnson',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                department: 'Engineering',
                position: 'Senior Developer'
            },
            date: new Date('2024-01-15'),
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-02-14'),
            days: 10,
            status: 'pending',
            priority: 'medium',
            attachments: 2,
            comments: 3
        },
        {
            id: '2',
            type: 'expense',
            title: 'Conference Travel Expenses',
            description: 'React Summit 2024 - NYC',
            requester: {
                id: '2',
                name: 'Michael Chen',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
                department: 'Engineering',
                position: 'Senior Developer'
            },
            amount: 1250.00,
            currency: 'USD',
            date: new Date('2024-01-14'),
            status: 'pending',
            priority: 'high',
            attachments: 5,
            comments: 2
        },
        {
            id: '3',
            type: 'purchase',
            title: 'Equipment Purchase',
            description: 'New MacBook Pro 16" for design team',
            requester: {
                id: '3',
                name: 'Emily Rodriguez',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
                department: 'Design',
                position: 'UI/UX Lead'
            },
            amount: 2499.00,
            currency: 'USD',
            date: new Date('2024-01-13'),
            status: 'more_info',
            priority: 'medium',
            attachments: 3,
            comments: 5
        },
        {
            id: '4',
            type: 'travel',
            title: 'Client Visit',
            description: 'Meeting with enterprise client in Chicago',
            requester: {
                id: '4',
                name: 'David Brown',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
                department: 'Sales',
                position: 'Senior Sales Manager'
            },
            date: new Date('2024-01-12'),
            startDate: new Date('2024-01-20'),
            endDate: new Date('2024-01-22'),
            days: 3,
            amount: 850.00,
            currency: 'USD',
            status: 'approved',
            priority: 'high',
            attachments: 1,
            comments: 2
        },
        {
            id: '5',
            type: 'overtime',
            title: 'Overtime Request',
            description: 'Weekend work for project deadline',
            requester: {
                id: '5',
                name: 'James Wilson',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
                department: 'Engineering',
                position: 'Junior Developer'
            },
            date: new Date('2024-01-11'),
            days: 2,
            amount: 400.00,
            currency: 'USD',
            status: 'pending',
            priority: 'low',
            comments: 1
        },
        {
            id: '6',
            type: 'remote',
            title: 'Remote Work Request',
            description: 'Working remotely from home for 2 weeks',
            requester: {
                id: '6',
                name: 'Lisa Thompson',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
                department: 'Marketing',
                position: 'Marketing Intern'
            },
            date: new Date('2024-01-10'),
            startDate: new Date('2024-01-25'),
            endDate: new Date('2024-02-05'),
            days: 10,
            status: 'pending',
            priority: 'medium',
            comments: 0
        },
        {
            id: '7',
            type: 'expense',
            title: 'Software Subscription',
            description: 'Adobe Creative Cloud Annual License',
            requester: {
                id: '7',
                name: 'Emily Rodriguez',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
                department: 'Design',
                position: 'UI/UX Lead'
            },
            amount: 599.99,
            currency: 'USD',
            date: new Date('2024-01-09'),
            status: 'rejected',
            priority: 'medium',
            attachments: 2,
            comments: 4
        }
    ])

    // Get request type icon and color
    const getRequestTypeInfo = (type: string) => {
        switch (type) {
            case 'leave':
                return {
                    icon: <Calendar className="w-5 h-5" />,
                    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    label: 'Leave'
                }
            case 'expense':
                return {
                    icon: <DollarSign className="w-5 h-5" />,
                    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    label: 'Expense'
                }
            case 'purchase':
                return {
                    icon: <CreditCard className="w-5 h-5" />,
                    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                    bg: 'bg-purple-50 dark:bg-purple-900/20',
                    label: 'Purchase'
                }
            case 'travel':
                return {
                    icon: <Plane className="w-5 h-5" />,
                    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                    bg: 'bg-amber-50 dark:bg-amber-900/20',
                    label: 'Travel'
                }
            case 'overtime':
                return {
                    icon: <Clock className="w-5 h-5" />,
                    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
                    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
                    label: 'Overtime'
                }
            case 'remote':
                return {
                    icon: <Home className="w-5 h-5" />,
                    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
                    bg: 'bg-pink-50 dark:bg-pink-900/20',
                    label: 'Remote Work'
                }
            default:
                return {
                    icon: <FileText className="w-5 h-5" />,
                    color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
                    bg: 'bg-gray-50 dark:bg-gray-900/20',
                    label: 'Other'
                }
        }
    }

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    icon: <Clock className="w-3 h-3" />,
                    label: 'Pending',
                    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }
            case 'approved':
                return {
                    icon: <CheckCircle className="w-3 h-3" />,
                    label: 'Approved',
                    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                }
            case 'rejected':
                return {
                    icon: <XCircle className="w-3 h-3" />,
                    label: 'Rejected',
                    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }
            case 'more_info':
                return {
                    icon: <AlertCircle className="w-3 h-3" />,
                    label: 'More Info',
                    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                }
            default:
                return {
                    icon: <Clock className="w-3 h-3" />,
                    label: 'Pending',
                    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                }
        }
    }

    // Get priority badge
    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return {
                    label: 'High',
                    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }
            case 'medium':
                return {
                    label: 'Medium',
                    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }
            case 'low':
                return {
                    label: 'Low',
                    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                }
            default:
                return {
                    label: 'Medium',
                    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                }
        }
    }

    // Handle approve
    const handleApprove = (id: string) => {
        setApprovals(approvals.map(a =>
            a.id === id ? { ...a, status: 'approved' } : a
        ))
        toast.success('Request approved successfully!', {
            icon: '✅',
            style: {
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#363636',
            }
        })
    }

    // Handle reject
    const handleReject = (id: string) => {
        setApprovals(approvals.map(a =>
            a.id === id ? { ...a, status: 'rejected' } : a
        ))
        toast.success('Request rejected', {
            icon: '❌',
            style: {
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#363636',
            }
        })
    }

    // Handle request more info
    const handleMoreInfo = (id: string) => {
        setApprovals(approvals.map(a =>
            a.id === id ? { ...a, status: 'more_info' } : a
        ))
        toast.success('Requested more information', {
            icon: '📋',
            style: {
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#363636',
            }
        })
    }

    // Filter approvals
    const filteredApprovals = approvals.filter(approval => {
        const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            approval.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            approval.requester.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = typeFilter === 'all' || approval.type === typeFilter
        const matchesStatus = statusFilter === 'all' || approval.status === statusFilter
        return matchesSearch && matchesType && matchesStatus
    })

    // Calculate stats
    const stats = {
        pending: approvals.filter(a => a.status === 'pending').length,
        approved: approvals.filter(a => a.status === 'approved').length,
        rejected: approvals.filter(a => a.status === 'rejected').length,
        moreInfo: approvals.filter(a => a.status === 'more_info').length,
        totalAmount: approvals
            .filter(a => a.amount && a.status === 'pending')
            .reduce((sum, a) => sum + (a.amount || 0), 0)
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                            <CheckCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Approvals
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Review and manage team requests
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Button
                        variant="secondary"
                        icon={<Download size={18} />}
                    >
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-xs">Pending</p>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                                <p className="text-yellow-100 text-xs mt-1">requests</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-100" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-xs">Approved</p>
                                <p className="text-2xl font-bold">{stats.approved}</p>
                                <p className="text-green-100 text-xs mt-1">requests</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-100" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500 to-rose-500 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-xs">Rejected</p>
                                <p className="text-2xl font-bold">{stats.rejected}</p>
                                <p className="text-red-100 text-xs mt-1">requests</p>
                            </div>
                            <XCircle className="w-8 h-8 text-red-100" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-xs">More Info</p>
                                <p className="text-2xl font-bold">{stats.moreInfo}</p>
                                <p className="text-blue-100 text-xs mt-1">requests</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-blue-100" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-xs">Amount</p>
                                <p className="text-xl font-bold">${stats.totalAmount.toLocaleString()}</p>
                                <p className="text-purple-100 text-xs mt-1">pending</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-purple-100" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center space-x-2">
                                <Filter className="text-gray-400" size={18} />
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="all">All Types</option>
                                    <option value="leave">Leave</option>
                                    <option value="expense">Expense</option>
                                    <option value="purchase">Purchase</option>
                                    <option value="travel">Travel</option>
                                    <option value="overtime">Overtime</option>
                                    <option value="remote">Remote Work</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="more_info">More Info</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Approvals List */}
            <div className="space-y-4">
                {filteredApprovals.map((approval) => {
                    const typeInfo = getRequestTypeInfo(approval.type)
                    const statusBadge = getStatusBadge(approval.status)
                    const priorityBadge = getPriorityBadge(approval.priority)

                    return (
                        <Card
                            key={approval.id}
                            className="hover:shadow-lg transition-all duration-300"
                        >
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    {/* Left Section - Type Icon & Details */}
                                    <div className="flex items-start space-x-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center",
                                            typeInfo.bg
                                        )}>
                                            {typeInfo.icon}
                                        </div>

                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {approval.title}
                                                </h3>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                                    statusBadge.className
                                                )}>
                                                    <span className="flex items-center space-x-1">
                                                        {statusBadge.icon}
                                                        <span>{statusBadge.label}</span>
                                                    </span>
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                {approval.description}
                                            </p>

                                            <div className="flex items-center space-x-4 text-sm">
                                                <div className="flex items-center text-gray-500 dark:text-gray-500">
                                                    <User className="w-4 h-4 mr-1" />
                                                    <span>{approval.requester.name}</span>
                                                </div>
                                                <div className="flex items-center text-gray-500 dark:text-gray-500">
                                                    <Briefcase className="w-4 h-4 mr-1" />
                                                    <span>{approval.requester.position}</span>
                                                </div>
                                                <div className="flex items-center text-gray-500 dark:text-gray-500">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    <span>{approval.date.toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section - Details & Actions */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        {/* Request Details */}
                                        <div className="flex flex-col items-end">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                                priorityBadge.className
                                            )}>
                                                {priorityBadge.label} Priority
                                            </span>

                                            {approval.days && (
                                                <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    <span>{approval.days} days</span>
                                                </div>
                                            )}

                                            {approval.amount && (
                                                <div className="flex items-center mt-1 text-lg font-bold text-gray-900 dark:text-white">
                                                    {approval.currency} {approval.amount.toLocaleString()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        {approval.status === 'pending' && (
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    icon={<CheckCircle size={16} />}
                                                    onClick={() => handleApprove(approval.id)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    icon={<XCircle size={16} />}
                                                    onClick={() => handleReject(approval.id)}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    icon={<AlertCircle size={16} />}
                                                    onClick={() => handleMoreInfo(approval.id)}
                                                >
                                                    More Info
                                                </Button>
                                            </div>
                                        )}

                                        {approval.status === 'more_info' && (
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                    icon={<Eye size={16} />}
                                                >
                                                    Review
                                                </Button>
                                            </div>
                                        )}

                                        {/* Meta Info */}
                                        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-500">
                                            {approval.attachments && (
                                                <span className="flex items-center">
                                                    <FileText className="w-3 h-3 mr-1" />
                                                    {approval.attachments}
                                                </span>
                                            )}
                                            {approval.comments && (
                                                <span className="flex items-center">
                                                    <MessageCircle className="w-3 h-3 mr-1" />
                                                    {approval.comments}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}

                {filteredApprovals.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <CheckCheck className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No approval requests found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                There are no {statusFilter !== 'all' ? statusFilter : ''} requests to display.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}