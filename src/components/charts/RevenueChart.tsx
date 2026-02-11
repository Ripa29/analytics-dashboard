'use client'

import React, { memo } from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { TrendingUp } from 'lucide-react'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { RevenueData } from '@/types'

interface RevenueChartProps {
    data: RevenueData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-semibold">${entry.value.toLocaleString()}</span>
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export const RevenueChart: React.FC<RevenueChartProps> = memo(({ data }) => {
    const { darkMode } = useDashboardStore()

    return (
        <Card className="h-[400px] flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        <span>Revenue Over Time</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Target</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3"
                            stroke={darkMode ? '#374151' : '#e5e7eb'}
                            vertical={false}/>
                        <XAxis dataKey="month"
                            stroke={darkMode ? '#9ca3af' : '#6b7280'}
                            tickLine={false}
                            axisLine={false}/>
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value / 1000}k`}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#3B82F6' }}
                            name="Revenue"
                        />
                        <Line
                            type="monotone"
                            dataKey="target"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#8B5CF6' }}
                            name="Target"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
})

RevenueChart.displayName = 'RevenueChart'