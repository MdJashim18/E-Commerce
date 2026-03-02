import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FaUpload,
  FaDollarSign,
  FaWarehouse,
  FaTruck,
  FaUndo,
  FaGift,
  FaUserTie,
  FaBoxOpen,
  FaLayerGroup,
  FaClipboardCheck,
  FaChartLine,
  FaTags,
  FaBox,
  FaRuler,
  FaShieldAlt,
  FaIndustry,
  FaExchangeAlt,
  FaPercent,
  FaShoppingCart,
  FaWeightHanging,
  FaCube,
  FaShippingFast,
  FaMoneyBillWave,
  FaCalendarAlt
} from "react-icons/fa";
import {
  MdDescription,
  MdCategory,
  MdVideoLibrary,
  MdLocalOffer,
  MdModelTraining
} from "react-icons/md";
import { RiGalleryFill } from "react-icons/ri";
import { GiReturnArrow } from "react-icons/gi";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import axios from "axios";

const AddProducts = () => {
  const axiosSecure = UseAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("basic");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm();

  const regularPrice = watch("regularPrice");
  const discountPrice = watch("discountPrice");
  const stockQuantity = watch("stockQuantity");
  const flashSaleEndTime = watch("flashSaleEndTime");

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (regularPrice && discountPrice && discountPrice < regularPrice) {
      return Math.round(((regularPrice - discountPrice) / regularPrice) * 100);
    }
    return 0;
  };

  const sectionConfig = [
    { id: "basic", label: "Basic Info", icon: <FaClipboardCheck /> },
    { id: "media", label: "Media", icon: <FaUpload /> },
    { id: "category", label: "Category", icon: <MdCategory /> },
    { id: "pricing", label: "Pricing", icon: <FaDollarSign /> },
    { id: "inventory", label: "Inventory", icon: <FaWarehouse /> },
    { id: "shipping", label: "Shipping", icon: <FaTruck /> },
    { id: "specs", label: "Specifications", icon: <FaLayerGroup /> },
    { id: "offers", label: "Offers", icon: <FaGift /> },
    { id: "seller", label: "Seller", icon: <FaUserTie /> },
  ];

  const categoryOptions = {
    main: ["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Toys", "Automotive", "Health"],
    electronics: ["Mobile", "Laptop", "TV", "Audio", "Camera", "Accessories"],
    mobile: ["Smartphone", "Feature Phone", "Tablet", "Smart Watch"]
  };

  const shippingClasses = [
    "Standard Shipping",
    "Express Shipping",
    "Overnight Shipping",
    "Free Shipping",
    "International Shipping"
  ];

  const warrantyOptions = [
    "No Warranty",
    "1 Year Warranty",
    "2 Years Warranty",
    "3 Years Warranty",
    "Lifetime Warranty"
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Image upload logic
      const featuredImgFile = data.featuredImage[0];
      const galleryImgFiles = data.galleryImages;

      const formData = new FormData();
      formData.append("image", featuredImgFile);

      const imgBBurl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMAGE_HOST
      }`;

      const featuredUpload = await axios.post(imgBBurl, formData);
      const featuredImageURL = featuredUpload.data.data.url;

      const galleryURLs = [];
      if (galleryImgFiles && galleryImgFiles.length > 0) {
        for (let file of galleryImgFiles) {
          const fd = new FormData();
          fd.append("image", file);
          const gRes = await axios.post(imgBBurl, fd);
          galleryURLs.push(gRes.data.data.url);
        }
      }

      // Complete Product Data
      const ProductData = {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,

        media: {
          featuredImage: featuredImageURL,
          images: galleryURLs,
          videoUrl: data.videoUrl,
        },

        category: {
          main: data.categoryMain,
          sub: data.categorySub,
          child: data.categoryChild,
        },

        tags: data.tags?.split(",").map(tag => tag.trim()).filter(tag => tag) || [],

        brand: data.brand,

        pricing: {
          regularPrice: Number(data.regularPrice) || 0,
          discountPrice: Number(data.discountPrice) || 0,
          discountPercentage: calculateDiscount(),
          flashSalePrice: data.flashSalePrice ? Number(data.flashSalePrice) : null,
          bulkPrice: {
            minQty: Number(data.bulkQty) || 0,
            pricePerUnit: Number(data.bulkPrice) || 0,
          },
        },

        variants: [
          {
            variantId: data.variantId,
            color: data.color,
            size: data.size,
            material: data.material,
            weight: data.variantWeight,
            price: Number(data.variantPrice) || 0,
            stock: Number(data.variantStock) || 0,
          },
        ],

        inventory: {
          sku: data.sku,
          barcode: data.barcode,
          stockQuantity: Number(data.stockQuantity) || 0,
          stockStatus: Number(data.stockQuantity) > 0 ? "In Stock" : "Out Of Stock",
          lowStockAlert: Number(data.lowStockAlert) || 5,
          warehouseLocation: data.warehouseLocation,
        },

        shipping: {
          weight: data.shipWeight,
          dimensions: {
            length: data.shipLength,
            width: data.shipWidth,
            height: data.shipHeight,
          },
          shippingClass: data.shippingClass,
          deliveryChargeInsideCity: Number(data.deliveryChargeInsideCity) || 0,
          deliveryChargeOutsideCity: Number(data.deliveryChargeOutsideCity) || 0,
          freeShipping: data.freeShipping === "yes",
          cashOnDelivery: data.cod === "yes",
        },

        ratings: {
          averageRating: 0,
          totalReviews: 0,
          reviews: [],
        },

        analytics: {
          views: 0,
          soldCount: 0,
          addToCartCount: 0,
          wishlistCount: 0,
        },

        specification: {
          general: {
            model: data.model,
          },
          warranty: data.warranty,
          manufacturer: data.manufacturer,
        },

        offers: {
          buyOneGetOne: data.bogo === "yes",
          bundleOffer: null,
          quantityDiscount: [],
          emiAvailable: data.emiAvailable === "yes",
          flashSaleEndTime: data.flashSaleEndTime || null,
        },

        returnPolicy: {
          isReturnable: data.returnable === "yes",
          returnDays: Number(data.returnDays) || 7,
          replacementOnly: data.replacementOnly === "yes",
        },

        seller: [
          {
            sellerId: data.sellerId,
            name: data.sellerName,
            rating: Number(data.sellerRating) || 5,
            totalProducts: Number(data.sellerTotalProducts) || 0,
          },
        ],

        creator: {
          creatorName: data.creatorName,
          creatorEmail: data.creatorEmail,
        },

        status: "Published",
        createdAt: new Date(),
      };

      clearInterval(progressInterval);
      setUploadProgress(100);

      const res = await axiosSecure.post("/devices", ProductData);

      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Product Added Successfully!",
          text: `${data.title} has been added to your catalog.`,
          timer: 2000,
          showConfirmButton: false,
          background: "#10b981",
          color: "white",
        });
        reset();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add product",
        text: error.response?.data?.message || error.message,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "basic":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FaClipboardCheck /> Product Title *
                </span>
              </label>
              <input
                {...register("title", { 
                  required: "Product title is required",
                  minLength: { value: 3, message: "Title must be at least 3 characters" }
                })}
                className="input input-bordered w-full focus:ring-2 focus:ring-primary/30"
                placeholder="Enter product title"
              />
              {errors.title && (
                <span className="text-error text-sm mt-1">{errors.title.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Slug *</span>
                </label>
                <input
                  {...register("slug", { 
                    required: "Slug is required",
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message: "Slug must be lowercase with hyphens (e.g., product-name)"
                    }
                  })}
                  className="input input-bordered w-full"
                  placeholder="product-slug"
                />
                {errors.slug && (
                  <span className="text-error text-sm mt-1">{errors.slug.message}</span>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Brand *</span>
                </label>
                <input
                  {...register("brand", { required: "Brand is required" })}
                  className="input input-bordered w-full"
                  placeholder="Brand name"
                />
                {errors.brand && (
                  <span className="text-error text-sm mt-1">{errors.brand.message}</span>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <MdDescription /> Short Description
                </span>
              </label>
              <textarea
                {...register("shortDescription", { 
                  maxLength: { value: 200, message: "Maximum 200 characters" }
                })}
                className="textarea textarea-bordered h-24"
                placeholder="Brief description (will appear in product cards)"
              />
              {errors.shortDescription && (
                <span className="text-error text-sm mt-1">{errors.shortDescription.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Long Description</span>
              </label>
              <textarea
                {...register("longDescription")}
                className="textarea textarea-bordered h-32"
                placeholder="Detailed product description"
                rows="6"
              />
            </div>
          </motion.div>
        );

      case "media":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FaUpload /> Featured Image *
                </span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors bg-gray-50">
                <input
                  type="file"
                  {...register("featuredImage", { 
                    required: "Featured image is required",
                    validate: {
                      fileType: files => 
                        !files[0] || 
                        ['image/jpeg', 'image/png', 'image/webp'].includes(files[0].type) || 
                        "Only JPEG, PNG and WebP images are allowed",
                      fileSize: files => 
                        !files[0] || 
                        files[0].size <= 5 * 1024 * 1024 || 
                        "File size must be less than 5MB"
                    }
                  })}
                  className="file-input file-input-bordered w-full max-w-xs"
                  accept="image/*"
                />
                <p className="text-sm text-gray-500 mt-2">Main product image (Recommended: 800x800px, Max: 5MB)</p>
                {errors.featuredImage && (
                  <span className="text-error text-sm mt-2 block">{errors.featuredImage.message}</span>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <RiGalleryFill /> Gallery Images
                </span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <input
                  type="file"
                  multiple
                  {...register("galleryImages", {
                    validate: {
                      fileCount: files => 
                        !files || 
                        files.length <= 10 || 
                        "Maximum 10 images allowed",
                      fileType: files => 
                        !files || 
                        Array.from(files).every(file => 
                          ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
                        ) || 
                        "Only JPEG, PNG and WebP images are allowed"
                    }
                  })}
                  className="file-input file-input-bordered w-full max-w-xs"
                  accept="image/*"
                />
                <p className="text-sm text-gray-500 mt-2">Upload multiple images (max 10, Max: 5MB each)</p>
                {errors.galleryImages && (
                  <span className="text-error text-sm mt-2 block">{errors.galleryImages.message}</span>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <MdVideoLibrary /> Video URL (Optional)
                </span>
              </label>
              <input
                {...register("videoUrl", {
                  pattern: {
                    value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                    message: "Please enter a valid YouTube URL"
                  }
                })}
                className="input input-bordered w-full"
                placeholder="https://youtube.com/embed/..."
              />
              {errors.videoUrl && (
                <span className="text-error text-sm mt-1">{errors.videoUrl.message}</span>
              )}
            </div>
          </motion.div>
        );

      case "category":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <MdCategory /> Main Category *
                  </span>
                </label>
                <select
                  {...register("categoryMain", { required: "Main category is required" })}
                  className="select select-bordered w-full"
                  defaultValue=""
                >
                  <option value="" disabled>Select main category</option>
                  {categoryOptions.main.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.categoryMain && (
                  <span className="text-error text-sm mt-1">{errors.categoryMain.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sub Category</span>
                </label>
                <select
                  {...register("categorySub")}
                  className="select select-bordered w-full"
                  defaultValue=""
                >
                  <option value="">Select sub category</option>
                  {categoryOptions.electronics.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Child Category</span>
                </label>
                <select
                  {...register("categoryChild")}
                  className="select select-bordered w-full"
                  defaultValue=""
                >
                  <option value="">Select child category</option>
                  {categoryOptions.mobile.map(child => (
                    <option key={child} value={child}>{child}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FaTags /> Tags
                </span>
                <span className="label-text-alt">Separate with commas</span>
              </label>
              <input
                {...register("tags")}
                className="input input-bordered w-full"
                placeholder="electronics, smartphone, android, 5g"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {watch("tags")?.split(",").filter(tag => tag.trim()).map((tag, index) => (
                  <span key={index} className="badge badge-primary badge-outline">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "pricing":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Regular Price *</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("regularPrice", { 
                      required: "Regular price is required",
                      min: { value: 0, message: "Price must be positive" }
                    })}
                    className="input input-bordered w-full pl-8"
                    placeholder="0.00"
                  />
                </div>
                {errors.regularPrice && (
                  <span className="text-error text-sm mt-1">{errors.regularPrice.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Discount Price</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("discountPrice", { 
                      min: { value: 0, message: "Price must be positive" },
                      validate: value => 
                        !value || 
                        !regularPrice || 
                        value <= regularPrice || 
                        "Discount price must be less than regular price"
                    })}
                    className="input input-bordered w-full pl-8"
                    placeholder="0.00"
                  />
                </div>
                {errors.discountPrice && (
                  <span className="text-error text-sm mt-1">{errors.discountPrice.message}</span>
                )}
                {regularPrice && discountPrice && discountPrice < regularPrice && (
                  <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-green-700 text-lg">
                          {calculateDiscount()}% OFF
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          Save ${(regularPrice - discountPrice).toFixed(2)}
                        </p>
                      </div>
                      <FaPercent className="text-green-500 text-2xl" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Flash Sale Price</span>
                  {flashSaleEndTime && (
                    <span className="label-text-alt text-warning">Active until {new Date(flashSaleEndTime).toLocaleDateString()}</span>
                  )}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("flashSalePrice")}
                  className="input input-bordered w-full"
                  placeholder="Limited time offer"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Flash Sale End Time</span>
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="datetime-local"
                    {...register("flashSaleEndTime")}
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FaShoppingCart /> Bulk Pricing (Optional)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Minimum Quantity</span>
                  </label>
                  <input
                    type="number"
                    min="2"
                    {...register("bulkQty")}
                    className="input input-bordered w-full"
                    placeholder="e.g., 10"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bulk Price per Unit</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("bulkPrice")}
                      className="input input-bordered w-full pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "inventory":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">SKU *</span>
                </label>
                <input
                  {...register("sku", { required: "SKU is required" })}
                  className="input input-bordered w-full"
                  placeholder="PROD-001"
                />
                {errors.sku && (
                  <span className="text-error text-sm mt-1">{errors.sku.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Barcode</span>
                </label>
                <input
                  {...register("barcode")}
                  className="input input-bordered w-full"
                  placeholder="123456789012"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Stock Quantity *</span>
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("stockQuantity", { 
                    required: "Stock quantity is required",
                    min: { value: 0, message: "Cannot be negative" }
                  })}
                  className="input input-bordered w-full"
                  placeholder="100"
                />
                {errors.stockQuantity && (
                  <span className="text-error text-sm mt-1">{errors.stockQuantity.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Low Stock Alert</span>
                </label>
                <input
                  type="number"
                  min="1"
                  {...register("lowStockAlert")}
                  className="input input-bordered w-full"
                  placeholder="5"
                  defaultValue="5"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Warehouse Location</span>
              </label>
              <input
                {...register("warehouseLocation")}
                className="input input-bordered w-full"
                placeholder="Warehouse A, Shelf 3, Row 5"
              />
            </div>

            <div className={`p-4 rounded-lg ${stockQuantity > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold">Stock Status</h4>
                  <p className="text-sm">
                    {stockQuantity > 0 
                      ? `${stockQuantity} units available` 
                      : "Out of stock"}
                  </p>
                </div>
                <span className={`badge ${stockQuantity > 0 ? 'badge-success' : 'badge-error'}`}>
                  {stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </motion.div>
        );

      case "shipping":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaWeightHanging /> Weight (kg)
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("shipWeight")}
                  className="input input-bordered w-full"
                  placeholder="0.5"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Shipping Class</span>
                </label>
                <select
                  {...register("shippingClass")}
                  className="select select-bordered w-full"
                  defaultValue=""
                >
                  <option value="">Select shipping class</option>
                  {shippingClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FaCube /> Dimensions (cm)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Length</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    {...register("shipLength")}
                    className="input input-bordered w-full"
                    placeholder="20"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Width</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    {...register("shipWidth")}
                    className="input input-bordered w-full"
                    placeholder="15"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Height</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    {...register("shipHeight")}
                    className="input input-bordered w-full"
                    placeholder="10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaShippingFast /> Delivery Inside City
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("deliveryChargeInsideCity")}
                    className="input input-bordered w-full pl-8"
                    placeholder="5.00"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Delivery Outside City</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("deliveryChargeOutsideCity")}
                    className="input input-bordered w-full pl-8"
                    placeholder="10.00"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text flex items-center gap-2">
                    <FaShippingFast /> Free Shipping
                  </span>
                  <input
                    type="checkbox"
                    {...register("freeShipping")}
                    className="toggle toggle-primary"
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text flex items-center gap-2">
                    <FaMoneyBillWave /> Cash on Delivery
                  </span>
                  <input
                    type="checkbox"
                    {...register("cod")}
                    className="toggle toggle-primary"
                  />
                </label>
              </div>
            </div>
          </motion.div>
        );

      case "specs":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <MdModelTraining /> Model
                  </span>
                </label>
                <input
                  {...register("model")}
                  className="input input-bordered w-full"
                  placeholder="Model XYZ-2024"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaShieldAlt /> Warranty
                  </span>
                </label>
                <select
                  {...register("warranty")}
                  className="select select-bordered w-full"
                  defaultValue=""
                >
                  <option value="">Select warranty</option>
                  {warrantyOptions.map(warranty => (
                    <option key={warranty} value={warranty}>{warranty}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <FaIndustry /> Manufacturer
                </span>
              </label>
              <input
                {...register("manufacturer")}
                className="input input-bordered w-full"
                placeholder="Manufacturer name"
              />
            </div>
          </motion.div>
        );

      case "offers":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text flex items-center gap-2">
                    <FaGift /> Buy One Get One
                  </span>
                  <input
                    type="checkbox"
                    {...register("bogo")}
                    className="toggle toggle-primary"
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text flex items-center gap-2">
                    <FaMoneyBillWave /> EMI Available
                  </span>
                  <input
                    type="checkbox"
                    {...register("emiAvailable")}
                    className="toggle toggle-primary"
                  />
                </label>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <GiReturnArrow /> Return Policy
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Returnable</span>
                    <input
                      type="checkbox"
                      {...register("returnable")}
                      className="toggle toggle-primary"
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Return Days</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="365"
                    {...register("returnDays")}
                    className="input input-bordered w-full"
                    placeholder="7"
                    defaultValue="7"
                  />
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Replacement Only</span>
                    <input
                      type="checkbox"
                      {...register("replacementOnly")}
                      className="toggle toggle-primary"
                    />
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "seller":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Seller ID</span>
                </label>
                <input
                  {...register("sellerId")}
                  className="input input-bordered w-full"
                  placeholder="SELLER-001"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Seller Name *</span>
                </label>
                <input
                  {...register("sellerName", { required: "Seller name is required" })}
                  className="input input-bordered w-full"
                  placeholder="John Doe"
                />
                {errors.sellerName && (
                  <span className="text-error text-sm mt-1">{errors.sellerName.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Seller Rating (1-5)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  {...register("sellerRating")}
                  className="input input-bordered w-full"
                  placeholder="4.5"
                  defaultValue="5"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Total Products</span>
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("sellerTotalProducts")}
                  className="input input-bordered w-full"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4">Creator Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Creator Name</span>
                  </label>
                  <input
                    {...register("creatorName")}
                    className="input input-bordered w-full"
                    placeholder="Admin User"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Creator Email</span>
                  </label>
                  <input
                    type="email"
                    {...register("creatorEmail", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="input input-bordered w-full"
                    placeholder="admin@example.com"
                  />
                  {errors.creatorEmail && (
                    <span className="text-error text-sm mt-1">{errors.creatorEmail.message}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Add New Product
              </h1>
              <p className="text-gray-600 mt-2">Fill in the details to add a new product to your catalog</p>
            </div>
            <div className="badge badge-primary badge-lg px-4 py-3 shadow-md">
              <FaChartLine className="mr-2" />
              Advanced Form
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <FaLayerGroup /> Sections
              </h3>
              <div className="space-y-2">
                {sectionConfig.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg transform -translate-x-1"
                        : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 hover:shadow-md"
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium">{section.label}</span>
                    {activeSection === section.id && (
                      <motion.div
                        layoutId="activeSection"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Progress Bar */}
              {isSubmitting && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100"
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Uploading...</span>
                    <span className="font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-primary h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Stats Preview */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaClipboardCheck /> Quick Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount:</span>
                    <span className={`font-bold ${calculateDiscount() > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                      {calculateDiscount()}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="badge badge-success badge-sm">Published</span>
                  </div>
                  {regularPrice && discountPrice && discountPrice < regularPrice && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg mt-2">
                      <p className="text-sm font-semibold text-green-800">
                        Save ${(regularPrice - discountPrice).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                {/* Section Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 md:px-8 py-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {sectionConfig.find(s => s.id === activeSection)?.label}
                      </h2>
                      <p className="text-gray-600">Fill in the {activeSection} information</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Step</span>
                      <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {sectionConfig.findIndex(s => s.id === activeSection) + 1}/
                        {sectionConfig.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6 md:p-8">
                  {renderSection()}
                </div>

                {/* Form Actions */}
                <div className="bg-gray-50 px-6 md:px-8 py-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => reset()}
                        className="btn btn-outline btn-error btn-sm md:btn-md"
                        disabled={isSubmitting}
                      >
                        <FaUndo className="mr-2" />
                        Reset Form
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentIndex = sectionConfig.findIndex(s => s.id === activeSection);
                          if (currentIndex > 0) {
                            setActiveSection(sectionConfig[currentIndex - 1].id);
                          }
                        }}
                        className="btn btn-outline btn-sm md:btn-md"
                        disabled={activeSection === "basic" || isSubmitting}
                      >
                        Previous
                      </button>
                    </div>
                    
                    <div className="flex gap-3">
                      {activeSection !== sectionConfig[sectionConfig.length - 1].id ? (
                        <button
                          type="button"
                          onClick={() => {
                            const currentIndex = sectionConfig.findIndex(s => s.id === activeSection);
                            setActiveSection(sectionConfig[currentIndex + 1].id);
                          }}
                          className="btn btn-primary btn-sm md:btn-md"
                          disabled={isSubmitting}
                        >
                          Next Section
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg px-8 shadow-lg hover:shadow-xl transition-shadow"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="loading loading-spinner loading-sm"></span>
                              Adding Product...
                            </>
                          ) : (
                            <>
                              <FaBoxOpen className="mr-2" />
                              Add Product
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Quick Tips */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
            >
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">
                <FaClipboardCheck /> Quick Tips
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 p-1 rounded-full mt-1">
                    <span className="text-blue-600 text-sm">•</span>
                  </div>
                  <span>Use clear, high-quality product images (min 800x800px, max 5MB)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 p-1 rounded-full mt-1">
                    <span className="text-blue-600 text-sm">•</span>
                  </div>
                  <span>Include relevant tags for better searchability (separate with commas)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 p-1 rounded-full mt-1">
                    <span className="text-blue-600 text-sm">•</span>
                  </div>
                  <span>Set competitive pricing with clear discount structure</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 p-1 rounded-full mt-1">
                    <span className="text-blue-600 text-sm">•</span>
                  </div>
                  <span>Provide accurate shipping information for customer transparency</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddProducts;