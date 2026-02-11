'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useCRUDStore } from '@/lib/store/crudStore'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { Package, Plus, Filter, Download, Edit, Trash2, Search, CheckCircle, XCircle, AlertCircle, Save, X, Tag, Layers } from 'lucide-react'
import { Product } from '@/types'
import toast from 'react-hot-toast'

export default function ProductsPage() {
    const { products, addProduct, updateProduct, deleteProduct } = useCRUDStore()
    const { checkPermission } = useDashboardStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        status: 'active' as const
    })

    const canCreate = checkPermission('products.create')
    const canEdit = checkPermission('products.edit')
    const canDelete = checkPermission('products.delete')

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const categories = Array.from(new Set(products.map(p => p.category)))

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'inactive': return <XCircle className="w-4 h-4 text-gray-500" />
            case 'out_of_stock': return <AlertCircle className="w-4 h-4 text-red-500" />
            default: return <CheckCircle className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
            case 'out_of_stock': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
            toast.error('Please fill in all required fields')
            return
        }

        addProduct({
            ...newProduct,
            sales: 0
        })

        toast.success('Product added successfully')
        setIsAdding(false)
        setNewProduct({
            name: '',
            category: '',
            price: 0,
            stock: 0,
            status: 'active'
        })
    }

    const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
        updateProduct(id, updates)
        toast.success('Product updated successfully')
        setEditingId(null)
    }

    const handleDeleteProduct = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id)
            toast.success('Product deleted successfully')
        }
    }

    const handleUpdateStock = (id: string, newStock: number) => {
        if (canEdit) {
            const newStatus = newStock === 0 ? 'out_of_stock' : newStock < 10 ? 'inactive' : 'active'
            updateProduct(id, {
                stock: newStock,
                status: newStatus
            })
            toast.success(`Stock updated to ${newStock}`)
        }
    }

    const handleExport = () => {
        const exportData = filteredProducts.map(product => ({
            'Product ID': product.id,
            'Name': product.name,
            'Category': product.category,
            'Price': `$${product.price}`,
            'Stock': product.stock,
            'Sales': product.sales,
            'Status': product.status,
            'Revenue': `$${(product.price * product.sales).toFixed(2)}`
        }))

        const csv = convertToCSV(exportData)
        downloadFile(csv, `products-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
        toast.success('Products exported successfully')
    }

    const totalValue = filteredProducts.reduce((sum, p) => sum + (p.price * p.stock), 0)
    const totalRevenue = filteredProducts.reduce((sum, p) => sum + (p.price * p.sales), 0)

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your product inventory</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" icon={<Download size={18} />} onClick={handleExport}>
                        Export
                    </Button>
                    {canCreate && (
                        <Button icon={<Plus size={18} />} onClick={() => setIsAdding(true)}>
                            Add Product
                        </Button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search products by name or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center space-x-2">
                                <Filter className="text-gray-400" size={18} />
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add Product Form */}
            {isAdding && (
                <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Add New Product</span>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Product Name *
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Product name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category *
                                </label>
                                <div className="relative">
                                    <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Electronics"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        value={newProduct.price || ''}
                                        onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                                        className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Initial Stock
                                </label>
                                <input
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button icon={<Save size={18} />} onClick={handleAddProduct}>
                                Save Product
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Package className="w-5 h-5" />
                            <span>Products ({filteredProducts.length})</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-normal">
                            <span className="text-gray-500">
                                Inventory Value: <span className="font-bold text-gray-900 dark:text-white">${totalValue.toFixed(2)}</span>
                            </span>
                            <span className="text-gray-500">
                                Total Revenue: <span className="font-bold text-green-600 dark:text-green-400">${totalRevenue.toFixed(2)}</span>
                            </span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Product</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Category</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Price</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Stock</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Sales</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="py-4 px-4">
                                        {editingId === product.id ? (
                                            <input
                                                type="text"
                                                value={product.name}
                                                onChange={(e) => handleUpdateProduct(product.id, { name: e.target.value })}
                                                className="px-2 py-1 border rounded w-full"
                                            />
                                        ) : (
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">ID: {product.id}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        {editingId === product.id ? (
                                            <input
                                                type="text"
                                                value={product.category}
                                                onChange={(e) => handleUpdateProduct(product.id, { category: e.target.value })}
                                                className="px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                                                    {product.category}
                                                </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        {editingId === product.id ? (
                                            <input
                                                type="number"
                                                value={product.price}
                                                onChange={(e) => handleUpdateProduct(product.id, { price: parseFloat(e.target.value) })}
                                                className="px-2 py-1 border rounded w-24"
                                                step="0.01"
                                                min="0"
                                            />
                                        ) : (
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                ${product.price.toFixed(2)}
                                            </p>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-24">
                                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${
                                                            product.stock > 20 ? 'bg-green-500' :
                                                                product.stock > 10 ? 'bg-amber-500' : 'bg-red-500'
                                                        }`}
                                                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                            {editingId === product.id ? (
                                                <input
                                                    type="number"
                                                    value={product.stock}
                                                    onChange={(e) => handleUpdateProduct(product.id, { stock: parseInt(e.target.value) })}
                                                    className="px-2 py-1 border rounded w-16"
                                                    min="0"
                                                />
                                            ) : (
                                                <span className="font-medium">{product.stock}</span>
                                            )}
                                            {canEdit && !editingId && (
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => handleUpdateStock(product.id, product.stock + 10)}
                                                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 transition-colors"
                                                    >
                                                        +10
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStock(product.id, Math.max(0, product.stock - 10))}
                                                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                                                    >
                                                        -10
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 font-medium">
                                        {product.sales}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(product.status)}
                                            {editingId === product.id ? (
                                                <select
                                                    value={product.status}
                                                    onChange={(e) => handleUpdateProduct(product.id, { status: e.target.value as Product['status'] })}
                                                    className="px-2 py-1 border rounded text-sm"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="out_of_stock">Out of Stock</option>
                                                </select>
                                            ) : (
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
                                                        {product.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center space-x-2">
                                            {canEdit && (
                                                editingId === product.id ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            icon={<Save size={16} />}
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<X size={16} />}
                                                            onClick={() => setEditingId(null)}
                                                        />
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={<Edit size={16} />}
                                                        onClick={() => setEditingId(product.id)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )
                                            )}
                                            {canDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<Trash2 size={16} />}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No products found
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Helper functions
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