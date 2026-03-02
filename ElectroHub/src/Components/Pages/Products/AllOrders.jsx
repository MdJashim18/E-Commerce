import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { useNavigate } from "react-router";
import { FaEye, FaCheckCircle, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();

  // 🔹 Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosSecure.get("/orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load orders',
          timer: 2000,
          showConfirmButton: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [axiosSecure]);

  // 🔹 Confirm order function
  const handleConfirmOrder = async (id) => {
    const result = await Swal.fire({
      title: 'Confirm Order',
      text: 'Are you sure you want to confirm this order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, confirm it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/orders/${id}/confirm`);

      if (res.data?.modifiedCount === 1) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, status: "confirmed" } : order
          )
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Order Confirmed!',
          text: 'Order has been confirmed successfully',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      Swal.fire({
        icon: 'error',
        title: 'Confirmation Failed',
        text: 'Failed to confirm order',
        timer: 2000
      });
    }
  };

  // 🔹 Delete order
  const handleDeleteOrder = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Order',
      text: 'Are you sure you want to delete this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/orders/${id}`);

      if (res.data?.deletedCount === 1) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== id)
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Order has been deleted successfully',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Failed to delete order',
        timer: 2000
      });
    }
  };

  // 🔹 View order details
  const handleViewOrder = (id) => {
    navigate(`/OrderDetails/${id}`);
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
        <p className="text-gray-600 mt-2">Loading orders...</p>
      </div>
    );
  }

  // 🔹 Empty state
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
          <FaEye className="text-3xl text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
        <p className="text-gray-600 mb-6">There are no orders to display at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">All Orders</h1>
      
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          Total Orders: <span className="font-bold text-blue-600">{orders.length}</span>
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
            Pending: {orders.filter(o => o.status === 'pending').length}
          </span>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
            Confirmed: {orders.filter(o => o.status === 'confirmed').length}
          </span>
          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
            Completed: {orders.filter(o => o.status === 'completed').length}
          </span>
        </div>
      </div>

      {/* ================= Desktop Table ================= */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">#</th>
              <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Order ID</th>
              <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Customer</th>
              <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Items</th>
              <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Total</th>
              <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Status</th>
              <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Payment</th>
              <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 border-b text-gray-600">{index + 1}</td>
                <td className="py-3 px-4 border-b">
                  <span className="font-medium text-gray-900">
                    {order.orderId || `#${order._id?.slice(-6)}`}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.customer?.name || order.customerName || "N/A"}
                    </p>
                    {order.customer?.email && (
                      <p className="text-xs text-gray-500">{order.customer.email}</p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 border-b">
                  {Array.isArray(order.products) 
                    ? `${order.products.length} item(s)`
                    : Array.isArray(order.items)
                    ? `${order.items.length} item(s)`
                    : "No items"}
                </td>
                <td className="py-3 px-4 border-b font-semibold text-gray-900">
                  ${Number(order.summary?.total || order.totalPrice || 0).toFixed(2)}
                </td>
                <td className="py-3 px-4 border-b">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status?.toUpperCase() || "PENDING"}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.paymentStatus?.toUpperCase() || "UNPAID"}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="flex space-x-2">
                    {/* View Button */}
                    <button
                      onClick={() => handleViewOrder(order._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                      title="View Order Details"
                    >
                      <FaEye className="text-xs" /> View
                    </button>
                    
                    {/* Confirm Button (only for pending orders) */}
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleConfirmOrder(order._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                        title="Confirm Order"
                      >
                        <FaCheckCircle className="text-xs" /> Confirm
                      </button>
                    )}
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                      title="Delete Order"
                    >
                      <FaTrash className="text-xs" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Mobile Cards ================= */}
      <div className="md:hidden mt-6 space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {order.orderId || `Order #${order._id?.slice(-6)}`}
                </h3>
                <p className="text-sm text-gray-600">
                  {order.customer?.name || order.customerName || "N/A"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "confirmed"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status?.toUpperCase() || "PENDING"}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.paymentStatus?.toUpperCase() || "UNPAID"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-500">Items</p>
                <p className="font-medium">
                  {Array.isArray(order.products) 
                    ? `${order.products.length} item(s)`
                    : Array.isArray(order.items)
                    ? `${order.items.length} item(s)`
                    : "No items"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold text-lg text-gray-900">
                  ${Number(order.summary?.total || order.totalPrice || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {order.customer?.email && (
              <p className="text-sm text-gray-600 mb-3">
                Email: {order.customer.email}
              </p>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex space-x-2">
                {/* View Button */}
                <button
                  onClick={() => handleViewOrder(order._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                  title="View Order Details"
                >
                  <FaEye className="text-xs" /> View
                </button>
                
                {/* Confirm Button (only for pending orders) */}
                {order.status === "pending" && (
                  <button
                    onClick={() => handleConfirmOrder(order._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                    title="Confirm Order"
                  >
                    <FaCheckCircle className="text-xs" /> Confirm
                  </button>
                )}
              </div>
              
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteOrder(order._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                title="Delete Order"
              >
                <FaTrash className="text-xs" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrders;