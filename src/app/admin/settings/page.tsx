'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Settings, Globe, Database, Lock, Mail, Server, Cloud,
    Clock, Save, RefreshCw, AlertTriangle, Download, Cpu, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card'
import { Button } from '@/src/components/ui/Button'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
    const { user, darkMode } = useDashboardStore()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('general')
    const [isLoading, setIsLoading] = useState(false)
    const [showApiKey, setShowApiKey] = useState(false)
    const [showDbPassword, setShowDbPassword] = useState(false)
    const [showSmtpPassword, setShowSmtpPassword] = useState(false)

    // Check if user is admin
    if (!user || user.role !== 'admin') {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Access Denied
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            You don't have permission to access Admin Settings.
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

    // System Settings State
    const [systemSettings, setSystemSettings] = useState({
        siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Analytics',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://analytics.com',
        supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@analytics.com',
        timezone: process.env.NEXT_PUBLIC_TIMEZONE || 'UTC+6',
        dateFormat: process.env.NEXT_PUBLIC_DATE_FORMAT || 'MM/DD/YYYY',
        timeFormat: process.env.NEXT_PUBLIC_TIME_FORMAT || '12h',
        maintenanceMode: false,
        debugMode: process.env.NODE_ENV === 'development',
        enableRegistration: true,
        defaultUserRole: 'user',
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordExpiry: 90
    })

    // Email Settings State
    const [emailSettings, setEmailSettings] = useState({
        smtpHost: process.env.NEXT_PUBLIC_SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT || '587'),
        smtpSecure: true,
        smtpUsername: process.env.NEXT_PUBLIC_SMTP_USERNAME || '',
        smtpPassword: '', // Never store passwords in state
        fromEmail: process.env.NEXT_PUBLIC_FROM_EMAIL || 'noreply@analytics.com',
        fromName: process.env.NEXT_PUBLIC_FROM_NAME || 'AnalyticsPro',
        enableEmailNotifications: true,
        emailFooter: process.env.NEXT_PUBLIC_EMAIL_FOOTER || '© 2026 Analytics. All rights reserved.'
    })

    // Security Settings State - NO HARDCODED SECRETS
    const [securitySettings, setSecuritySettings] = useState({
        passwordMinLength: parseInt(process.env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH || '8'),
        passwordRequireUppercase: true,
        passwordRequireLowercase: true,
        passwordRequireNumbers: true,
        passwordRequireSpecial: true,
        sessionTimeout: parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '30'),
        maxLoginAttempts: parseInt(process.env.NEXT_PUBLIC_MAX_LOGIN_ATTEMPTS || '5'),
        lockoutDuration: parseInt(process.env.NEXT_PUBLIC_LOCKOUT_DURATION || '15'),
        ipWhitelist: process.env.NEXT_PUBLIC_IP_WHITELIST?.split(',') || ['192.168.1.1', '10.0.0.1'],
        enableCaptcha: false, // Disabled by default, enable via env
        recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '', // From env only
        recaptchaSecretKey: '', // Never store in frontend
        enableTwoFactorAuth: false // Renamed from twoFactorAuth to fix TypeScript error
    })

    // Database Settings State
    const [databaseSettings, setDatabaseSettings] = useState({
        dbHost: process.env.NEXT_PUBLIC_DB_HOST || 'localhost',
        dbPort: parseInt(process.env.NEXT_PUBLIC_DB_PORT || '5432'),
        dbName: process.env.NEXT_PUBLIC_DB_NAME || 'analytics',
        dbUsername: process.env.NEXT_PUBLIC_DB_USERNAME || 'admin',
        dbPassword: '', // Never store passwords in state
        dbPrefix: process.env.NEXT_PUBLIC_DB_PREFIX || 'ap_',
        dbCharset: process.env.NEXT_PUBLIC_DB_CHARSET || 'utf8mb4',
        dbCollation: process.env.NEXT_PUBLIC_DB_COLLATION || 'utf8mb4_unicode_ci',
        backupFrequency: process.env.NEXT_PUBLIC_BACKUP_FREQUENCY || 'daily',
        backupRetention: parseInt(process.env.NEXT_PUBLIC_BACKUP_RETENTION || '30'),
        backupTime: process.env.NEXT_PUBLIC_BACKUP_TIME || '02:00',
        enableSsl: true
    })

    // API Settings State
    const [apiSettings, setApiSettings] = useState({
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.analytics.com/v1',
        apiKey: process.env.NEXT_PUBLIC_API_KEY || '', // From env only
        apiSecret: '', // Never store in frontend
        rateLimit: parseInt(process.env.NEXT_PUBLIC_API_RATE_LIMIT || '1000'),
        rateLimitWindow: parseInt(process.env.NEXT_PUBLIC_API_RATE_LIMIT_WINDOW || '60'),
        enableCors: true,
        allowedOrigins: process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',') || ['https://analytics.com', 'https://app.analytics.com'],
        enableLogging: true,
        logRetention: parseInt(process.env.NEXT_PUBLIC_API_LOG_RETENTION || '30')
    })

    // Handle Save Settings
    const handleSaveSettings = (section: string) => {
        setIsLoading(true)

        // Validate required fields
        if (section === 'email' && !emailSettings.smtpUsername) {
            toast.error('SMTP username is required')
            setIsLoading(false)
            return
        }

        if (section === 'database' && !databaseSettings.dbName) {
            toast.error('Database name is required')
            setIsLoading(false)
            return
        }

        setTimeout(() => {
            setIsLoading(false)
            toast.success(`${section} settings saved successfully!`, {
                icon: '✅',
                style: {
                    background: darkMode ? '#1F2937' : '#fff',
                    color: darkMode ? '#fff' : '#363636',
                }
            })

            // In production, this would make an API call to save settings
            console.log(`Saving ${section} settings:`, {
                system: section === 'general' ? systemSettings : undefined,
                security: section === 'security' ? { ...securitySettings, recaptchaSecretKey: '[REDACTED]' } : undefined,
                email: section === 'email' ? { ...emailSettings, smtpPassword: '[REDACTED]' } : undefined,
                database: section === 'database' ? { ...databaseSettings, dbPassword: '[REDACTED]' } : undefined,
                api: section === 'api' ? { ...apiSettings, apiSecret: '[REDACTED]' } : undefined
            })
        }, 1000)
    }

    // Handle Backup
    const handleBackup = () => {
        toast.loading('Creating database backup...', {
            style: {
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#363636',
            }
        })
        setTimeout(() => {
            toast.dismiss()
            toast.success('Database backup completed successfully!', {
                icon: '💾',
                style: {
                    background: darkMode ? '#1F2937' : '#fff',
                    color: darkMode ? '#fff' : '#363636',
                }
            })
        }, 2000)
    }

    // Handle Clear Cache
    const handleClearCache = () => {
        toast.loading('Clearing system cache...', {
            style: {
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#363636',
            }
        })
        setTimeout(() => {
            toast.dismiss()
            toast.success('System cache cleared successfully!', {
                icon: '🧹',
                style: {
                    background: darkMode ? '#1F2937' : '#fff',
                    color: darkMode ? '#fff' : '#363636',
                }
            })
        }, 1500)
    }

    // Handle Test Connection
    const handleTestConnection = (type: string) => {
        toast.loading(`Testing ${type} connection...`, {
            style: {
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#363636',
            }
        })
        setTimeout(() => {
            toast.dismiss()
            toast.success(`${type} connection successful!`, {
                icon: '🔌',
                style: {
                    background: darkMode ? '#1F2937' : '#fff',
                    color: darkMode ? '#fff' : '#363636',
                }
            })
        }, 1500)
    }

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'database', label: 'Database', icon: Database },
        { id: 'api', label: 'API', icon: Cloud },
        { id: 'system', label: 'System', icon: Server },
    ]

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Admin Settings
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Configure and manage your application settings
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Button
                        variant="secondary"
                        icon={<RefreshCw size={18} />}
                        onClick={handleClearCache}
                    >
                        Clear Cache
                    </Button>
                    <Button
                        icon={<Save size={18} />}
                        onClick={() => handleSaveSettings('All')}
                        isLoading={isLoading}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Settings Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
                <div className="flex overflow-x-auto space-x-6 pb-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                )}
                            >
                                <Icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {/* General Settings */}
                {activeTab === 'general' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Settings className="w-5 h-5" />
                                <span>General Settings</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Site Name
                                        </label>
                                        <input
                                            type="text"
                                            value={systemSettings.siteName}
                                            onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Your site name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Site URL
                                        </label>
                                        <input
                                            type="url"
                                            value={systemSettings.siteUrl}
                                            onChange={(e) => setSystemSettings({...systemSettings, siteUrl: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Support Email
                                        </label>
                                        <input
                                            type="email"
                                            value={systemSettings.supportEmail}
                                            onChange={(e) => setSystemSettings({...systemSettings, supportEmail: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="support@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Timezone
                                        </label>
                                        <select
                                            value={systemSettings.timezone}
                                            onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option>UTC-12</option>
                                            <option>UTC-11</option>
                                            <option>UTC-10</option>
                                            <option>UTC-9</option>
                                            <option>UTC-8</option>
                                            <option>UTC-7</option>
                                            <option>UTC-6</option>
                                            <option>UTC-5</option>
                                            <option>UTC-4</option>
                                            <option>UTC-3</option>
                                            <option>UTC-2</option>
                                            <option>UTC-1</option>
                                            <option>UTC+0</option>
                                            <option>UTC+1</option>
                                            <option>UTC+2</option>
                                            <option>UTC+3</option>
                                            <option>UTC+4</option>
                                            <option>UTC+5</option>
                                            <option>UTC+6</option>
                                            <option>UTC+7</option>
                                            <option>UTC+8</option>
                                            <option>UTC+9</option>
                                            <option>UTC+10</option>
                                            <option>UTC+11</option>
                                            <option>UTC+12</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Date Format
                                        </label>
                                        <select
                                            value={systemSettings.dateFormat}
                                            onChange={(e) => setSystemSettings({...systemSettings, dateFormat: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option>MM/DD/YYYY</option>
                                            <option>DD/MM/YYYY</option>
                                            <option>YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Time Format
                                        </label>
                                        <select
                                            value={systemSettings.timeFormat}
                                            onChange={(e) => setSystemSettings({...systemSettings, timeFormat: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option>12h</option>
                                            <option>24h</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Maintenance Mode</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Enable maintenance mode to prevent user access
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={systemSettings.maintenanceMode}
                                                onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Debug Mode</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Enable debug mode for development
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={systemSettings.debugMode}
                                                onChange={(e) => setSystemSettings({...systemSettings, debugMode: e.target.checked})}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">User Registration</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Allow new users to register
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={systemSettings.enableRegistration}
                                                onChange={(e) => setSystemSettings({...systemSettings, enableRegistration: e.target.checked})}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button
                                        onClick={() => handleSaveSettings('General')}
                                        isLoading={isLoading}
                                    >
                                        Save General Settings
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Lock className="w-5 h-5" />
                                <span>Security Settings</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Password Minimum Length
                                        </label>
                                        <input
                                            type="number"
                                            min="6"
                                            max="32"
                                            value={securitySettings.passwordMinLength}
                                            onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Session Timeout (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            min="5"
                                            max="1440"
                                            value={securitySettings.sessionTimeout}
                                            onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Max Login Attempts
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={securitySettings.maxLoginAttempts}
                                            onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Lockout Duration (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="120"
                                            value={securitySettings.lockoutDuration}
                                            onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="font-medium text-gray-900 dark:text-white">Password Requirements</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Require Uppercase</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={securitySettings.passwordRequireUppercase}
                                                    onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireUppercase: e.target.checked})}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Require Lowercase</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={securitySettings.passwordRequireLowercase}
                                                    onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireLowercase: e.target.checked})}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Require Numbers</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={securitySettings.passwordRequireNumbers}
                                                    onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireNumbers: e.target.checked})}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Require Special Characters</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={securitySettings.passwordRequireSpecial}
                                                    onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireSpecial: e.target.checked})}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Require 2FA for admin accounts
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={securitySettings.enableTwoFactorAuth}
                                                onChange={(e) => setSecuritySettings({...securitySettings, enableTwoFactorAuth: e.target.checked})}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">reCAPTCHA</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Enable Google reCAPTCHA for forms
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={securitySettings.enableCaptcha}
                                                onChange={(e) => setSecuritySettings({...securitySettings, enableCaptcha: e.target.checked})}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {securitySettings.enableCaptcha && (
                                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                            <div className="flex items-start space-x-3">
                                                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                                                        reCAPTCHA Configuration Required
                                                    </p>
                                                    <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                                                        Add your reCAPTCHA site key to <code className="px-1 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 rounded">.env.local</code>:
                                                    </p>
                                                    <pre className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded text-xs overflow-x-auto">
                                                        NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button
                                        onClick={() => handleSaveSettings('Security')}
                                        isLoading={isLoading}
                                    >
                                        Save Security Settings
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Email Settings */}
                {activeTab === 'email' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-5 h-5" />
                                    <span>Email Settings</span>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleTestConnection('SMTP')}
                                >
                                    Test Connection
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            SMTP Host
                                        </label>
                                        <input
                                            type="text"
                                            value={emailSettings.smtpHost}
                                            onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="smtp.gmail.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            SMTP Port
                                        </label>
                                        <input
                                            type="number"
                                            value={emailSettings.smtpPort}
                                            onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="587"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            SMTP Username
                                        </label>
                                        <input
                                            type="text"
                                            value={emailSettings.smtpUsername}
                                            onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="noreply@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            SMTP Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showSmtpPassword ? 'text' : 'password'}
                                                value={emailSettings.smtpPassword}
                                                onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter SMTP password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showSmtpPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            From Email
                                        </label>
                                        <input
                                            type="email"
                                            value={emailSettings.fromEmail}
                                            onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="noreply@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            From Name
                                        </label>
                                        <input
                                            type="text"
                                            value={emailSettings.fromName}
                                            onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="AnalyticsPro"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Enable system email notifications
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={emailSettings.enableEmailNotifications}
                                            onChange={(e) => setEmailSettings({...emailSettings, enableEmailNotifications: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button
                                        onClick={() => handleSaveSettings('Email')}
                                        isLoading={isLoading}
                                    >
                                        Save Email Settings
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Database Settings */}
                {activeTab === 'database' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Database className="w-5 h-5" />
                                    <span>Database Settings</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleTestConnection('Database')}
                                    >
                                        Test Connection
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        icon={<Download size={16} />}
                                        onClick={handleBackup}
                                    >
                                        Backup Now
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Database Host
                                        </label>
                                        <input
                                            type="text"
                                            value={databaseSettings.dbHost}
                                            onChange={(e) => setDatabaseSettings({...databaseSettings, dbHost: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="localhost"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Database Port
                                        </label>
                                        <input
                                            type="number"
                                            value={databaseSettings.dbPort}
                                            onChange={(e) => setDatabaseSettings({...databaseSettings, dbPort: parseInt(e.target.value)})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="5432"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Database Name
                                        </label>
                                        <input
                                            type="text"
                                            value={databaseSettings.dbName}
                                            onChange={(e) => setDatabaseSettings({...databaseSettings, dbName: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="analytics"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Database Username
                                        </label>
                                        <input
                                            type="text"
                                            value={databaseSettings.dbUsername}
                                            onChange={(e) => setDatabaseSettings({...databaseSettings, dbUsername: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="admin"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Database Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showDbPassword ? 'text' : 'password'}
                                                value={databaseSettings.dbPassword}
                                                onChange={(e) => setDatabaseSettings({...databaseSettings, dbPassword: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter database password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowDbPassword(!showDbPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showDbPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Table Prefix
                                        </label>
                                        <input
                                            type="text"
                                            value={databaseSettings.dbPrefix}
                                            onChange={(e) => setDatabaseSettings({...databaseSettings, dbPrefix: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="ap_"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="font-medium text-gray-900 dark:text-white">Backup Settings</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Backup Frequency
                                            </label>
                                            <select
                                                value={databaseSettings.backupFrequency}
                                                onChange={(e) => setDatabaseSettings({...databaseSettings, backupFrequency: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="hourly">Hourly</option>
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Backup Retention (days)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="365"
                                                value={databaseSettings.backupRetention}
                                                onChange={(e) => setDatabaseSettings({...databaseSettings, backupRetention: parseInt(e.target.value)})}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Backup Time
                                            </label>
                                            <input
                                                type="time"
                                                value={databaseSettings.backupTime}
                                                onChange={(e) => setDatabaseSettings({...databaseSettings, backupTime: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button
                                        onClick={() => handleSaveSettings('Database')}
                                        isLoading={isLoading}
                                    >
                                        Save Database Settings
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* API Settings */}
                {activeTab === 'api' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Cloud className="w-5 h-5" />
                                    <span>API Settings</span>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleTestConnection('API')}
                                >
                                    Test Connection
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            API URL
                                        </label>
                                        <input
                                            type="url"
                                            value={apiSettings.apiUrl}
                                            onChange={(e) => setApiSettings({...apiSettings, apiUrl: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://api.example.com/v1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            API Key
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showApiKey ? 'text' : 'password'}
                                                value={apiSettings.apiKey}
                                                onChange={(e) => setApiSettings({...apiSettings, apiKey: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter API key"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowApiKey(!showApiKey)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Store API key in <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">.env.local</code>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Rate Limit (requests)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10000"
                                            value={apiSettings.rateLimit}
                                            onChange={(e) => setApiSettings({...apiSettings, rateLimit: parseInt(e.target.value)})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Rate Limit Window (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="3600"
                                            value={apiSettings.rateLimitWindow}
                                            onChange={(e) => setApiSettings({...apiSettings, rateLimitWindow: parseInt(e.target.value)})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Enable CORS</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Allow cross-origin requests
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={apiSettings.enableCors}
                                                onChange={(e) => setApiSettings({...apiSettings, enableCors: e.target.checked})}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">API Logging</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Log all API requests
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={apiSettings.enableLogging}
                                                onChange={(e) => setApiSettings({...apiSettings, enableLogging: e.target.checked})}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button
                                        onClick={() => handleSaveSettings('API')}
                                        isLoading={isLoading}
                                    >
                                        Save API Settings
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* System Information */}
                {activeTab === 'system' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Server className="w-5 h-5" />
                                    <span>System Information</span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Cpu className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Node.js Version</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {process.version || 'v20.10.0'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Database className="w-5 h-5 text-green-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Next.js Version</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {process.env.NEXT_PUBLIC_NEXTJS_VERSION || '14.0.4'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Globe className="w-5 h-5 text-purple-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Environment</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Clock className="w-5 h-5 text-amber-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Server Time</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {new Date().toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">System Health</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">All systems are operational</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-sm font-medium text-green-600">Healthy</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        <span className="font-medium">Note:</span> Sensitive information like API keys, passwords, and secrets should be stored in environment variables, not in the codebase.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}