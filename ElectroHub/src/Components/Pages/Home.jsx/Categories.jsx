import React from 'react';
import { Link } from 'react-router';
import { FaTshirt, FaLaptop, FaUtensils, FaHome, FaBook, FaBaby } from 'react-icons/fa';

const Categories = () => {
  const categories = [
    {
      id: 1,
      icon: <FaTshirt className="text-4xl" />,
      name: "Fashion",
      items: "1200+ Products",
      color: "bg-gradient-to-r from-pink-500 to-rose-500",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400"
    },
    {
      id: 2,
      icon: <FaLaptop className="text-4xl" />,
      name: "Electronics",
      items: "850+ Products",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w-400"
    },
    {
      id: 3,
      icon: <FaUtensils className="text-4xl" />,
      name: "Kitchen & Dining",
      items: "950+ Products",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w-400"
    },
    {
      id: 4,
      icon: <FaHome className="text-4xl" />,
      name: "Home Decor",
      items: "1100+ Products",
      color: "bg-gradient-to-r from-purple-500 to-violet-500",
      image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w-400"
    },
    {
      id: 5,
      icon: <FaBook className="text-4xl" />,
      name: "Books & Media",
      items: "5000+ Products",
      color: "bg-gradient-to-r from-amber-500 to-orange-500",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w-400"
    },
    {
      id: 6,
      icon: <FaBaby className="text-4xl" />,
      name: "Baby & Kids",
      items: "700+ Products",
      color: "bg-gradient-to-r from-sky-500 to-blue-500",
      image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w-400"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Categories
            </h2>
            <p className="text-gray-600">
              Discover products from our curated categories
            </p>
          </div>
          <Link
            to="/categories"
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className={`${category.color} h-48 relative`}>
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                <div className="absolute top-6 left-6">
                  <div className="bg-white bg-opacity-90 p-3 rounded-lg">
                    {category.icon}
                  </div>
                </div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-white text-opacity-90">
                    {category.items}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;