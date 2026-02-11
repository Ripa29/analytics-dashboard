import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Notification, Permission } from '@/types'

interface DashboardStore {
    // State
    user: User | null
    users: User[]
    notifications: Notification[]
    permissions: Permission[]
    dateRange: '7d' | '30d' | '12m'
    userType: 'all' | 'free' | 'premium' | 'enterprise'
    darkMode: boolean

    // Actions
    setDateRange: (range: '7d' | '30d' | '12m') => void
    setUserType: (type: 'all' | 'free' | 'premium' | 'enterprise') => void
    toggleDarkMode: () => void
    setUser: (user: User) => void
    logout: () => void
    addUser: (user: User) => void
    updateUser: (id: string, updates: Partial<User>) => void
    deleteUser: (id: string) => void
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
    markNotificationAsRead: (id: string) => void
    clearNotifications: () => void
    checkPermission: (permissionName: string) => boolean
    getFilteredNotifications: () => Notification[]
}

const initialUsers: User[] = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        phone: '+8801234567890',
        department: 'Administration',
        createdAt: new Date(),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    },
    {
        id: '2',
        name: 'Manager User',
        email: 'manager@example.com',
        role: 'manager',
        phone: '+8801234567891',
        department: 'Sales',
        createdAt: new Date(),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager'
    },
    {
        id: '3',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user',
        phone: '+8801782384784',
        department: 'Marketing',
        createdAt: new Date(),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
    }
]

const initialPermissions: Permission[] = [
    { id: '1', name: 'dashboard.view', description: 'View dashboard', roles: ['admin', 'manager', 'user'] },
    { id: '2', name: 'users.view', description: 'View users', roles: ['admin', 'manager'] },
    { id: '3', name: 'users.create', description: 'Create users', roles: ['admin'] },
    { id: '4', name: 'users.edit', description: 'Edit users', roles: ['admin'] },
    { id: '5', name: 'users.delete', description: 'Delete users', roles: ['admin'] },
    { id: '6', name: 'orders.view', description: 'View orders', roles: ['admin', 'manager', 'user'] },
    { id: '7', name: 'orders.create', description: 'Create orders', roles: ['admin', 'manager'] },
    { id: '8', name: 'orders.edit', description: 'Edit orders', roles: ['admin', 'manager'] },
    { id: '9', name: 'orders.delete', description: 'Delete orders', roles: ['admin'] },
    { id: '10', name: 'products.view', description: 'View products', roles: ['admin', 'manager', 'user'] },
    { id: '11', name: 'products.create', description: 'Create products', roles: ['admin', 'manager'] },
    { id: '12', name: 'products.edit', description: 'Edit products', roles: ['admin', 'manager'] },
    { id: '13', name: 'products.delete', description: 'Delete products', roles: ['admin'] },
    { id: '14', name: 'reports.view', description: 'View reports', roles: ['admin', 'manager'] },
    { id: '15', name: 'reports.create', description: 'Create reports', roles: ['admin'] },
    { id: '16', name: 'settings.view', description: 'View settings', roles: ['admin'] },
    { id: '17', name: 'settings.edit', description: 'Edit settings', roles: ['admin'] },
    { id: '18', name: 'analytics.view', description: 'View analytics', roles: ['admin', 'manager'] },
]

const initialNotifications: Notification[] = [
    {
        id: '1',
        title: 'New User Registered',
        message: 'John Doe has registered as a new user',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 300000),
        roles: ['admin']
    },
    {
        id: '2',
        title: 'Order Completed',
        message: 'Order #1234 has been completed successfully',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 600000),
        roles: ['admin', 'manager']
    },
    {
        id: '3',
        title: 'Low Stock Alert',
        message: 'Product "Premium Widget" is running low on stock',
        type: 'warning',
        read: true,
        createdAt: new Date(Date.now() - 86400000),
        roles: ['admin', 'manager']
    },
    {
        id: '4',
        title: 'System Update Available',
        message: 'New system update v2.1.0 is available',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 172800000),
        roles: ['admin']
    },
    {
        id: '5',
        title: 'Weekly Report Ready',
        message: 'Your weekly analytics report is ready to view',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 900000),
        roles: ['admin', 'manager']
    },
    {
        id: '6',
        title: 'New Order Placed',
        message: 'Order #5678 has been placed by Customer',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 1200000),
        roles: ['admin', 'manager']
    }
]

export const useDashboardStore = create<DashboardStore>()(
    persist(
        (set, get) => ({
            user: null,
            users: initialUsers,
            notifications: initialNotifications,
            permissions: initialPermissions,
            dateRange: '12m',
            userType: 'all',
            darkMode: false,

            setDateRange: (range) => set({ dateRange: range }),
            setUserType: (type) => set({ userType: type }),
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),

            addUser: (user) => set((state) => ({
                users: [...state.users, { ...user, id: Date.now().toString() }]
            })),

            updateUser: (id, updates) => set((state) => ({
                users: state.users.map(user =>
                    user.id === id ? { ...user, ...updates } : user
                ),
                //current user if it's the same user
                user: state.user?.id === id ? { ...state.user, ...updates } : state.user
            })),

            deleteUser: (id) => set((state) => ({
                users: state.users.filter(user => user.id !== id)
            })),

            addNotification: (notification) => set((state) => ({
                notifications: [{
                    ...notification,
                    id: Date.now().toString(),
                    createdAt: new Date()
                }, ...state.notifications]
            })),

            markNotificationAsRead: (id) => set((state) => ({
                notifications: state.notifications.map(notif =>
                    notif.id === id ? { ...notif, read: true } : notif
                )
            })),

            clearNotifications: () => set({ notifications: [] }),

            checkPermission: (permissionName) => {
                const { user, permissions } = get()
                if (!user) return false

                const permission = permissions.find(p => p.name === permissionName)
                if (!permission) return false

                return permission.roles.includes(user.role)
            },

            getFilteredNotifications: () => {
                const { user, notifications } = get()
                if (!user) return []

                return notifications.filter(notif =>
                    notif.roles.includes(user.role)
                )
            }
        }),
        {
            name: 'dashboard-storage',
            partialize: (state) => ({
                user: state.user,
                darkMode: state.darkMode,
                users: state.users,
                notifications: state.notifications
            })
        }
    )
)