import React from 'react';
import { FaRocket, FaShieldAlt, FaTruck, FaHeadset, FaSyncAlt, FaChartLine } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaRocket className="text-3xl text-blue-600" />,
      title: "Fast Delivery",
      description: "Get your products delivered within 24-48 hours in major cities",
      gradient: "from-blue-50 to-blue-100"
    },
    {
      icon: <FaShieldAlt className="text-3xl text-green-600" />,
      title: "Secure Payments",
      description: "100% secure payment gateway with SSL encryption",
      gradient: "from-green-50 to-green-100"
    },
    {
      icon: <FaTruck className="text-3xl text-purple-600" />,
      title: "Free Shipping",
      description: "Free shipping on all orders above $50",
      gradient: "from-purple-50 to-purple-100"
    },
    {
      icon: <FaHeadset className="text-3xl text-orange-600" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support via chat, email, and phone",
      gradient: "from-orange-50 to-orange-100"
    },
    {
      icon: <FaSyncAlt className="text-3xl text-teal-600" />,
      title: "Easy Returns",
      description: "30-day return policy with hassle-free returns",
      gradient: "from-teal-50 to-teal-100"
    },
    {
      icon: <FaChartLine className="text-3xl text-indigo-600" />,
      title: "Quality Guaranteed",
      description: "100% quality checked products with warranty",
      gradient: "from-indigo-50 to-indigo-100"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Store?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide the best shopping experience with premium features and services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;