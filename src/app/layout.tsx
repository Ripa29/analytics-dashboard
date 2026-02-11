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
import { cn } from '@/lib/utils'
import { Shield, Briefcase, User, Sun, Moon } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const { darkMode, toggleDarkMode, user } = useDashboardStore()
    const [mounted, setMounted] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

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
            <body className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950`}>
            {/* Navigation Bar */}
            <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">

                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Analytics
                                    </span>
                        </Link>

                        <div className="flex items-center space-x-3">
                            {/* Dark/Light Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    darkMode
                                        ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                                aria-label="Toggle theme"
                            >
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {/* Sign In/Register Toggle */}
                            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                <button
                                    onClick={() => setShowRegister(false)}
                                    className={cn(
                                        "px-4 py-2 rounded-md font-medium transition-all duration-200",
                                        !showRegister
                                            ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    )}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => setShowRegister(true)}
                                    className={cn(
                                        "px-4 py-2 rounded-md font-medium transition-all duration-200",
                                        showRegister
                                            ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    )}
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center  gap-8 lg:gap-12">
                        {/* Left Side - Branding */}
                        <div className="lg:w-1/2 space-y-6">
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-3xl p-8 lg:p-12 backdrop-blur-sm">
                                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                    Welcome to{' '}
                                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                Analytics
                                            </span>
                                </h1>
                                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8">
                                    Choose your role and get instant access to your personalized dashboard.
                                </p>

                                {/* Role Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Admin Card */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                                            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Admin</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Full system access
                                        </p>
                                    </div>

                                    {/* Manager Card */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                                            <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Manager</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Team & operations
                                        </p>
                                    </div>

                                    {/* User Card */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                                            <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">User</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Personal dashboard
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">User Roles</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">24/7</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Support</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Auth Form */}
                        <div className="lg:w-1/2 w-full">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800">
                                {showRegister ? <Register /> : <Login />}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-800 py-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © 2026 Analytics. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600">Privacy</a>
                            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600">Terms</a>
                            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#363636',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
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
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
                    {children}
                </main>
            </div>
        </div>
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#fff',
                    color: '#363636',
                },
            }}
        />
        </body>
        </html>
    )
}