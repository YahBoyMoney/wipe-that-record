'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductForm from '../components/ProductForm';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  serviceType: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  featured: boolean;
  popular: boolean;
  bestValue: boolean;
  inventory?: {
    trackInventory: boolean;
    quantity: number;
    lowStockThreshold: number;
    allowBackorders: boolean;
  };
  analytics?: {
    views: number;
    totalSales: number;
    revenue: number;
    conversionRate: number;
    averageRating: number;
    totalReviews: number;
  };
  images?: Array<{
    image: Record<string, unknown>;
    alt: string;
    isPrimary: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ProductsAdminPanelProps {
  initialProducts?: Product[];
}

export default function ProductsAdminPanel({ initialProducts = [] }: ProductsAdminPanelProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [bulkAction, setBulkAction] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, filterStatus, filterCategory, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: searchTerm,
        status: filterStatus,
        category: filterCategory,
        sortBy,
        sortOrder,
      });
      const response = await fetch(`/api/products?${params.toString()}`);
      const { data } = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use sample data if API fails
      setProducts([
        {
          id: '1',
          name: 'DIY Expungement Kit',
          slug: 'diy-expungement-kit',
          description: 'Complete do-it-yourself expungement package',
          shortDescription: 'DIY package with forms and instructions',
          price: 97,
          originalPrice: 197,
          category: 'diy',
          serviceType: 'digital',
          status: 'active',
          featured: true,
          popular: true,
          bestValue: false,
          inventory: {
            trackInventory: false,
            quantity: 999,
            lowStockThreshold: 10,
            allowBackorders: true
          },
          analytics: {
            views: 2341,
            totalSales: 187,
            revenue: 18143,
            conversionRate: 7.98,
            averageRating: 4.8,
            totalReviews: 156
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Expert Document Review',
          slug: 'expert-document-review',
          description: 'Professional attorney review of documents',
          shortDescription: 'Attorney document review service',
          price: 197,
          category: 'review',
          serviceType: 'service',
          status: 'active',
          featured: true,
          popular: false,
          bestValue: true,
          inventory: {
            trackInventory: true,
            quantity: 25,
            lowStockThreshold: 5,
            allowBackorders: false
          },
          analytics: {
            views: 1876,
            totalSales: 142,
            revenue: 28024,
            conversionRate: 7.57,
            averageRating: 4.9,
            totalReviews: 89
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Full Service Expungement',
          slug: 'full-service-expungement',
          description: 'Complete expungement handled by legal team',
          shortDescription: 'Full service legal expungement',
          price: 1497,
          originalPrice: 1997,
          category: 'legal',
          serviceType: 'full_service',
          status: 'active',
          featured: true,
          popular: false,
          bestValue: false,
          inventory: {
            trackInventory: true,
            quantity: 3,
            lowStockThreshold: 5,
            allowBackorders: false
          },
          analytics: {
            views: 1234,
            totalSales: 89,
            revenue: 44234,
            conversionRate: 7.21,
            averageRating: 5.0,
            totalReviews: 67
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm, filterStatus, filterCategory, sortBy, sortOrder]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aVal = a[sortBy as keyof Product];
    const bVal = b[sortBy as keyof Product];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const handleBulkAction = async () => {
    if (!bulkAction || selectedProducts.length === 0) return;

    try {
      for (const productId of selectedProducts) {
        let updateData = {};
        
        switch (bulkAction) {
          case 'activate':
            updateData = { status: 'active' };
            break;
          case 'deactivate':
            updateData = { status: 'inactive' };
            break;
          case 'feature':
            updateData = { featured: true };
            break;
          case 'unfeature':
            updateData = { featured: false };
            break;
          case 'delete':
            await fetch(`/api/products/${productId}`, { method: 'DELETE' });
            continue;
        }

        if (Object.keys(updateData).length > 0) {
          await fetch(`/api/products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
          });
        }
      }

      await fetchProducts();
      setSelectedProducts([]);
      setBulkAction('');
    } catch (error) {
      console.error('Bulk action error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInventoryStatus = (product: Product) => {
    if (!product.inventory?.trackInventory) return null;
    
    const { quantity, lowStockThreshold } = product.inventory;
    if (quantity === 0) return { status: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    if (quantity <= lowStockThreshold) return { status: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
    return { status: 'In Stock', color: 'text-green-600 bg-green-100' };
  };

  const handleDuplicateProduct = async (product: Product) => {
    try {
      const { ...rest } = product;
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rest,
          name: rest.name + ' (Copy)',
          slug: rest.slug + '-copy',
        }),
      });
      if (!response.ok) throw new Error('Failed to duplicate');
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Error duplicating product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Error deleting');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
              <p className="text-gray-600 mt-1">
                Manage your product catalog, inventory, and performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Active Products</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.19 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Low Stock</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => {
                    if (!p.inventory?.trackInventory) return false;
                    return p.inventory.quantity <= p.inventory.lowStockThreshold;
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${products.reduce((sum, p) => sum + (p.analytics?.revenue || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="diy">DIY Kits</option>
                <option value="legal">Legal Services</option>
                <option value="consultation">Consultations</option>
                <option value="express">Express Services</option>
                <option value="review">Document Review</option>
              </select>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="createdAt">Date Created</option>
                  <option value="updatedAt">Last Updated</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                </span>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Bulk Actions</option>
                  <option value="activate">Activate</option>
                  <option value="deactivate">Deactivate</option>
                  <option value="feature">Feature</option>
                  <option value="unfeature">Unfeature</option>
                  <option value="delete">Delete</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="px-4 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Clear Selection
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Products Grid/List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {sortedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                      <div className="text-6xl">📄</div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product.id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {product.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Featured
                        </span>
                      )}
                      {product.popular && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Popular
                        </span>
                      )}
                      {product.bestValue && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          Best Value
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm leading-tight">{product.name}</h3>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.shortDescription}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </div>
                    
                    {product.inventory?.trackInventory && (
                      <div className="mb-3">
                        {(() => {
                          const inventoryStatus = getInventoryStatus(product);
                          return inventoryStatus ? (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Stock: {product.inventory?.quantity}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${inventoryStatus.color}`}>
                                {inventoryStatus.status}
                              </span>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <span className="block font-medium">Sales</span>
                        <span>{product.analytics?.totalSales || 0}</span>
                      </div>
                      <div>
                        <span className="block font-medium">Revenue</span>
                        <span>${(product.analytics?.revenue || 0).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block font-medium">Views</span>
                        <span>{product.analytics?.views || 0}</span>
                      </div>
                      <div>
                        <span className="block font-medium">Conv. Rate</span>
                        <span>{(product.analytics?.conversionRate || 0).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === sortedProducts.length && sortedProducts.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(sortedProducts.map(p => p.id));
                          } else {
                            setSelectedProducts([]);
                          }
                        }}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, product.id]);
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                              <span className="text-2xl">📄</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                            <div className="flex space-x-1 mt-1">
                              {product.featured && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  Featured
                                </span>
                              )}
                              {product.popular && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Popular
                                </span>
                              )}
                              {product.bestValue && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                  Best Value
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">${product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.inventory?.trackInventory ? (
                          <div>
                            <div>{product.inventory.quantity} units</div>
                            {(() => {
                              const inventoryStatus = getInventoryStatus(product);
                              return inventoryStatus ? (
                                <span className={`px-2 py-1 text-xs rounded-full ${inventoryStatus.color}`}>
                                  {inventoryStatus.status}
                                </span>
                              ) : null;
                            })()}
                          </div>
                        ) : (
                          <span className="text-gray-500">Not tracked</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="space-y-1">
                          <div>{product.analytics?.totalSales || 0} sales</div>
                          <div>${(product.analytics?.revenue || 0).toLocaleString()}</div>
                          <div>{(product.analytics?.conversionRate || 0).toFixed(1)}% conv.</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicateProduct(product)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 bg-white disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2 py-1 text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm rounded border border-gray-300 bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your filters to see more products.'
                : 'Get started by creating your first product.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Product Modal */}
      <AnimatePresence>
        {(showCreateModal || editingProduct) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Create New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <ProductForm
                  defaultValues={editingProduct ?? undefined}
                  productId={editingProduct?.id}
                  onCancel={() => {
                    setShowCreateModal(false);
                    setEditingProduct(null);
                  }}
                  onSuccess={async () => {
                    await fetchProducts();
                    setShowCreateModal(false);
                    setEditingProduct(null);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 