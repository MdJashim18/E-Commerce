import React from 'react';
import about from '../../../assets/about.png'

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-6">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">About Electronix</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Your trusted destination for premium electronics, cutting-edge gadgets, and exceptional tech solutions.
                    </p>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    
                    {/* Text Content */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Who We Are</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Welcome to Electronix — Bangladesh's premier online destination for the latest electronics, 
                            smart devices, and innovative tech products. We are dedicated to bringing you authentic, 
                            high-performance electronics from world-renowned brands and emerging innovators. 
                            From smartphones to smart homes, we've got every aspect of your digital life covered.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Our mission is to bridge the gap between cutting-edge technology and everyday life. 
                            We strive to make advanced electronics accessible, affordable, and understandable for everyone. 
                            Through quality products, expert guidance, and reliable after-sales support, we aim to 
                            empower our customers with technology that enhances their lives.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800">Why Choose Electronix?</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 text-lg">
                            <li>Authentic Products with Manufacturer Warranty</li>
                            <li>Wide Range of Latest Electronics & Gadgets</li>
                            <li>Expert Technical Support & Installation Services</li>
                            <li>Secure Payment & Easy EMI Options</li>
                            <li>Fast Delivery Across Bangladesh</li>
                            <li>7-Day Return & 14-Day Replacement Policy</li>
                            <li>Dedicated After-Sales Service Centers</li>
                            <li>Genuine Customer Reviews & Ratings</li>
                        </ul>
                    </div>

                    {/* Image Section */}
                    <div>
                        <img 
                            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                            alt="Electronics Collection"
                            className="rounded-3xl shadow-lg w-full h-[400px] object-cover"
                        />
                        <div className="mt-4 grid grid-cols-3 gap-2">
                            <img 
                                src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                                alt="Laptops"
                                className="rounded-lg h-24 object-cover"
                            />
                            <img 
                                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                                alt="Smartphones"
                                className="rounded-lg h-24 object-cover"
                            />
                            <img 
                                src="https://images.unsplash.com/photo-1600003263720-95b45a4035d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                                alt="Audio Devices"
                                className="rounded-lg h-24 object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Product Categories */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Product Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl text-center hover:bg-blue-100 transition-colors">
                            <div className="text-blue-600 font-bold mb-2">📱</div>
                            <h3 className="font-semibold">Smartphones</h3>
                            <p className="text-sm text-gray-600">Latest models & accessories</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl text-center hover:bg-green-100 transition-colors">
                            <div className="text-green-600 font-bold mb-2">💻</div>
                            <h3 className="font-semibold">Laptops & PCs</h3>
                            <p className="text-sm text-gray-600">For work, gaming & creativity</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors">
                            <div className="text-purple-600 font-bold mb-2">🎮</div>
                            <h3 className="font-semibold">Gaming Gear</h3>
                            <p className="text-sm text-gray-600">Consoles, accessories & more</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-xl text-center hover:bg-amber-100 transition-colors">
                            <div className="text-amber-600 font-bold mb-2">🎧</div>
                            <h3 className="font-semibold">Audio Devices</h3>
                            <p className="text-sm text-gray-600">Headphones, speakers & soundbars</p>
                        </div>
                    </div>
                </div>

                {/* Tech Innovation Section */}
                <div className="mt-14 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Driven by Innovation</h2>
                            <p className="text-gray-600 text-lg mb-4">
                                At Electronix, we're not just selling products – we're delivering experiences. 
                                Our team constantly researches emerging technologies to bring you the most 
                                innovative and reliable electronics available in the market.
                            </p>
                            <div className="flex items-center space-x-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">5000+</div>
                                    <div className="text-sm text-gray-600">Products</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">50+</div>
                                    <div className="text-sm text-gray-600">Brands</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">1M+</div>
                                    <div className="text-sm text-gray-600">Happy Customers</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-3">Our Commitment</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span className="text-gray-600">100% Genuine Products</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span className="text-gray-600">Extended Warranty Options</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span className="text-gray-600">Professional Installation Services</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span className="text-gray-600">Nationwide Service Network</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Team Message */}
                <div className="mt-10 text-center">
                    <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
                        <span className="text-3xl">👨‍💻</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">From Our Tech Team</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        "We believe technology should work for you, not the other way around. 
                        That's why we test every product, write honest reviews, and provide 
                        expert advice to help you make the perfect choice."
                    </p>
                    <div className="mt-4">
                        <p className="font-semibold text-gray-700">Mohammad Jashim Uddin</p>
                        <p className="text-sm text-gray-500">Chief Technology Officer</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;