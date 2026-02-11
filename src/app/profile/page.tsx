'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { User, Mail, Phone, Briefcase, Calendar, Shield, BarChart3, Edit } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import {Button} from "@/src/components/ui/Button";

export default function ProfilePage() {
    const { user } = useDashboardStore()

    if (!user) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Please Sign In</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            You need to be logged in to view your profile.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const getRolePermissions = () => {
        switch (user.role) {
            case 'admin':
                return [
                    'Full system access',
                    'User management (CRUD)',
                    'System settings configuration',
                    'Analytics and reports',
                    'Database management'
                ]
            case 'manager':
                return [
                    'Team management',
                    'Order and product management',
                    'Analytics viewing',
                    'Report generation',
                    'Limited user management'
                ]
            case 'user':
                return [
                    'Dashboard viewing',
                    'Personal order management',
                    'Profile editing',
                    'Basic analytics access'
                ]
            default:
                return []
        }
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                    <p className="text-gray-600 dark:text-gray-400">Your personal information and role details</p>
                </div>
                <Link href="/account">
                    <Button variant="secondary" icon={<Edit size={18} />}>
                        Edit Profile
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Card */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {/* Avatar Section */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className={`absolute -top-1 -right-1 px-3 py-1 rounded-full text-xs font-bold text-white ${
                                        user.role === 'admin' ? 'bg-blue-600' :
                                            user.role === 'manager' ? 'bg-green-600' :
                                                'bg-purple-600'
                                    }`}>
                                        {user.role.toUpperCase()}
                                    </div>
                                </div>

                                {/* Profile Information */}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {user.name}
                                    </h2>

                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                                            <Mail className="w-4 h-4 mr-2" />
                                            <span>{user.email}</span>
                                        </div>

                                        {user.phone && (
                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                <Phone className="w-4 h-4 mr-2" />
                                                <span>{user.phone}</span>
                                            </div>
                                        )}

                                        {user.department && (
                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                <Briefcase className="w-4 h-4 mr-2" />
                                                <span>{user.department}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>
                                                Member since {format(new Date(user.createdAt), 'MMMM yyyy')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Stats */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Role Overview
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <Shield className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                        <p className="font-bold text-gray-900 dark:text-white">{user.role}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                                    </div>
                                    <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {user.role === 'admin' ? 'Full' : user.role === 'manager' ? 'Limited' : 'Basic'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Access Level</p>
                                    </div>
                                    <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Joined Date</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Role Permissions */}
                <div>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Shield className="w-5 h-5" />
                                <span>Role Permissions</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        As a <span className="font-semibold capitalize">{user.role}</span>, you have access to:
                                    </p>
                                    <div className="space-y-2">
                                        {getRolePermissions().map((permission, index) => (
                                            <div key={index} className="flex items-start">
                                                <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                                                    user.role === 'admin' ? 'bg-blue-500' :
                                                        user.role === 'manager' ? 'bg-green-500' :
                                                            'bg-purple-500'
                                                }`} />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{permission}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Need More Access?</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Contact your administrator to request additional permissions or role upgrades.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}