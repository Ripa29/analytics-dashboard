import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    hover?: boolean
    glass?: boolean
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              className,
                                              hover = false,
                                              glass = false,
                                              ...props
                                          }) => {
    return (
        <div
            className={cn(
                'rounded-xl border bg-card p-6 shadow-sm transition-all duration-200',
                hover && 'hover:shadow-md hover:-translate-y-0.5',
                glass && 'backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 dark:border-gray-700/20',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
                                                                               children,
                                                                               className,
                                                                               ...props
                                                                           }) => {
    return (
        <div className={cn('mb-4', className)} {...props}>
            {children}
        </div>
    )
}

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
                                                                                  children,
                                                                                  className,
                                                                                  ...props
                                                                              }) => {
    return (
        <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)} {...props}>
            {children}
        </h3>
    )
}

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
                                                                                children,
                                                                                className,
                                                                                ...props
                                                                            }) => {
    return (
        <div className={cn('', className)} {...props}>
            {children}
        </div>
    )
}