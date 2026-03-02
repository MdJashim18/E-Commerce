import React from 'react';
import { Link } from 'react-router';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Essential Products for Your Home Office",
      excerpt: "Discover must-have items to create a productive and comfortable home office setup that boosts your efficiency.",
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
      date: "Nov 15, 2024",
      author: "John Smith",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Sustainable Shopping: How to Make Eco-Friendly Choices",
      excerpt: "Learn practical tips for making environmentally conscious purchasing decisions without compromising on quality.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      date: "Nov 10, 2024",
      author: "Emma Wilson",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Top 10 Essential Products for Your Home Office",
      excerpt: "Discover must-have items to create a productive and comfortable home office setup that boosts your efficiency.",
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
      date: "Nov 15, 2024",
      author: "John Smith",
      readTime: "5 min read"
    },
    {
      id: 4,
      title: "Kitchen Essentials Every Home Cook Needs",
      excerpt: "Upgrade your cooking experience with these essential kitchen tools and gadgets that make meal prep easier.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      date: "Oct 28, 2024",
      author: "David Brown",
      readTime: "8 min read"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest From Our Blog
            </h2>
            <p className="text-gray-600">
              Tips, trends, and insights from our experts
            </p>
          </div>
          <Link
            to="/blog"
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            View All Posts <FaArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                    Featured
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUser />
                    <span>{post.author}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group"
                  >
                    Read More
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div> */}
              </div>
            </article>
          ))}
        </div>

        {/* <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="mb-6 opacity-90">
              Get weekly updates on new products, special offers, and blog posts
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Blogs;