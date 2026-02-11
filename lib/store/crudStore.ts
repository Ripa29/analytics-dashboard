import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, Order, Report, User } from '@/types'

interface CRUDStore {
    // Products
    products: Product[]
    addProduct: (product: Omit<Product, 'id'>) => void
    updateProduct: (id: string, updates: Partial<Product>) => void
    deleteProduct: (id: string) => void

    // Orders
    orders: Order[]
    addOrder: (order: Omit<Order, 'id'>) => void
    updateOrder: (id: string, updates: Partial<Order>) => void
    deleteOrder: (id: string) => void

    // Reports
    reports: Report[]
    addReport: (report: Omit<Report, 'id'>) => void
    deleteReport: (id: string) => void

    // Export functions
    exportToCSV: (type: string, data?: any[]) => void
    exportToExcel: (type: string, data?: any[]) => void
}

const initialProducts: Product[] = [
    { id: '1', name: 'Premium Widget', category: 'Electronics', price: 299.99, stock: 45, sales: 123, status: 'active' },
    { id: '2', name: 'Smart Watch Pro', category: 'Wearables', price: 199.99, stock: 12, sales: 89, status: 'active' },
    { id: '3', name: 'Wireless Earbuds', category: 'Audio', price: 149.99, stock: 0, sales: 456, status: 'out_of_stock' },
    { id: '4', name: 'Gaming Mouse', category: 'Accessories', price: 79.99, stock: 67, sales: 234, status: 'active' },
    { id: '5', name: 'USB-C Hub', category: 'Electronics', price: 49.99, stock: 23, sales: 567, status: 'inactive' },
]

const initialOrders: Order[] = [
    { id: '1', customer: 'John Doe', email: 'john@example.com', amount: 299.99, status: 'completed', date: '2024-01-15', items: 3 },
    { id: '2', customer: 'Jane Smith', email: 'jane@example.com', amount: 149.99, status: 'processing', date: '2024-01-14', items: 2 },
    { id: '3', customer: 'Bob Johnson', email: 'bob@example.com', amount: 599.99, status: 'pending', date: '2024-01-13', items: 5 },
    { id: '4', customer: 'Alice Brown', email: 'alice@example.com', amount: 199.99, status: 'cancelled', date: '2024-01-12', items: 1 },
    { id: '5', customer: 'Charlie Wilson', email: 'charlie@example.com', amount: 399.99, status: 'completed', date: '2024-01-11', items: 4 },
]

const initialReports: Report[] = [
    { id: '1', title: 'Monthly Sales Report', type: 'Sales', generatedBy: 'Admin', date: '2024-01-15', size: '2.4 MB' },
    { id: '2', title: 'User Analytics Q4 2023', type: 'Analytics', generatedBy: 'System', date: '2024-01-10', size: '1.8 MB' },
    { id: '3', title: 'Product Performance', type: 'Products', generatedBy: 'Manager', date: '2024-01-05', size: '3.2 MB' },
    { id: '4', title: 'Financial Statement 2023', type: 'Finance', generatedBy: 'Admin', date: '2024-01-01', size: '4.5 MB' },
]

export const useCRUDStore = create<CRUDStore>()(
    persist(
        (set, get) => ({
            // Products
            products: initialProducts,
            addProduct: (product) => set((state) => ({
                products: [...state.products, {
                    ...product,
                    id: Date.now().toString(),
                    sales: product.sales || 0
                }]
            })),
            updateProduct: (id, updates) => set((state) => ({
                products: state.products.map(product =>
                    product.id === id ? { ...product, ...updates } : product
                )
            })),
            deleteProduct: (id) => set((state) => ({
                products: state.products.filter(product => product.id !== id)
            })),

            // Orders
            orders: initialOrders,
            addOrder: (order) => set((state) => ({
                orders: [...state.orders, {
                    ...order,
                    id: Date.now().toString(),
                    date: new Date().toISOString().split('T')[0]
                }]
            })),
            updateOrder: (id, updates) => set((state) => ({
                orders: state.orders.map(order =>
                    order.id === id ? { ...order, ...updates } : order
                )
            })),
            deleteOrder: (id) => set((state) => ({
                orders: state.orders.filter(order => order.id !== id)
            })),

            // Reports
            reports: initialReports,
            addReport: (report) => set((state) => ({
                reports: [...state.reports, {
                    ...report,
                    id: Date.now().toString(),
                    date: new Date().toISOString().split('T')[0],
                    size: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)} MB`
                }]
            })),
            deleteReport: (id) => set((state) => ({
                reports: state.reports.filter(report => report.id !== id)
            })),

            // Export functions
            exportToCSV: (type, customData) => {
                let data = customData
                if (!data) {
                    const state = get()
                    switch (type) {
                        case 'products': data = state.products; break
                        case 'orders': data = state.orders; break
                        case 'reports': data = state.reports; break
                        default: data = []
                    }
                }
                const csv = convertToCSV(data)
                downloadFile(csv, `${type}-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
            },

            exportToExcel: (type, customData) => {
                let data = customData
                if (!data) {
                    const state = get()
                    switch (type) {
                        case 'products': data = state.products; break
                        case 'orders': data = state.orders; break
                        case 'reports': data = state.reports; break
                        default: data = []
                    }
                }
                const csv = convertToCSV(data)
                downloadFile(csv, `${type}-${new Date().toISOString().split('T')[0]}.xls`, 'application/vnd.ms-excel')
            }
        }),
        {
            name: 'crud-storage',
            partialize: (state) => ({
                products: state.products,
                orders: state.orders,
                reports: state.reports
            })
        }
    )
)

// Helper functions for export
function convertToCSV(data: any[]) {
    if (!data.length) return ''

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(obj =>
        Object.values(obj).map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
    )

    return [headers, ...rows].join('\n')
}

function downloadFile(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}