import React, { useEffect, useState, useMemo } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiTrash2,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiDollarSign,
  FiArrowRight,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiUser,
  FiCalendar,
  FiTrendingUp,
  FiRefreshCw,
  FiEye,
  FiAlertCircle
} from "react-icons/fi";
import { MdOutlinePayment, MdOutlineLocalShipping, MdOutlineInventory, MdOutlineEmail } from "react-icons/md";
import { FaRegCreditCard, FaRegCalendarCheck, FaTruck, FaBoxOpen } from "react-icons/fa";
import { Link, useNavigate } from "react-router";

const UserCard = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = useAuth();

  const [cards, setCards] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderHistoryLoading, setOrderHistoryLoading] = useState(true);
  const [updatingQuantities, setUpdatingQuantities] = useState({});
  const navigate = useNavigate();

  // Fetch user's cart items with automatic cleanup
  useEffect(() => {
    if (!user?.email) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // সমান্তরালভাবে data fetch করুন
        const [cardsRes, ordersRes] = await Promise.all([
          axiosSecure.get(`/cards?email=${user.email}`),
          // ✅ ঠিক করা হয়েছে: সঠিক query parameter ব্যবহার করুন
          axiosSecure.get(`/orders?customer?email=${user.email}`)
          // অথবা যদি customer object থাকে তাহলে:
          // axiosSecure.get(`/orders?customerEmail=${user.email}`)
          // অথবা backend অনুযায়ী:
          // axiosSecure.get(`/orders/user/${user.email}`)
        ]);

        const userCards = cardsRes.data || [];
        const userOrders = ordersRes.data || [];

        console.log("User Orders:", userOrders); // Debugging এর জন্য

        // ✅ লগইন ইউজারের অর্ডার ফিল্টার করুন
        const userSpecificOrders = userOrders.filter(order => {
          // Multiple ways to check user ownership:
          // 1. order.email field থাকলে
          if (order.email && order.email === user.email) return true;
          
          // 2. order.userEmail field থাকলে
          if (order.userEmail && order.userEmail === user.email) return true;
          
          // 3. order.customer.email field থাকলে
          if (order.customer?.email && order.customer.email === user.email) return true;
          
          // 4. order.userId বা customerId যদি user._id এর সাথে match করে
          if (order.userId && user._id && order.userId === user._id) return true;
          
          // 5. Backend specific: যদি order.createdBy বা similar field থাকে
          if (order.createdBy && order.createdBy === user.email) return true;
          
          return false;
        });

        console.log("User Specific Orders:", userSpecificOrders); // Debugging

        // Confirmed orders filter করুন
        const confirmed = userSpecificOrders.filter(order => 
          order.status && ['confirmed', 'shipped', 'delivered', 'completed'].includes(order.status.toLowerCase())
        );
        setConfirmedOrders(confirmed);

        // Card থেকে ordered products remove করুন
        const orderedProductIds = new Set();
        
        // শুধুমাত্র user এর অর্ডার থেকে product IDs collect করুন
        userSpecificOrders.forEach(order => {
          if (order.products && Array.isArray(order.products)) {
            order.products.forEach(product => {
              if (product.productId) {
                orderedProductIds.add(product.productId);
              }
            });
          }
          // Alternative field names
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              if (item.productId) {
                orderedProductIds.add(item.productId);
              }
            });
          }
        });

        // Ordered products card থেকে filter out করুন
        const validCards = userCards.filter(card => {
          // যদি product already ordered হয়ে থাকে, তাহলে card থেকে remove করুন
          if (orderedProductIds.has(card.productId)) {
            // Automatically remove from database (optional)
            removeOrderedProductFromCart(user.email, card.productId);
            return false; // Remove from local state
          }
          return true; // Keep in cart
        });

        setCards(validCards);

      } catch (err) {
        console.error("Error fetching data:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load data",
          timer: 2000,
        });
      } finally {
        setLoading(false);
        setOrderHistoryLoading(false);
      }
    };

    fetchAllData();
  }, [user, axiosSecure]);

  // Ordered product কে cart থেকে remove করার function
  const removeOrderedProductFromCart = async (email, productId) => {
    try {
      await axiosSecure.delete(`/cards/user/${email}/product/${productId}`);
    } catch (err) {
      console.error(`Error removing product ${productId} from cart:`, err);
    }
  };

  // Real-time order monitoring
  useEffect(() => {
    if (!user?.email) return;

    const checkForNewOrders = async () => {
      try {
        const ordersRes = await axiosSecure.get(`/orders?email=${user.email}`);
        const userOrders = ordersRes.data || [];
        
        // ✅ শুধুমাত্র current user এর অর্ডার ফিল্টার করুন
        const userSpecificOrders = userOrders.filter(order => {
          if (order.email && order.email === user.email) return true;
          if (order.userEmail && order.userEmail === user.email) return true;
          if (order.customer?.email && order.customer.email === user.email) return true;
          if (order.userId && user._id && order.userId === user._id) return true;
          return false;
        });
        
        // নতুন confirmed orders খুঁজে বের করুন
        const newConfirmedOrders = userSpecificOrders.filter(order => 
          order.status && ['confirmed', 'shipped', 'completed'].includes(order.status.toLowerCase()) &&
          !confirmedOrders.some(existing => existing._id === order._id)
        );

        if (newConfirmedOrders.length > 0) {
          // নতুন orders এর products card থেকে remove করুন
          newConfirmedOrders.forEach(order => {
            if (order.products && Array.isArray(order.products)) {
              order.products.forEach(product => {
                if (product.productId) {
                  // Card থেকে remove করুন
                  const updatedCards = cards.filter(card => 
                    card.productId !== product.productId
                  );
                  setCards(updatedCards);
                  
                  // Database থেকেও remove করুন
                  removeOrderedProductFromCart(user.email, product.productId);
                }
              });
            }
          });

          // Confirmed orders update করুন
          setConfirmedOrders(prev => [...newConfirmedOrders, ...prev]);
        }
      } catch (err) {
        console.error("Error checking for new orders:", err);
      }
    };

    // প্রতি 30 সেকেন্ডে check করুন
    const intervalId = setInterval(checkForNewOrders, 30000);

    return () => clearInterval(intervalId);
  }, [user, cards, confirmedOrders, axiosSecure]);

  const { unpaidCards, paidCards, totalAmount, itemCount } = useMemo(() => {
    const unpaid = cards.filter((c) => c.status !== "paid");
    const paid = cards.filter((c) => c.status === "paid");
    const total = unpaid.reduce((sum, c) => sum + Number(c.totalAmount || 0), 0);
    const count = unpaid.reduce((sum, c) => sum + Number(c.quantity || 1), 0);

    return { unpaidCards: unpaid, paidCards: paid, totalAmount: total, itemCount: count };
  }, [cards]);

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) {
      handleDelete(id);
      return;
    }

    setUpdatingQuantities(prev => ({ ...prev, [id]: true }));

    try {
      const res = await axiosSecure.patch(`/cards/${id}`, { quantity: newQuantity });
      if (res.data.modifiedCount > 0) {
        setCards(prev => prev.map(item =>
          item._id === id
            ? {
              ...item,
              quantity: newQuantity,
              totalAmount: (item.pricePerUnit || item.totalAmount / item.quantity) * newQuantity
            }
            : item
        ));
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update quantity",
      });
    } finally {
      setUpdatingQuantities(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id) => {
    const item = cards.find(c => c._id === id);

    Swal.fire({
      title: "Remove Item",
      html: `Remove <strong>${item?.productName}</strong> from your cart?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Keep it",
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/cards/${id}`);
          if (res.data.deletedCount > 0) {
            setCards(cards.filter((item) => item._id !== id));

            Swal.fire({
              icon: "success",
              title: "Removed!",
              text: "Item removed from cart",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } catch (err) {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Delete failed!",
            text: err.message,
          });
        }
      }
    });
  };

  const handleClearCart = () => {
    if (unpaidCards.length === 0) return;

    Swal.fire({
      title: "Clear Cart",
      html: `Clear all ${unpaidCards.length} items from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Clear All",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deletePromises = unpaidCards.map(item =>
            axiosSecure.delete(`/cards/${item._id}`)
          );
          await Promise.all(deletePromises);
          setCards(paidCards);

          Swal.fire({
            icon: "success",
            title: "Cart Cleared!",
            text: "All items removed from cart",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Clear Failed",
            text: "Could not clear cart",
          });
        }
      }
    });
  };

  const handlePayment = async () => {
    if (!user || unpaidCards.length === 0) return;

    try {
      const paymentInfo = {
        userId: user._id,
        userName: user.displayName || user.name,
        userEmail: user.email,
        totalAmount: totalAmount,
        items: unpaidCards.map((c) => ({
          _id: c._id,
          productId: c.productId,
          productName: c.productName,
          quantity: c.quantity,
          pricePerUnit: c.pricePerUnit || (c.totalAmount / c.quantity),
          totalAmount: c.totalAmount,
          productImage: c.productImage,
          addedAt: c.addedAt
        })),
        timestamp: new Date().toISOString()
      };

      localStorage.setItem("paymentProductIds", JSON.stringify(paymentInfo.items));
      window.location.href = '/Orders';
      console.log("Secure Checkout");

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.message || "Unable to process payment. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/OrderDetails/${orderId}`);
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': 
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return <FiCheckCircle className="mr-1" />;
      case 'shipped': return <FaTruck className="mr-1" />;
      case 'delivered':
      case 'completed': return <FaBoxOpen className="mr-1" />;
      default: return <FiClock className="mr-1" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const calculateOrderTotal = (order) => {
    if (order.summary?.total) {
      return order.summary.total;
    }
    if (order.totalPrice) {
      return order.totalPrice;
    }
    if (order.totalAmount) {
      return order.totalAmount;
    }
    return 0;
  };

  const [showOrderNotification, setShowOrderNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showAutoRemoveNotification = (productName) => {
    setNotificationMessage(`${productName} has been automatically removed from your cart as it has been ordered.`);
    setShowOrderNotification(true);
    
    setTimeout(() => {
      setShowOrderNotification(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 lg:p-6">
      {/* Auto-remove Notification */}
      <AnimatePresence>
        {showOrderNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 left-4 md:left-auto md:right-4 md:w-96 z-50"
          >
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-lg">
              <div className="flex items-start">
                <FiAlertCircle className="text-xl mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Item Auto-Removed</p>
                  <p className="text-sm mt-1">{notificationMessage}</p>
                </div>
                <button
                  onClick={() => setShowOrderNotification(false)}
                  className="ml-4 text-blue-700 hover:text-blue-900"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                My Shopping Cart
              </h1>
              <p className="text-gray-600">
                Review and manage your cart items before checkout
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Note: Ordered items are automatically removed from your cart
              </p>
            </div>
            <div className="badge badge-primary badge-lg px-4 py-3">
              <FiShoppingCart className="mr-2" />
              {itemCount} Items
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-5 rounded-2xl shadow-lg border border-blue-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Available Items</p>
                  <h3 className="text-2xl font-bold text-blue-600">{itemCount}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <FiShoppingBag className="text-2xl text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-5 rounded-2xl shadow-lg border border-green-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Cart Total</p>
                  <h3 className="text-2xl font-bold text-green-700">${totalAmount.toFixed(2)}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <FiDollarSign className="text-2xl text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-5 rounded-2xl shadow-lg border border-purple-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">My Active Orders</p>
                  <h3 className="text-2xl font-bold text-purple-600">{confirmedOrders.length}</h3>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <FiCheckCircle className="text-2xl text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-5 rounded-2xl shadow-lg border border-yellow-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Auto-Removed</p>
                  <h3 className="text-2xl font-bold text-yellow-600">
                    {cards.length - itemCount}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Ordered items</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <FiPackage className="text-2xl text-yellow-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiShoppingCart />
                    Cart Items ({unpaidCards.length})
                  </h2>
                  {unpaidCards.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      <FiTrash2 className="mr-2" />
                      Clear Cart
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Items ordered elsewhere are automatically removed
                </p>
              </div>

              <AnimatePresence>
                {loading ? (
                  <div className="p-6">
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  </div>
                ) : unpaidCards.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {unpaidCards.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                              {item.productImage ? (
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FiPackage className="text-3xl text-gray-400" />
                              )}
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1">
                                  {item.productName}
                                </h3>
                                <p className="text-sm text-gray-500 mb-3">
                                  Item ID: {item.productId?.slice(0, 8)}...
                                </p>

                                <div className="flex items-center gap-6">
                                  {/* Quantity Controls */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                      disabled={updatingQuantities[item._id]}
                                      className="btn btn-xs btn-circle btn-outline"
                                    >
                                      <FiMinus />
                                    </button>
                                    <span className="font-bold text-lg min-w-[2rem] text-center">
                                      {updatingQuantities[item._id] ? (
                                        <FiRefreshCw className="animate-spin mx-auto" />
                                      ) : (
                                        item.quantity
                                      )}
                                    </span>
                                    <button
                                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                      disabled={updatingQuantities[item._id]}
                                      className="btn btn-xs btn-circle btn-outline"
                                    >
                                      <FiPlus />
                                    </button>
                                  </div>

                                  {/* Price */}
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-gray-900">
                                      ${item.totalAmount.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      ${(item.totalAmount / item.quantity).toFixed(2)} each
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="btn btn-ghost btn-sm btn-circle hover:bg-red-50 hover:text-red-600"
                                  title="Remove item"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 text-center"
                  >
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                        <FiShoppingCart className="text-4xl text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                      <p className="text-gray-600 mb-6">
                        Add some amazing products to get started with your shopping journey
                      </p>
                      <Link to="/products" className="btn btn-primary">
                        <FiArrowRight className="mr-2" />
                        Browse Products
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cart Summary */}
              {unpaidCards.length > 0 && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-gray-600">Subtotal ({itemCount} items)</p>
                      <h3 className="text-3xl font-bold text-gray-900">
                        ${totalAmount.toFixed(2)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Shipping and taxes calculated at checkout
                      </p>
                    </div>

                    <button
                      onClick={handlePayment}
                      className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all group"
                    >
                      <MdOutlinePayment className="mr-2 text-xl" />
                      Proceed to Checkout
                      <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* My Orders History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaRegCalendarCheck />
                    My Order History ({confirmedOrders.length})
                  </h2>
                  {confirmedOrders.length > 0 && (
                    <Link to="/dashboard/my-orders" className="text-sm text-primary hover:underline">
                      View All
                    </Link>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Showing your confirmed, shipped, and completed orders
                </p>
              </div>

              {orderHistoryLoading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              ) : confirmedOrders.length > 0 ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {confirmedOrders.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:border-blue-200 transition-all hover:shadow-sm cursor-pointer"
                        onClick={() => handleViewOrder(order._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getStatusBadgeColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Order #{order.orderId || order._id?.slice(-8)}
                              </h4>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <FiCalendar className="text-xs" />
                                {formatDate(order.orderDate || order.createdAt || order.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              ${calculateOrderTotal(order).toFixed(2)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(order.status)}`}>
                                {order.status?.toUpperCase() || 'PENDING'}
                              </span>
                              <FiEye className="text-gray-400" />
                            </div>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                              {Array.isArray(order.products)
                                ? `${order.products.length} item(s)`
                                : Array.isArray(order.items)
                                  ? `${order.items.length} item(s)`
                                  : "1 item"}
                            </p>
                            <div className="text-xs text-gray-500">
                              {order.paymentStatus && (
                                <span className={`px-2 py-1 rounded ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {order.paymentStatus.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {order.customer?.name && (
                            <p className="text-xs text-gray-500 mt-1">
                              Customer: {order.customer.name}
                            </p>
                          )}
                          
                          {/* Order Products Names */}
                          {order.products && Array.isArray(order.products) && (
                            <div className="mt-2 text-xs text-gray-600">
                              {order.products.slice(0, 2).map((product, idx) => (
                                <span key={idx} className="mr-2">
                                  {product.productName || product.name}
                                  {idx < Math.min(2, order.products.length - 1) ? ', ' : ''}
                                </span>
                              ))}
                              {order.products.length > 2 && (
                                <span className="text-gray-500">+{order.products.length - 2} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {confirmedOrders.length > 5 && (
                      <div className="text-center pt-4">
                        <Link
                          to="/dashboard/my-orders"
                          className="btn btn-ghost btn-sm"
                        >
                          View All {confirmedOrders.length} Orders
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                      <FaRegCalendarCheck className="text-3xl text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Once you place an order, it will appear here
                    </p>
                    <Link to="/products" className="btn btn-outline btn-sm">
                      Start Shopping
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-6"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Cart Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({itemCount})</span>
                    <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">Calculated at checkout</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {unpaidCards.length > 0 && (
                  <button
                    onClick={handlePayment}
                    className="btn btn-primary btn-block mt-6 shadow-md hover:shadow-lg"
                  >
                    <FiCreditCard className="mr-2" />
                    Secure Checkout
                  </button>
                )}

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 text-center">
                    <FiAlertCircle className="inline mr-1" />
                    Ordered items are auto-removed from cart
                  </p>
                </div>
              </div>

              {/* Order Stats */}
              <div className="p-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiTrendingUp />
                  My Order Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cart Items</span>
                    <span className="font-semibold">{itemCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">My Orders</span>
                    <span className="font-semibold text-blue-600">{confirmedOrders.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-semibold text-green-600">
                      ${(confirmedOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="p-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUser />
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiUser className="opacity-60" />
                    <span>{user?.displayName || user?.name || 'Customer'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MdOutlineEmail className="opacity-60" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                </div>
              </div>

              {/* Support Info */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-2xl border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MdOutlineLocalShipping />
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is available 24/7 to assist you with your order.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;