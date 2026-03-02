import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiPackage,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiCheckCircle,
  FiShoppingCart,
  FiCalendar,
  FiPlus,
  FiMinus,
  FiTrash2
} from "react-icons/fi";
import { MdOutlineLocalShipping, MdOutlinePayment } from "react-icons/md";
import { useNavigate } from "react-router";

const Orders = () => {
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productQuantities, setProductQuantities] = useState({});

  useEffect(() => {
    const loadCartItems = () => {
      try {
        const paymentProductIds = JSON.parse(localStorage.getItem("paymentProductIds") || "[]");
        console.log(paymentProductIds)
        setCartItems(paymentProductIds)
        const userInfo = JSON.parse(localStorage.getItem("paymentUserInfo"))
        console.log(userInfo)
        
      } catch (error) {
        console.error("Error loading cart items:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load cart items",
        });
      }
    };

    loadCartItems();
  }, [navigate]);
  console.log("Products : ",cartItems)

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const price = item.pricePerUnit ||0;
      return sum + (price * quantity);
    }, 0);

    const shipping = 0; // Free shipping
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  // Handle quantity changes
  const handleQuantityChange = (productId, change) => {
    setProductQuantities(prev => {
      const currentQty = prev[productId] || 1;
      const newQty = Math.max(1, currentQty + change);
      
      return {
        ...prev,
        [productId]: newQty
      };
    });
  };

  // Remove item from cart
  const handleRemoveItem = (productId) => {
    Swal.fire({
      title: "Remove Item",
      text: "Are you sure you want to remove this item from your order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setCartItems(prev => prev.filter(item => item._id !== productId));
        setProductQuantities(prev => {
          const newQuantities = { ...prev };
          delete newQuantities[productId];
          return newQuantities;
        });

        // Update localStorage
        const paymentProductIds = JSON.parse(localStorage.getItem("paymentProductIds") || "[]");
        const updatedIds = paymentProductIds.filter(item => item.productId !== productId);
        localStorage.setItem("paymentProductIds", JSON.stringify(updatedIds));

        if (updatedIds.length === 0) {
        //   navigate("/dashboard/MyCards");
        }
      }
    });
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepare order data
      const orderData = {
        orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customer: {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
        },
        products: cartItems.map(item => ({
          productId: item._id,
          productName: item.title,
          quantity: productQuantities[item._id] || 1,
          unitPrice: item.pricing?.discountPrice || item.pricing?.regularPrice || 0,
          totalPrice: (item.pricing?.discountPrice || item.pricing?.regularPrice || 0) * (productQuantities[item._id] || 1),
          image: item.media?.featuredImage
        })),
        summary: {
          subtotal,
          shipping,
          tax,
          total
        },
        orderDate: new Date(),
        status: "pending",
        notes: data.notes || ""
      };

      // Save order to database
      const res = await axiosSecure.post("/orders", orderData);

      if (res.data.insertedId) {
        // Clear localStorage
        localStorage.removeItem("paymentProductIds");
        localStorage.removeItem("paymentUserEmail");
        
        Swal.fire({
          icon: "success",
          title: "Order Submitted!",
          html: `
            <div class="text-center">
              <div class="text-4xl mb-4">🎉</div>
              <h3 class="text-xl font-bold mb-2">Thank you for your order!</h3>
              <p>Order ID: <strong>${orderData.orderId}</strong></p>
              <p class="mt-2">You will receive a confirmation email shortly.</p>
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: "View Order Details",
          confirmButtonColor: "#3b82f6",
        }).then(() => {
          navigate("");
        });

        reset();
      }
    } catch (error) {
      console.error("Order submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: "Failed to submit your order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // If no items in cart
//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
//         <div className="text-center max-w-md mx-auto p-6">
//           <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
//             <FiShoppingCart className="text-4xl text-gray-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">No Items to Order</h2>
//           <p className="text-gray-600 mb-6">Your cart is empty or order session has expired.</p>
//           <button
//             onClick={() => navigate("/dashboard/MyCards")}
//             className="btn btn-primary"
//           >
//             Go to Cart
//           </button>
//         </div>
//       </div>
//     );
//   }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Complete Your Order
          </h1>
          <p className="text-gray-600">
            Please review your items and provide shipping details
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiShoppingBag />
                Order Items ({cartItems.length})
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => {
                  const quantity = item.productId || 1;
                  const price = item.pricePerUnit;
                  const totalPrice = price * item.quantity;

                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                          {item.media?.featuredImage ? (
                            <img
                              src={item.media.featuredImage}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <FiPackage className="text-2xl text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{item.productName}</h3>
                            {/* <p className="text-sm text-gray-500">{item.brand || "No Brand"}</p> */}
                            <div className="flex items-center gap-2 mt-1">
                              {/* {price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${price.toFixed(2)}
                                </span>
                              )} */}
                              <span className="text-lg font-bold text-gray-900">
                                ${price.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="btn btn-ghost btn-sm btn-circle hover:bg-red-50 hover:text-red-600"
                            title="Remove item"
                          >
                            <FiTrash2 />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            {/* <button
                              onClick={() => handleQuantityChange(item._id, -1)}
                              className="btn btn-xs btn-circle btn-outline"
                              disabled={quantity <= 1}
                            >
                              <FiMinus />
                            </button> */}
                            {/* <span className="font-bold text-lg w-8 text-center">
                              {item.quantity}
                            </span> */}
                            {/* <button
                              onClick={() => handleQuantityChange(item._id, 1)}
                              className="btn btn-xs btn-circle btn-outline"
                            >
                              <FiPlus />
                            </button> */}
                          </div>

                          <div className="text-right">
                            {/* <div className="text-lg font-bold text-gray-900">
                              ${totalPrice.toFixed(2)}
                            </div> */}
                            <div className="text-sm text-gray-500">
                              ${price.toFixed(2)} × {item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Form Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiUser />
                Shipping Details
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name *</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", { 
                      required: "Full name is required",
                      minLength: { value: 3, message: "Name must be at least 3 characters" }
                    })}
                    className="input input-bordered w-full"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <span className="text-error text-sm mt-1">{errors.name.message}</span>
                  )}
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email *</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="input input-bordered w-full"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <span className="text-error text-sm mt-1">{errors.email.message}</span>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    {...register("mobile", { 
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9+\-\s]+$/,
                        message: "Invalid phone number"
                      }
                    })}
                    className="input input-bordered w-full"
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.mobile && (
                    <span className="text-error text-sm mt-1">{errors.mobile.message}</span>
                  )}
                </div>

                {/* Address */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Address *</span>
                  </label>
                  <textarea
                    {...register("address", { 
                      required: "Address is required",
                      minLength: { value: 10, message: "Address is too short" }
                    })}
                    className="textarea textarea-bordered h-24"
                    placeholder="123 Main Street, Apartment 4B"
                  />
                  {errors.address && (
                    <span className="text-error text-sm mt-1">{errors.address.message}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* City */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">City *</span>
                    </label>
                    <input
                      type="text"
                      {...register("city", { required: "City is required" })}
                      className="input input-bordered w-full"
                      placeholder="New York"
                    />
                    {errors.city && (
                      <span className="text-error text-sm mt-1">{errors.city.message}</span>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Postal Code</span>
                    </label>
                    <input
                      type="text"
                      {...register("postalCode")}
                      className="input input-bordered w-full"
                      placeholder="10001"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Order Notes (Optional)</span>
                  </label>
                  <textarea
                    {...register("notes")}
                    className="textarea textarea-bordered h-20"
                    placeholder="Special instructions for delivery..."
                  />
                </div>

                {/* Payment Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MdOutlinePayment className="text-blue-600" />
                    <span className="font-medium">Payment Information</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Payment already processed via Stripe. Your order will be shipped once confirmed.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full mt-6 shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="mr-2" />
                      Confirm Order
                    </>
                  )}
                </button>

                {/* Back to Cart */}
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/MyCards")}
                  className="btn btn-ghost w-full mt-2"
                >
                  ← Back to Cart
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;