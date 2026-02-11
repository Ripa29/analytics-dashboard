'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Activity, CheckCircle, AlertCircle, Clock, ShoppingBag, UserPlus } from 'lucide-react'
import { staticData } from '@/lib/data'
import { format } from 'date-fns'

export const RecentActivity: React.FC = () => {
    const [logs, setLogs] = useState(staticData.logs)

    useEffect(() => {
        //  logs every 30 seconds
        const interval = setInterval(() => {
            setLogs(prevLogs => {
                // Add some variation to simulate real-time updates
                const updatedLogs = [...prevLogs]
                if (updatedLogs.length > 0) {
                    const lastLog = { ...updatedLogs[updatedLogs.length - 1] }
                    lastLog.id = lastLog.id + 1
                    lastLog.timestamp = new Date().toISOString()
                    updatedLogs.push(lastLog)
                    if (updatedLogs.length > 5) {
                        updatedLogs.shift()
                    }
                }
                return updatedLogs
            })
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const getActionIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case 'login':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'purchase':
                return <ShoppingBag className="w-4 h-4 text-blue-500" />
            case 'settings update':
                return <AlertCircle className="w-4 h-4 text-amber-500" />
            case 'report generated':
                return <Activity className="w-4 h-4 text-purple-500" />
            case 'profile updated':
                return <UserPlus className="w-4 h-4 text-cyan-500" />
            default:
                return <Activity className="w-4 h-4 text-gray-500" />
        }
    }

    const formatTime = (timestamp: string) => {
        try {
            const date = new Date(timestamp)
            const now = new Date()
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

            if (diffInMinutes < 1) return 'Just now'
            if (diffInMinutes < 60) return `${diffInMinutes} min ago`
            if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
            return format(date, 'MMM d, h:mm a')
        } catch {
            return format(new Date(), 'MMM d, h:mm a')
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Recent Activity</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700">
                                    {getActionIcon(log.action)}
                                </div>
                                <div>
                                    <p className="font-medium">{log.user}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{log.action}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(log.timestamp)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}