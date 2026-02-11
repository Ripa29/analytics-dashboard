'use client'

import React, { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { Toaster } from 'react-hot-toast'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { Login } from '../components/auth/Login'
import { Register } from '../components/auth/Register'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const { darkMode, user } = useDashboardStore()
    const [mounted, setMounted] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    // Loading state
    if (!mounted) {
        return (
            <html lang="en">
            <body className={`${inter.className} bg-gray-50`}>
            <div className="h-screen flex items-center justify-center">
                <div className="text-xl font-bold gradient-text">Loading...</div>
            </div>
            </body>
            </html>
        )
    }

    // Not logged in - show login/register page
    if (!user) {
        return (
            <html lang="en" className={darkMode ? 'dark' : ''}>
            <body className={`${inter.className} min-h-screen flex flex-col`}>
            {/* Navigation Bar */}
            <nav className="border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold gradient-text">Analytics</span>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <button onClick={() => setShowRegister(false)}
                                className={`font-medium ${!showRegister ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'}`}>
                                Sign In
                            </button>
                            <button onClick={() => setShowRegister(true)}
                                className={`font-medium ${showRegister ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'}`}>
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                        {/* Left Side - Branding */}
                        <div className="lg:w-1/2">
                            <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl p-8 lg:p-12">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                    Welcome to <span className="gradient-text">Analytics</span>
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                    A powerful analytics dashboard with role-based access control, real-time insights, and comprehensive data management.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Role-based Access</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Admin, Manager, and User roles with different permissions</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Real-time Analytics</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Live charts, reports, and interactive dashboards</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                            </svg>
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
                                {showRegister ? <Register /> : <Login />}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
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
            </footer>

            <Toaster position="top-right" />
            </body>
            </html>
        )
    }

    // Logged in - show dashboard with header/sidebar
    return (
        <html lang="en" className={darkMode ? 'dark' : ''}>
        <body className={`${inter.className} ${darkMode ? 'dark:bg-gray-950' : 'bg-gray-50'}`}>
        <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
                <footer className="border-t border-gray-200 dark:border-gray-800 py-4 px-6">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <p>© 2026 Analytics Dashboard. All rights reserved.</p>
                        <p>v2.1.0 • Updated just now</p>
                    </div>
                </footer>
            </div>
        </div>
        <Toaster position="top-right" />
        </body>
        </html>
    )
}