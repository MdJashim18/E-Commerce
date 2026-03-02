import React, { useEffect, useState, useMemo } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { 
  FiEye, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiFilter, 
  FiDownload,
  FiPlus,
  FiBarChart2,
  FiTrendingUp,
  FiTrendingDown,
  FiCheckCircle,
  FiXCircle,
  FiMoreVertical
} from "react-icons/fi";
import { 
  MdInventory, 
  MdLocalOffer,
  MdStar,
  MdOutlineVisibility
} from "react-icons/md";
import { FaBox, FaRegClock, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";

const ProductsTable = () => {
    const axiosSecure = UseAxiosSecure();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get("/devices");
                setProducts(res.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load products'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [axiosSecure]);

    // Filter and search products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = filterStatus === "all" || 
                                 (filterStatus === "inStock" && product?.inventory?.stockQuantity > 0) ||
                                 (filterStatus === "outOfStock" && product?.inventory?.stockQuantity === 0) ||
                                 (filterStatus === "discount" && product?.pricing?.discountPercentage > 0);
            
            return matchesSearch && matchesStatus;
        });
    }, [products, searchTerm, filterStatus]);

    // Sorting function
    const sortedProducts = useMemo(() => {
        let sortableProducts = [...filteredProducts];
        if (sortConfig.key) {
            sortableProducts.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableProducts;
    }, [filteredProducts, sortConfig]);

    // Handle sorting
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Delete product
    const handleDelete = (id, title) => {
        Swal.fire({
            title: "Delete Product",
            text: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/devices/${id}`);
                    if (res.data.deletedCount > 0) {
                        setProducts(prev => prev.filter(item => item._id !== id));
                        setSelectedProducts(prev => prev.filter(itemId => itemId !== id));
                        
                        Swal.fire({
                            icon: "success",
                            title: "Deleted!",
                            text: "Product has been deleted successfully.",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to delete product",
                    });
                }
            }
        });
    };

    // Bulk delete
    const handleBulkDelete = () => {
        if (selectedProducts.length === 0) return;
        
        Swal.fire({
            title: "Delete Multiple Products",
            text: `Are you sure you want to delete ${selectedProducts.length} selected products?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: `Delete ${selectedProducts.length} Products`,
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const deletePromises = selectedProducts.map(id => 
                        axiosSecure.delete(`/devices/${id}`)
                    );
                    await Promise.all(deletePromises);
                    
                    setProducts(prev => prev.filter(item => !selectedProducts.includes(item._id)));
                    setSelectedProducts([]);
                    
                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: `${selectedProducts.length} products have been deleted.`,
                    });
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to delete some products",
                    });
                }
            }
        });
    };

    // Toggle product selection
    const toggleProductSelection = (id) => {
        setSelectedProducts(prev => 
            prev.includes(id) 
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    // Select all products
    const toggleSelectAll = () => {
        if (selectedProducts.length === sortedProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(sortedProducts.map(product => product._id));
        }
    };

    // Calculate stats
    const stats = useMemo(() => {
        const total = products.length;
        const inStock = products.filter(p => p?.inventory?.stockQuantity > 0).length;
        const outOfStock = products.filter(p => p?.inventory?.stockQuantity === 0).length;
        const onDiscount = products.filter(p => p?.pricing?.discountPercentage > 0).length;
        const totalValue = products.reduce((sum, p) => 
            sum + (p?.pricing?.regularPrice || 0), 0
        );
        
        return { total, inStock, outOfStock, onDiscount, totalValue };
    }, [products]);

    // Loading skeleton
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-64"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                Product Management
                            </h1>
                            <p className="text-gray-600">
                                Manage your product catalog efficiently
                            </p>
                        </div>
                        <Link
                            to="/dashboard/addProducts"
                            className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                            <FiPlus className="mr-2 group-hover:rotate-90 transition-transform" />
                            Add New Product
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Products</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <FaBox className="text-2xl text-blue-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-white p-5 rounded-2xl shadow-lg border border-green-100"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">In Stock</p>
                                    <h3 className="text-2xl font-bold text-green-700">{stats.inStock}</h3>
                                </div>
                                <div className="p-3 bg-green-50 rounded-xl">
                                    <FiCheckCircle className="text-2xl text-green-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-white p-5 rounded-2xl shadow-lg border border-orange-100"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">On Discount</p>
                                    <h3 className="text-2xl font-bold text-orange-600">{stats.onDiscount}</h3>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-xl">
                                    <MdLocalOffer className="text-2xl text-orange-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-white p-5 rounded-2xl shadow-lg border border-red-100"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Out of Stock</p>
                                    <h3 className="text-2xl font-bold text-red-600">{stats.outOfStock}</h3>
                                </div>
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <FiXCircle className="text-2xl text-red-600" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Filters and Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products by title or brand..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input input-bordered w-full pl-12 focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-outline">
                                    <FiFilter className="mr-2" />
                                    Status: {filterStatus === 'all' ? 'All' : filterStatus}
                                </label>
                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><button onClick={() => setFilterStatus("all")} className="py-2">All Products</button></li>
                                    <li><button onClick={() => setFilterStatus("inStock")} className="py-2">In Stock</button></li>
                                    <li><button onClick={() => setFilterStatus("outOfStock")} className="py-2">Out of Stock</button></li>
                                    <li><button onClick={() => setFilterStatus("discount")} className="py-2">On Discount</button></li>
                                </ul>
                            </div>

                            {selectedProducts.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="btn btn-error btn-outline"
                                >
                                    <FiTrash2 className="mr-2" />
                                    Delete Selected ({selectedProducts.length})
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Products Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
                >
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <th className="pl-6">
                                        <label className="cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                checked={selectedProducts.length === sortedProducts.length && sortedProducts.length > 0}
                                                onChange={toggleSelectAll}
                                            />
                                        </label>
                                    </th>
                                    <th className="text-gray-700 font-semibold py-4">Product</th>
                                    <th 
                                        className="text-gray-700 font-semibold py-4 cursor-pointer hover:text-primary transition-colors"
                                        onClick={() => requestSort('pricing.regularPrice')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Price
                                            {sortConfig.key === 'pricing.regularPrice' && (
                                                <span className="text-sm">
                                                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                    <th className="text-gray-700 font-semibold py-4">Stock</th>
                                    <th className="text-gray-700 font-semibold py-4">Status</th>
                                    <th className="text-gray-700 font-semibold py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sortedProducts.length > 0 ? (
                                    sortedProducts.map((product, index) => (
                                        <motion.tr
                                            key={product._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-gray-100 hover:bg-gray-50/50 group"
                                        >
                                            <td className="pl-6">
                                                <label className="cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-primary"
                                                        checked={selectedProducts.includes(product._id)}
                                                        onChange={() => toggleProductSelection(product._id)}
                                                    />
                                                </label>
                                            </td>

                                            {/* Product Info */}
                                            <td>
                                                <div className="flex items-center gap-4 py-4">
                                                    <div className="relative">
                                                        <img
                                                            src={product?.media?.featuredImage || '/placeholder.jpg'}
                                                            alt={product.title}
                                                            className="w-16 h-16 object-cover rounded-xl border border-gray-200 group-hover:scale-105 transition-transform"
                                                        />
                                                        {product?.pricing?.discountPercentage > 0 && (
                                                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                                -{product.pricing.discountPercentage}%
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                                            {product.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">{product.brand}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                                SKU: {product?.inventory?.sku || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Price */}
                                            <td className="align-middle">
                                                <div className="space-y-1">
                                                    <div className="font-bold text-lg text-gray-900">
                                                        ${product?.pricing?.discountPrice?.toFixed(2) || product?.pricing?.regularPrice?.toFixed(2)}
                                                    </div>
                                                    {product?.pricing?.discountPrice && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-500 line-through">
                                                                ${product.pricing.regularPrice.toFixed(2)}
                                                            </span>
                                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                                Save ${(product.pricing.regularPrice - product.pricing.discountPrice).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Stock */}
                                            <td className="align-middle">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${product?.inventory?.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    <span className={`font-medium ${product?.inventory?.stockQuantity > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                        {product?.inventory?.stockQuantity || 0} units
                                                    </span>
                                                </div>
                                                {product?.inventory?.lowStockAlert && product.inventory.stockQuantity <= product.inventory.lowStockAlert && (
                                                    <span className="text-xs text-orange-600 mt-1 block">Low stock alert</span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="align-middle">
                                                <span className={`badge ${product?.inventory?.stockQuantity > 0 ? 'badge-success' : 'badge-error'} badge-lg px-3 py-2`}>
                                                    {product?.inventory?.stockQuantity > 0 ? 'Stock' : 'Out'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="align-middle">
                                                <div className="flex items-center gap-3">
                                                    <Link
                                                        to={`/ProductsDetails/${product._id}`}
                                                        className="btn btn-ghost btn-sm btn-circle hover:bg-blue-50 hover:text-blue-600 tooltip"
                                                        data-tip="View Details"
                                                    >
                                                        <FiEye className="text-lg" />
                                                    </Link>

                                                    <Link
                                                        to={`/dashboard/UpdateProducts/${product._id}`}
                                                        className="btn btn-ghost btn-sm btn-circle hover:bg-green-50 hover:text-green-600 tooltip"
                                                        data-tip="Edit Product"
                                                    >
                                                        <FiEdit2 className="text-lg" />
                                                    </Link>

                                                    <button
                                                        onClick={() => handleDelete(product._id, product.title)}
                                                        className="btn btn-ghost btn-sm btn-circle hover:bg-red-50 hover:text-red-600 tooltip"
                                                        data-tip="Delete Product"
                                                    >
                                                        <FiTrash2 className="text-lg" />
                                                    </button>

                                                    <div className="dropdown dropdown-left">
                                                        <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle hover:bg-gray-100">
                                                            <FiMoreVertical />
                                                        </label>
                                                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
                                                            <li><Link to={`/dashboard/inventory/${product._id}`} className="py-2">Inventory</Link></li>
                                                            <li><Link to={`/dashboard/analytics/${product._id}`} className="py-2">Analytics</Link></li>
                                                            <li><button className="py-2 text-red-600">Duplicate</button></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <FaBox className="text-5xl mb-4 opacity-30" />
                                                <p className="text-lg mb-2">No products found</p>
                                                <p className="text-sm mb-4">Try adjusting your search or filter</p>
                                                <Link to="/dashboard/addProducts" className="btn btn-primary btn-outline">
                                                    <FiPlus className="mr-2" />
                                                    Add Your First Product
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                        <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                            Showing <span className="font-semibold">{sortedProducts.length}</span> of <span className="font-semibold">{products.length}</span> products
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                                {selectedProducts.length} selected
                            </div>
                            <button className="btn btn-ghost btn-sm">
                                <FiDownload className="mr-2" />
                                Export CSV
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 bg-gradient-to-r from-primary/10 to-blue-100 rounded-2xl p-6 border border-primary/20"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Products</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">${stats.totalValue.toFixed(2)}</div>
                            <div className="text-sm text-gray-600">Total Inventory Value</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {products.length > 0 ? ((stats.onDiscount / products.length) * 100).toFixed(1) : 0}%
                            </div>
                            <div className="text-sm text-gray-600">On Discount</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {products.length > 0 ? ((stats.outOfStock / products.length) * 100).toFixed(1) : 0}%
                            </div>
                            <div className="text-sm text-gray-600">Out of Stock</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductsTable;