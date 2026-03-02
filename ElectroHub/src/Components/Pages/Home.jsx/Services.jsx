import React from 'react';
import { FaGift, FaBusinessTime, FaHandsHelping, FaMedal, FaShoppingBasket, FaBoxOpen } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      icon: <FaGift className="text-3xl" />,
      title: "Gift Wrapping",
      description: "Free gift wrapping service for all orders",
      color: "text-pink-600"
    },
    {
      icon: <FaBusinessTime className="text-3xl" />,
      title: "Bulk Orders",
      description: "Special discounts for bulk purchases",
      color: "text-blue-600"
    },
    {
      icon: <FaHandsHelping className="text-3xl" />,
      title: "Personal Shopper",
      description: "Personal shopping assistance available",
      color: "text-green-600"
    },
    {
      icon: <FaMedal className="text-3xl" />,
      title: "Premium Membership",
      description: "Exclusive benefits for premium members",
      color: "text-yellow-600"
    },
    {
      icon: <FaShoppingBasket className="text-3xl" />,
      title: "Subscription Box",
      description: "Monthly curated subscription boxes",
      color: "text-purple-600"
    },
    {
      icon: <FaBoxOpen className="text-3xl" />,
      title: "Same Day Dispatch",
      description: "Orders placed before 2PM dispatched same day",
      color: "text-indigo-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Premium Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enhance your shopping experience with our exclusive services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`${service.color} mb-6`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <a
                href="#"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;