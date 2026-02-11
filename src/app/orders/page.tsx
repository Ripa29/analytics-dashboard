'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useCRUDStore } from '@/lib/store/crudStore'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { ShoppingCart, Plus, Filter, Download, Edit, Trash2, CheckCircle, Clock, XCircle, Search, Save, X, Mail, User as UserIcon } from 'lucide-react'
import { Order } from '@/types'
import toast from 'react-hot-toast'

export default function OrdersPage() {
    const { orders, addOrder, updateOrder, deleteOrder } = useCRUDStore()
    const { checkPermission } = useDashboardStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [newOrder, setNewOrder] = useState({
        customer: '',
        email: '',
        amount: 0,
        status: 'pending' as const,
        items: 1
    })

    const canCreate = checkPermission('orders.create')
    const canEdit = checkPermission('orders.edit')
    const canDelete = checkPermission('orders.delete')

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.includes(searchTerm)
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'processing': return <Clock className="w-4 h-4 text-blue-500" />
            case 'pending': return <Clock className="w-4 h-4 text-amber-500" />
            case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />
            default: return <Clock className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    const handleAddOrder = () => {
        if (!newOrder.customer || !newOrder.email || newOrder.amount <= 0) {
            toast.error('Please fill in all required fields')
            return
        }

        if (!newOrder.email.includes('@')) {
            toast.error('Please enter a valid email address')
            return
        }

        addOrder({
            ...newOrder,
            date: new Date().toISOString().split('T')[0]
        })

        toast.success('Order created successfully')
        setIsAdding(false)
        setNewOrder({
            customer: '',
            email: '',
            amount: 0,
            status: 'pending',
            items: 1
        })
    }

    const handleUpdateStatus = (id: string, newStatus: Order['status']) => {
        updateOrder(id, { status: newStatus })
        toast.success(`Order status updated to ${newStatus}`)
    }

    const handleDeleteOrder = (id: string) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            deleteOrder(id)
            toast.success('Order deleted successfully')
        }
    }

    const handleExport = () => {
        const exportData = filteredOrders.map(order => ({
            'Order ID': order.id,
            'Customer': order.customer,
            'Email': order.email,
            'Amount': `$${order.amount}`,
            'Status': order.status,
            'Date': order.date,
            'Items': order.items
        }))

        const csv = convertToCSV(exportData)
        downloadFile(csv, `orders-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
        toast.success('Orders exported successfully')
    }

    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.amount, 0)

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage customer orders and track status</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" icon={<Download size={18} />} onClick={handleExport}>
                        Export
                    </Button>
                    {canCreate && (
                        <Button icon={<Plus size={18} />} onClick={() => setIsAdding(true)}>
                            Create Order
                        </Button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search orders by ID, customer, or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center space-x-2">
                                <Filter className="text-gray-400" size={18} />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add Order Form */}
            {isAdding && (
                <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Create New Order</span>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Customer Name *
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={newOrder.customer}
                                        onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={newOrder.email}
                                        onChange={(e) => setNewOrder({...newOrder, email: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Amount *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        value={newOrder.amount || ''}
                                        onChange={(e) => setNewOrder({...newOrder, amount: parseFloat(e.target.value) || 0})}
                                        className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Items
                                </label>
                                <input
                                    type="number"
                                    value={newOrder.items}
                                    onChange={(e) => setNewOrder({...newOrder, items: parseInt(e.target.value) || 1})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="1"
                                    min="1"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button icon={<Save size={18} />} onClick={handleAddOrder}>
                                Save Order
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ShoppingCart className="w-5 h-5" />
                            <span>Orders ({filteredOrders.length})</span>
                        </div>
                        <div className="text-sm font-normal text-gray-500">
                            Total: <span className="font-bold text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Order ID</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Items</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="py-4 px-4 font-mono text-sm text-gray-700 dark:text-gray-300">
                                        #{order.id}
                                    </td>
                                    <td className="py-4 px-4">
                                        {editingId === order.id ? (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={order.customer}
                                                    onChange={(e) => updateOrder(order.id, { customer: e.target.value })}
                                                    className="px-2 py-1 border rounded w-full"
                                                    placeholder="Customer"
                                                />
                                                <input
                                                    type="email"
                                                    value={order.email}
                                                    onChange={(e) => updateOrder(order.id, { email: e.target.value })}
                                                    className="px-2 py-1 border rounded w-full"
                                                    placeholder="Email"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{order.customer}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{order.email}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        {editingId === order.id ? (
                                            <input
                                                type="number"
                                                value={order.amount}
                                                onChange={(e) => updateOrder(order.id, { amount: parseFloat(e.target.value) })}
                                                className="px-2 py-1 border rounded w-24"
                                                step="0.01"
                                                min="0"
                                            />
                                        ) : (
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                ${order.amount.toFixed(2)}
                                            </p>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(order.status)}
                                                {editingId === order.id ? (
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrder(order.id, { status: e.target.value as Order['status'] })}
                                                        className="px-2 py-1 border rounded text-sm"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                ) : (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                )}
                                            </div>
                                            {canEdit && !editingId && order.status !== 'completed' && order.status !== 'cancelled' && (
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'processing')}
                                                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 transition-colors"
                                                    >
                                                        Process
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                                                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 transition-colors"
                                                    >
                                                        Complete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                                        {new Date(order.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="py-4 px-4">
                                        {editingId === order.id ? (
                                            <input
                                                type="number"
                                                value={order.items}
                                                onChange={(e) => updateOrder(order.id, { items: parseInt(e.target.value) })}
                                                className="px-2 py-1 border rounded w-16"
                                                min="1"
                                            />
                                        ) : (
                                            <span className="font-medium">{order.items}</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center space-x-2">
                                            {canEdit && (
                                                editingId === order.id ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            icon={<Save size={16} />}
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<X size={16} />}
                                                            onClick={() => setEditingId(null)}
                                                        />
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={<Edit size={16} />}
                                                        onClick={() => setEditingId(order.id)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )
                                            )}
                                            {canDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<Trash2 size={16} />}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
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