import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaUsers, FaBox, FaTrophy } from "react-icons/fa";
import { CountUp } from "react-countup";

const Statistics = () => {
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const element = document.getElementById("statistics");
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect(); // run only once
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: <FaShoppingCart className="text-4xl" />,
      value: 15000,
      suffix: "+",
      label: "Orders Delivered",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: <FaUsers className="text-4xl" />,
      value: 500,
      suffix: "K+",
      label: "Happy Customers",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: <FaBox className="text-4xl" />,
      value: 10000,
      suffix: "+",
      label: "Products Available",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: <FaTrophy className="text-4xl" />,
      value: 150,
      suffix: "+",
      label: "Awards Won",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <section
      id="statistics"
      className="py-16 bg-gradient-to-br from-gray-900 to-black text-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Journey in Numbers
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Years of excellence reflected in our achievements
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300"
            >
              <div
                className={`${stat.bgColor} ${stat.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                {stat.icon}
              </div>

              <div className="text-4xl md:text-5xl font-bold mb-2">
                {startCount ? (
                  <CountUp
                    start={0}
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    suffix={stat.suffix}
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>

              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Extra Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="text-3xl font-bold text-blue-400">98%</div>
            <div className="text-gray-300">Customer Satisfaction</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-green-400">24/7</div>
            <div className="text-gray-300">Support Availability</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-purple-400">500+</div>
            <div className="text-gray-300">Cities Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
