'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Globe, TrendingUp, TrendingDown } from 'lucide-react'

interface TrafficSource {
    source: string
    value: number
    color: string
    change?: number
}

interface TrafficChartProps {
    data: TrafficSource[]
}

export function TrafficChart({ data }: TrafficChartProps) {
    const total = data?.reduce((sum, item) => sum + (item.value || 0), 0) || 0

    if (!data || data.length === 0) {
        return (
            <Card className="h-[350px] md:h-[400px] flex flex-col">
                <CardHeader className="pb-3 md:pb-4">
                    <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
                        <Globe className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                        <span>Traffic Sources</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center flex-1">
                    <div className="text-center">
                        <Globe className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm md:text-base">No traffic data available</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-[350px] md:h-[400px] flex flex-col">
            <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-base md:text-lg">
                        <Globe className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                        <span>Traffic Sources</span>
                    </div>
                    <div className="text-right">
                        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{total}%</div>
                        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Traffic</div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 md:p-6 overflow-y-auto">
                <div className="space-y-4 md:space-y-6">
                    {data.map((item, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2 md:space-x-3">
                                    <div className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color || '#3B82F6' }}/>
                                    <span className="font-medium text-sm md:text-base">{item.source}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-sm md:text-base">{item.value}%</span>
                                    {item.change && (
                                        <div className={`flex items-center text-xs ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.change >= 0 ? (
                                                <TrendingUp className="w-3 h-3 mr-1" />
                                            ) : (
                                                <TrendingDown className="w-3 h-3 mr-1" />
                                            )}
                                            {Math.abs(item.change)}%
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${item.value}%`,
                                        backgroundColor: item.color || '#3B82F6'
                                    }}/>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {data.map((item, index) => (
                            <div key={index}
                                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                                <div className="text-lg md:text-xl font-bold mb-1"
                                    style={{ color: item.color || '#3B82F6' }}>
                                    {item.value}%
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {item.source}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}