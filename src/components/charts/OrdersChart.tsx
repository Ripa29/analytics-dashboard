'use client'

import React, { memo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { ShoppingBag } from 'lucide-react'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { OrderData } from '@/types'

interface OrdersChartProps {
    data: OrderData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-blue-500">
                    Orders: <span className="font-semibold">{payload[0].value}</span>
                </p>
                <p className="text-sm text-gray-500">
                    Previous Year: <span className="font-semibold">{payload[1].value}</span>
                </p>
            </div>
        )
    }
    return null
}

export const OrdersChart: React.FC<OrdersChartProps> = memo(({ data }) => {
    const { darkMode } = useDashboardStore()

    const getBarColor = (value: number) => {
        if (value >= 80) return '#10B981'
        if (value >= 60) return '#3B82F6'
        if (value >= 40) return '#8B5CF6'
        return '#F59E0B'
    }

    return (
        <Card className="h-[400px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-green-500" />
                    <span>Orders Per Month</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3"
                            stroke={darkMode ? '#374151' : '#e5e7eb'}
                            vertical={false}/>
                        <XAxis dataKey="month"
                            stroke={darkMode ? '#9ca3af' : '#6b7280'}
                            tickLine={false}
                            axisLine={false}/>
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'}
                            tickLine={false}
                            axisLine={false}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="orders" name="Current Year"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.orders)} />
                            ))}
                        </Bar>
                        <Bar dataKey="previousYear" name="Previous Year" fill={darkMode ? '#4B5563' : '#D1D5DB'}
                            radius={[4, 4, 0, 0]} opacity={0.6}/>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
})

OrdersChart.displayName = 'OrdersChart'