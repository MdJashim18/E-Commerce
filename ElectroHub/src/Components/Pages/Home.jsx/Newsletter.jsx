import React, { useState } from 'react';
import { FaEnvelope, FaCheckCircle, FaRocket } from 'react-icons/fa';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate API call
      setTimeout(() => {
        setIsSubscribed(true);
        setEmail('');
        
        // Reset after 3 seconds
        setTimeout(() => setIsSubscribed(false), 3000);
      }, 1000);
    }
  };

  const benefits = [
    "Exclusive discounts and offers",
    "Early access to new products",
    "Weekly shopping tips",
    "Seasonal trend reports",
    "Members-only sales"
  ];

  return (
    <section className="py-16 bg-gray-50 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
              <FaEnvelope className="text-3xl" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated with Our Newsletter
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join 50,000+ subscribers who receive our weekly updates, exclusive offers, and shopping tips.
            </p>
          </div>

          {isSubscribed ? (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-center">
              <FaCheckCircle className="text-5xl mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Welcome to Our Community!</h3>
              <p className="text-lg">
                Thank you for subscribing. Check your email for a welcome gift.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <FaEnvelope className="absolute right-4 top-3.5 text-gray-400" />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="privacy"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        required
                      />
                      <label htmlFor="privacy" className="ml-2 text-sm">
                        I agree to receive emails and accept the privacy policy
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
                    >
                      <FaRocket />
                      Subscribe Now
                    </button>
                  </form>
                </div>
              </div>

              <div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-6">
                    Subscriber Benefits
                  </h3>
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-gray-300">Active subscribers receiving our weekly updates</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;