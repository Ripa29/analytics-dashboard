'use client'

import React from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            {/* Top Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics
              </span>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                                Sign In
                            </Link>
                            <Link href="/register"
                                className="text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                        {/* Left Side - Branding */}
                        <div className="lg:w-1/2">
                            <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl p-8 lg:p-12">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                    Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AnalyticsPro</span>
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                    A powerful analytics dashboard for managing your business data with role-based access control and real-time insights.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Role-based Access</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Admin, Manager, and User roles with different permissions</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Real-time Analytics</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Live charts and reports with interactive dashboards</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">CRUD Operations</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Full create, read, update, delete functionality</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Auth Form */}
                        <div className="lg:w-1/2 w-full">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-800 py-6">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © 2026 Analytics Dashboard. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Privacy Policy</a>
                            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Terms of Service</a>
                            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Help Center</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}