'use client'

import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { UserDistribution } from '@/types'

interface UsersChartProps {
    data: UserDistribution[]
}

const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-sm font-bold drop-shadow-lg"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {payload[0].name}: {payload[0].value} users
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
                </p>
            </div>
        )
    }
    return null
}

export const UsersChart: React.FC<UsersChartProps> = ({ data }) => {
    const totalUsers = data.reduce((sum, item) => sum + item.value, 0)

    // Add total to each data item for tooltip
    const chartData = data.map(item => ({
        ...item,
        total: totalUsers
    }))

    return (
        <Card className="h-[400px] flex flex-col">
            <CardHeader className="pb-2">
                <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        User Distribution
                    </CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Total users across all plans
                    </p>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-4">
                <div className="flex flex-col h-full">
                    {/* Total Users Display */}
                    <div className="text-center mb-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {totalUsers.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            Total
                        </span>
                    </div>

                    {/* Chart Section */}
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={130}
                                    innerRadius={90}
                                    paddingAngle={2}
                                    dataKey="value"
                                    animationDuration={1000}
                                    animationBegin={200}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            stroke="white"
                                            strokeWidth={2}
                                            className="hover:opacity-90 transition-opacity duration-300"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-xs text-gray-400 dark:text-gray-500">Total</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {totalUsers.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Breakdown by Plan */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                            BREAKDOWN BY PLAN
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                            {data.map((item, index) => {
                                const percentage = ((item.value / totalUsers) * 100).toFixed(0)
                                return (
                                    <div key={index} className="text-center">
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {item.type}
                                            </span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            {percentage}%
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {item.value.toLocaleString()} users
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

UsersChart.displayName = 'UsersChart'