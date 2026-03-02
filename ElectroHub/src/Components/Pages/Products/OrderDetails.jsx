import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { 
  FaArrowLeft, 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaCalendar,
  FaCreditCard,
  FaBox,
  FaShippingFast,
  FaCheckCircle,
  FaFileInvoiceDollar
} from "react-icons/fa";
import { FiPackage, FiDollarSign, FiTruck } from "react-icons/fi";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axiosSecure.get(`/orders/${id}`);
        const orderData = res.data;
        setOrder(orderData);
        
        // যদি products array থেকে productId থাকে, তাহলে product details fetch করুন
        if (orderData.products && orderData.products.length > 0) {
          const productIds = orderData.products.map(p => p.productId);
          if (productIds.length > 0) {
            try {
              // আপনার products fetch করার API endpoint
              const productsRes = await axiosSecure.post('/products/batch', { ids: productIds });
              setProducts(productsRes.data || []);
            } catch (error) {
              console.error("Error fetching product details:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, axiosSecure]);

  const handleBack = () => {
    navigate(-1);
  };

  // প্রোডাক্ট ডিটেইলস পাওয়ার জন্য ফাংশন
  const getProductDetails = (productId) => {
    return products.find(p => p._id === productId) || {};
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Order not found</p>
        <button
          onClick={handleBack}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Orders
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-gray-600 mt-1">Order ID: {order.orderId || `#${order._id?.slice(-8)}`}</p>
          </div>
          
          <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
            <span className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${
              order.status === "completed"
                ? "bg-green-100 text-green-800"
                : order.status === "confirmed"
                ? "bg-blue-100 text-blue-800"
                : order.status === "shipped"
                ? "bg-purple-100 text-purple-800"
                : order.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}>
              {order.status === "confirmed" && <FaCheckCircle />}
              {order.status?.toUpperCase()}
            </span>
            
            <span className={`px-4 py-2 rounded-full font-semibold ${
              order.paymentStatus === "paid"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {order.paymentStatus?.toUpperCase() || "UNPAID"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer & Order Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaUser className="mr-2 text-blue-600" />
              Customer Information
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <FaUser className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{order.customer?.name || order.customerName || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{order.customer?.email || order.customerEmail || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaPhone className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{order.customer?.mobile || order.customerPhone || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaCalendar className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-green-600" />
              Delivery Information
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{order.customer?.address || order.deliveryAddress || "N/A"}</p>
              </div>
              
              <div className="flex space-x-4">
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">{order.customer?.city || order.city || "N/A"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Postal Code</p>
                  <p className="font-medium">{order.customer?.postalCode || order.zipCode || order.postalCode || "N/A"}</p>
                </div>
              </div>
              
              {order.trackingNumber && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                  <p className="font-medium text-blue-600">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-purple-600" />
              Payment Information
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium flex items-center">
                  {order.paymentMethod === "Stripe" && <FaCreditCard className="mr-2" />}
                  {order.paymentMethod || "N/A"}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className={`font-medium flex items-center ${
                  order.paymentStatus === "paid" 
                    ? "text-green-600" 
                    : "text-red-600"
                }`}>
                  {order.paymentStatus === "paid" && <FaCheckCircle className="mr-2" />}
                  {order.paymentStatus?.toUpperCase() || "UNPAID"}
                </p>
              </div>
              
              {order.paymentDate && (
                <div>
                  <p className="text-sm text-gray-500">Payment Date</p>
                  <p className="font-medium">
                    {new Date(order.paymentDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Order Items & Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          {order.status && (
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-xl font-bold mb-4">Order Status</h2>
              <div className="relative">
                <div className="flex justify-between items-center mb-8">
                  {['pending', 'confirmed', 'shipped', 'completed'].map((status, index) => (
                    <div key={status} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        getStatusLevel(order.status) >= index 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {index === 0 && <FaFileInvoiceDollar />}
                        {index === 1 && <FaCheckCircle />}
                        {index === 2 && <FiTruck />}
                        {index === 3 && <FaBox />}
                      </div>
                      <span className={`text-sm font-medium ${
                        getStatusLevel(order.status) >= index 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-5 left-10 right-10 h-1 bg-gray-200 -z-10">
                  <div 
                    className="h-1 bg-blue-500 transition-all duration-500"
                    style={{ width: `${(getStatusLevel(order.status) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-xl font-bold">Order Items</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">#</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Product</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Quantity</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Unit Price</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Array.isArray(order.products) && order.products.length > 0 ? (
                    order.products.map((product, index) => {
                      const productDetails = getProductDetails(product.productId);
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-4 px-4">{index + 1}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              {productDetails.image && (
                                <img 
                                  src={productDetails.image} 
                                  alt={productDetails.name}
                                  className="w-12 h-12 rounded-md object-cover mr-3"
                                />
                              )}
                              <div>
                                <p className="font-medium">
                                  {productDetails.name || `Product ${product.productId?.slice(-6)}`}
                                </p>
                                {productDetails.description && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    {productDetails.description.substring(0, 50)}...
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                              {product.quantity || 1}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-medium">
                            ${Number(product.unitPrice || 0).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 font-medium">
                            ${Number(product.totalPrice || 0).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  ) : Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-4 px-4">{index + 1}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium">{item.name || "Unnamed Item"}</p>
                            {item.description && (
                              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-gray-100 px-3 py-1 rounded-full">
                            {item.quantity || 1}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium">
                          ${Number(item.price || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          ${Number((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">
                        No items found in this order
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FiDollarSign className="mr-2" />
              Order Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ${Number(order.summary?.subtotal || order.totalPrice || 0).toFixed(2)}
                </span>
              </div>
              
              {order.summary?.shipping > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="font-medium">
                    ${Number(order.summary.shipping || order.shippingFee || 0).toFixed(2)}
                  </span>
                </div>
              )}
              
              {order.summary?.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ${Number(order.summary.tax || order.tax || 0).toFixed(2)}
                  </span>
                </div>
              )}
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total</span>
                  <span>
                    ${Number(
                      order.summary?.total || 
                      (order.summary?.subtotal || 0) + 
                      (order.summary?.shipping || 0) + 
                      (order.summary?.tax || 0) ||
                      order.totalPrice || 0
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {order.notes && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2">Customer Notes</h3>
                <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for status timeline
const getStatusLevel = (status) => {
  switch(status) {
    case 'pending': return 0;
    case 'confirmed': return 1;
    case 'shipped': return 2;
    case 'completed': return 3;
    default: return 0;
  }
};

export default OrderDetails;