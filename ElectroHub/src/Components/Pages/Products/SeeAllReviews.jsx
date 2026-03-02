import React, { useEffect, useState, useMemo } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { 
  FiEye, 
  FiStar, 
  FiFilter, 
  FiSearch, 
  FiCalendar,
  FiUser,
  FiPackage,
  FiMessageSquare,
  FiThumbsUp,
  FiThumbsDown,
  FiChevronRight,
  FiTrendingUp
} from "react-icons/fi";
import { MdOutlineRateReview, MdOutlineEmail } from "react-icons/md";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import ReactStars from "react-rating-stars-component";

const SeeAllReviews = () => {
  const axiosSecure = UseAxiosSecure();
  const [products, setProducts] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [expandedReview, setExpandedReview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/devices");
        setProducts(res.data);

        const allReviews = [];
        
        res.data.forEach((product) => {
          product.ratings?.reviews?.forEach((review) => {
            allReviews.push({
              id: `${product._id}-${review.userEmail}-${review.date}`,
              productId: product._id,
              productName: product.title,
              productImage: product?.media?.featuredImage,
              reviewerEmail: review.userEmail,
              reviewerName: review.userName || review.userEmail.split('@')[0],
              date: new Date(review.date),
              comment: review.comment,
              rating: review.rating || 0,
              likes: review.likes || 0,
              dislikes: review.dislikes || 0,
              verifiedPurchase: review.verifiedPurchase || false,
              helpfulCount: review.helpfulCount || 0
            });
          });
        });

        // Sort by date (newest first)
        allReviews.sort((a, b) => b.date - a.date);
        setReviewsList(allReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviewsList.filter(review => {
      const matchesSearch = 
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === "all" || 
        (filterType === "verified" && review.verifiedPurchase) ||
        (filterType === "unverified" && !review.verifiedPurchase);

      const matchesRating = selectedRating === "all" || 
        (selectedRating === "5" && review.rating === 5) ||
        (selectedRating === "4" && review.rating >= 4 && review.rating < 5) ||
        (selectedRating === "3" && review.rating >= 3 && review.rating < 4) ||
        (selectedRating === "2" && review.rating >= 2 && review.rating < 3) ||
        (selectedRating === "1" && review.rating === 1);

      return matchesSearch && matchesType && matchesRating;
    });
  }, [reviewsList, searchTerm, filterType, selectedRating]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = reviewsList.length;
    const averageRating = reviewsList.length > 0 
      ? (reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length).toFixed(1)
      : 0;
    const verified = reviewsList.filter(r => r.verifiedPurchase).length;
    const fiveStar = reviewsList.filter(r => r.rating === 5).length;
    const recent = reviewsList.filter(r => {
      const daysDiff = (new Date() - r.date) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;

    return { total, averageRating, verified, fiveStar, recent };
  }, [reviewsList]);

  // Handle view review
  const handleView = (review) => {
    Swal.fire({
      title: `<span class="text-xl font-bold text-gray-900">${review.productName}</span>`,
      html: `
        <div class="text-left space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                ${review.reviewerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p class="font-semibold">${review.reviewerName}</p>
                <p class="text-sm text-gray-500">${review.reviewerEmail}</p>
              </div>
            </div>
            ${review.verifiedPurchase ? 
              '<span class="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Verified Purchase</span>' : 
              ''}
          </div>
          
          <div class="flex items-center gap-2">
            <div class="flex text-yellow-400">
              ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
            </div>
            <span class="font-bold">${review.rating}.0</span>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-gray-700">${review.comment}</p>
          </div>
          
          <div class="grid grid-cols-3 gap-4 text-center">
            <div class="bg-blue-50 p-3 rounded-lg">
              <p class="text-sm text-gray-600">Date</p>
              <p class="font-semibold">${review.date.toLocaleDateString()}</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <p class="text-sm text-gray-600">Likes</p>
              <p class="font-semibold">${review.likes}</p>
            </div>
            <div class="bg-red-50 p-3 rounded-lg">
              <p class="text-sm text-gray-600">Dislikes</p>
              <p class="font-semibold">${review.dislikes}</p>
            </div>
          </div>
        </div>
      `,
      width: 700,
      showCloseButton: true,
      confirmButtonColor: "#3b82f6",
      confirmButtonText: "Close",
      customClass: {
        popup: 'rounded-2xl',
        title: 'mb-4'
      }
    });
  };

  // Toggle review expansion
  const toggleExpand = (reviewId) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
                Customer Reviews
              </h1>
              <p className="text-gray-600">
                Manage and monitor customer feedback across all products
              </p>
            </div>
            <div className="badge badge-primary badge-lg px-4 py-3">
              <MdOutlineRateReview className="mr-2 text-lg" />
              {stats.total} Total Reviews
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Reviews</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <FiMessageSquare className="text-2xl text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white p-5 rounded-2xl shadow-lg border border-yellow-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg. Rating</p>
                  <h3 className="text-2xl font-bold text-yellow-600">{stats.averageRating}/5</h3>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <FiStar className="text-2xl text-yellow-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white p-5 rounded-2xl shadow-lg border border-green-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Verified</p>
                  <h3 className="text-2xl font-bold text-green-700">{stats.verified}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <FiThumbsUp className="text-2xl text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white p-5 rounded-2xl shadow-lg border border-purple-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">5★ Reviews</p>
                  <h3 className="text-2xl font-bold text-purple-600">{stats.fiveStar}</h3>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <FiStar className="text-2xl text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white p-5 rounded-2xl shadow-lg border border-orange-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">This Week</p>
                  <h3 className="text-2xl font-bold text-orange-600">{stats.recent}</h3>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl">
                  <FiTrendingUp className="text-2xl text-orange-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search reviews by product, email, or comment..."
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
                  Type: {filterType === 'all' ? 'All' : filterType}
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><button onClick={() => setFilterType("all")} className="py-2">All Reviews</button></li>
                  <li><button onClick={() => setFilterType("verified")} className="py-2">Verified Purchases</button></li>
                  <li><button onClick={() => setFilterType("unverified")} className="py-2">Unverified</button></li>
                </ul>
              </div>

              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-outline">
                  <FiStar className="mr-2" />
                  Rating: {selectedRating === 'all' ? 'All' : `${selectedRating}★`}
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><button onClick={() => setSelectedRating("all")} className="py-2">All Ratings</button></li>
                  <li><button onClick={() => setSelectedRating("5")} className="py-2">5 Stars</button></li>
                  <li><button onClick={() => setSelectedRating("4")} className="py-2">4 Stars & Above</button></li>
                  <li><button onClick={() => setSelectedRating("3")} className="py-2">3 Stars & Above</button></li>
                  <li><button onClick={() => setSelectedRating("2")} className="py-2">2 Stars & Above</button></li>
                  <li><button onClick={() => setSelectedRating("1")} className="py-2">1 Star</button></li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiMessageSquare />
            Customer Feedback ({filteredReviews.length})
          </h2>

          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                          {review.reviewerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{review.reviewerName}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MdOutlineEmail className="text-sm" />
                            {review.reviewerEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`text-lg ${
                                i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {review.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiPackage className="text-gray-400" />
                        <span className="font-medium text-gray-700">{review.productName}</span>
                        {review.verifiedPurchase && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <FiThumbsUp className="text-xs" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className={`text-gray-700 ${expandedReview !== review.id ? 'line-clamp-3' : ''}`}>
                        {review.comment}
                      </p>
                      {review.comment.length > 150 && (
                        <button
                          onClick={() => toggleExpand(review.id)}
                          className="text-primary hover:text-primary/80 text-sm font-medium mt-1 flex items-center gap-1"
                        >
                          {expandedReview === review.id ? 'Show less' : 'Read more'}
                          <FiChevronRight className={`transition-transform ${expandedReview === review.id ? 'rotate-90' : ''}`} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <AiOutlineLike className="text-lg" />
                          <span className="text-sm font-medium">{review.likes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <AiOutlineDislike className="text-lg" />
                          <span className="text-sm font-medium">{review.dislikes}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleView(review)}
                          className="btn btn-outline btn-sm btn-primary"
                        >
                          <FiEye className="mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                  <FiMessageSquare className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterType !== 'all' || selectedRating !== 'all'
                    ? "Try adjusting your search or filter criteria"
                    : "No customer reviews have been submitted yet"}
                </p>
                {(searchTerm || filterType !== 'all' || selectedRating !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterType("all");
                      setSelectedRating("all");
                    }}
                    className="btn btn-primary btn-outline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Rating Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviewsList.filter(r => r.rating === stars).length;
              const percentage = reviewsList.length > 0 ? (count / reviewsList.length) * 100 : 0;
              
              return (
                <div key={stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-20">
                    <span className="text-gray-700 font-medium">{stars}★</span>
                    <div className="flex">
                      {[...Array(stars)].map((_, i) => (
                        <FiStar key={i} className="text-yellow-400 fill-yellow-400 text-sm" />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="font-semibold text-gray-900">{count}</span>
                    <span className="text-sm text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SeeAllReviews;