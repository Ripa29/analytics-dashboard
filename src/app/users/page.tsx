'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { Users, UserPlus, Filter, Download, Edit, Trash2, Shield, Briefcase, User, Search, X, Save, Mail, Phone, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { User as UserType, UserRole } from '@/types'

export default function UsersPage() {
    const { users, user: currentUser, addUser, updateUser, deleteUser, checkPermission } = useDashboardStore()
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'user' as UserRole,
        phone: '',
        department: '',
        password: 'default123'
    })

    const canCreate = checkPermission('users.create')
    const canEdit = checkPermission('users.edit')
    const canDelete = checkPermission('users.delete')

    const filteredUsers = users.filter((u: UserType) => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.department?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === 'all' || u.role === roleFilter
        return matchesSearch && matchesRole
    })

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <Shield className="w-4 h-4 text-blue-500" />
            case 'manager': return <Briefcase className="w-4 h-4 text-green-500" />
            default: return <User className="w-4 h-4 text-purple-500" />
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'manager': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            default: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
        }
    }

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email) {
            toast.error('Please fill in all required fields')
            return
        }

        if (!newUser.email.includes('@')) {
            toast.error('Please enter a valid email address')
            return
        }

        addUser({
            id: Date.now().toString(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone,
            department: newUser.department,
            createdAt: new Date(),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`,
            password: newUser.password
        })

        toast.success('User added successfully')
        setIsAdding(false)
        setNewUser({
            name: '',
            email: '',
            role: 'user',
            phone: '',
            department: '',
            password: 'default123'
        })
    }

    const handleUpdateUser = (id: string, updates: Partial<UserType>) => {
        updateUser(id, updates)
        toast.success('User updated successfully')
        setEditingId(null)
    }

    const handleDeleteUser = (id: string) => {
        if (id === currentUser?.id) {
            toast.error('You cannot delete your own account')
            return
        }

        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(id)
            toast.success('User deleted successfully')
        }
    }

    const handleExport = () => {
        const exportData = filteredUsers.map(({ password, ...rest }: any) => rest)
        const csv = convertToCSV(exportData)
        downloadFile(csv, `users-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
        toast.success('Users exported successfully')
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" icon={<Download size={18} />} onClick={handleExport}>
                        Export
                    </Button>
                    {canCreate && (
                        <Button icon={<UserPlus size={18} />} onClick={() => setIsAdding(true)}>
                            Add New User
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
                                    placeholder="Search users by name, email, or department..."
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
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add User Form */}
            {isAdding && (
                <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Add New User</span>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Role *
                                </label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="user">User</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        value={newUser.phone}
                                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="+1 (555) 123-4567"
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
                                        value={newUser.department}
                                        onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Engineering"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button icon={<Save size={18} />} onClick={handleAddUser}>
                                Save User
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>Users ({filteredUsers.length})</span>
                        </div>
                        <span className="text-sm font-normal text-gray-500">
                            Showing {filteredUsers.length} of {users.length} users
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">User</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Role</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Department</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Joined</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map((user: UserType) => (
                                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="py-4 px-4">
                                        {editingId === user.id ? (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={user.name}
                                                    onChange={(e) => handleUpdateUser(user.id, { name: e.target.value })}
                                                    className="px-2 py-1 border rounded w-full"
                                                    placeholder="Name"
                                                />
                                                <input
                                                    type="email"
                                                    value={user.email}
                                                    onChange={(e) => handleUpdateUser(user.id, { email: e.target.value })}
                                                    className="px-2 py-1 border rounded w-full"
                                                    placeholder="Email"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        user.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                                    {user.phone && (
                                                        <p className="text-xs text-gray-400 dark:text-gray-500">{user.phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        {editingId === user.id ? (
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleUpdateUser(user.id, { role: e.target.value as UserRole })}
                                                className="px-2 py-1 border rounded"
                                            >
                                                <option value="user">User</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                {getRoleIcon(user.role)}
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                                                        {user.role.toUpperCase()}
                                                    </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        {editingId === user.id ? (
                                            <input
                                                type="text"
                                                value={user.department || ''}
                                                onChange={(e) => handleUpdateUser(user.id, { department: e.target.value })}
                                                className="px-2 py-1 border rounded w-full"
                                                placeholder="Department"
                                            />
                                        ) : (
                                            <span className="text-gray-700 dark:text-gray-300">
                                                    {user.department || 'N/A'}
                                                </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center space-x-2">
                                            {canEdit && (
                                                editingId === user.id ? (
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
                                                        onClick={() => setEditingId(user.id)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )
                                            )}
                                            {canDelete && user.id !== currentUser?.id && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<Trash2 size={16} />}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No users found
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