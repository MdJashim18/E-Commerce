import React from 'react';
import { FaStar, FaAward, FaShippingFast, FaUserFriends } from 'react-icons/fa';

const Highlights = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Store Highlights
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            What makes us different from other online stores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-start gap-6">
              <div className="bg-blue-100 p-4 rounded-xl">
                <FaStar className="text-3xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Customer Satisfaction
                </h3>
                <p className="text-gray-600 mb-4">
                  With over 95% customer satisfaction rate, we ensure every shopping 
                  experience is memorable. Our dedicated support team is always ready 
                  to assist you.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                  <div className="text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="inline" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-start gap-6">
              <div className="bg-green-100 p-4 rounded-xl">
                <FaAward className="text-3xl text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Award Winning Service
                </h3>
                <p className="text-gray-600 mb-4">
                  Recognized as the "Best Online Retailer 2023" by E-commerce 
                  Association. We maintain the highest standards of quality and service.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Best Retailer 2023
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Quality Excellence
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-start gap-6">
              <div className="bg-purple-100 p-4 rounded-xl">
                <FaShippingFast className="text-3xl text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Fast & Reliable Delivery
                </h3>
                <p className="text-gray-600 mb-4">
                  We deliver to over 500+ cities across the country with 99.7% 
                  on-time delivery rate. Our logistics network ensures your 
                  order reaches you safely and quickly.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gray-900">24-48</div>
                  <div className="text-gray-600">Hours Delivery</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-start gap-6">
              <div className="bg-amber-100 p-4 rounded-xl">
                <FaUserFriends className="text-3xl text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Growing Community
                </h3>
                <p className="text-gray-600 mb-4">
                  Join our community of 500,000+ happy customers. We value 
                  relationships and strive to build long-term connections 
                  with our customers.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-gray-900">500K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Highlights;