'use client'

import React from 'react'
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, ShoppingBag, Percent } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/Card'
import { cn } from '@/lib/utils'
import { useDashboardStore } from '@/lib/store/dashboardStore'

interface KPICardProps {
    title: string
    value: string | number
    change: number
    icon: 'revenue' | 'users' | 'orders' | 'conversion'
    trend: 'up' | 'down'
}

const iconMap = {
    revenue: TrendingUp,
    users: Users,
    orders: ShoppingBag,
    conversion: Percent
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, trend }) => {
    const { darkMode } = useDashboardStore()
    const Icon = iconMap[icon]

    return (
        <Card hover className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className={cn(
                "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl transition-opacity duration-300",
                trend === 'up'
                    ? 'bg-green-500/20 group-hover:opacity-100 opacity-0'
                    : 'bg-red-500/20 group-hover:opacity-100 opacity-0'
            )} />

            <CardContent className="relative">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                            {title}
                        </p>
                        <div className="flex items-baseline space-x-2">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {typeof value === 'number' && title.includes('Revenue') ? `$${value.toLocaleString()}` : value}
                            </p>
                            <div className={cn(
                                'flex items-center text-sm font-medium px-2 py-1 rounded-full',
                                trend === 'up'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            )}>
                                {trend === 'up' ? (
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                ) : (
                                    <ArrowDownRight className="w-3 h-3 mr-1" />
                                )}
                                {Math.abs(change)}%
                            </div>
                        </div>
                    </div>
                    <div className={cn(
                        'p-3 rounded-xl',
                        icon === 'revenue' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                        icon === 'users' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                        icon === 'orders' && 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                        icon === 'conversion' && 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{change > 0 ? '+' : ''}{change}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all duration-1000',
                                trend === 'up'
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                    : 'bg-gradient-to-r from-red-400 to-rose-500'
                            )}
                            style={{ width: `${Math.min(Math.abs(change) * 5, 100)}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}