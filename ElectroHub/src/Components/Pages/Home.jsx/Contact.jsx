import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaShippingFast, FaCreditCard, FaExchangeAlt, FaHeadset, FaShieldAlt, FaLaptop, FaTools } from 'react-icons/fa';
import { MdSupportAgent, MdComputer, MdPhoneIphone, MdHeadset, MdSmartphone, MdTv } from 'react-icons/md';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Message sent successfully!');
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
    };

    const contactInfo = [
        { 
            icon: <FaPhone />, 
            title: 'Customer Support', 
            info: '+880 1992-578305', 
            desc: 'Mon-Sat, 9am-10pm',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        { 
            icon: <FaEnvelope />, 
            title: 'Sales & Inquiry', 
            info: 'sales@electronix.com', 
            desc: '24/7 Email Support',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        { 
            icon: <FaMapMarkerAlt />, 
            title: 'Service Center', 
            info: '123 Tech Street, Dhaka', 
            desc: 'Visit for repairs',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        }
    ];

    const productCategories = [
        {
            icon: <FaLaptop className="text-2xl" />,
            title: "Laptops & Computers",
            support: "Hardware troubleshooting, OS installation, performance optimization"
        },
        {
            icon: <MdSmartphone className="text-2xl" />,
            title: "Smartphones & Tablets",
            support: "Screen repair, battery replacement, software updates"
        },
        {
            icon: <MdTv className="text-2xl" />,
            title: "TVs & Monitors",
            support: "Display issues, connectivity problems, warranty claims"
        },
        {
            icon: <MdHeadset className="text-2xl" />,
            title: "Audio Devices",
            support: "Sound quality, connectivity, firmware updates"
        },
        {
            icon: <FaTools className="text-2xl" />,
            title: "Accessories",
            support: "Compatibility issues, setup assistance, warranty service"
        },
        {
            icon: <MdComputer className="text-2xl" />,
            title: "Gaming Gear",
            support: "Performance tuning, driver updates, RGB setup"
        }
    ];

    const faqCategories = [
        {
            title: 'Product Support & Warranty',
            questions: [
                { 
                    q: 'What is covered under warranty?', 
                    a: 'Our warranty covers manufacturing defects, hardware failures, and performance issues for 1-3 years depending on the product category. Accidental damage and physical abuse are not covered.'
                },
                { 
                    q: 'How do I claim warranty service?', 
                    a: 'Register your product online with the serial number, then contact our support team with proof of purchase. We offer doorstep pickup for repair services.'
                },
            ]
        },
        {
            title: 'Shipping & Delivery',
            questions: [
                { 
                    q: 'What are the delivery charges?', 
                    a: 'Free shipping on all orders above ৳5,000. For orders below this amount, delivery charges are ৳150 within Dhaka and ৳250-৳500 for other cities.'
                },
                { 
                    q: 'How long does delivery take?', 
                    a: 'Dhaka: 1-2 business days. Other divisional cities: 3-5 business days. District areas: 5-7 business days.'
                },
                { 
                    q: 'Do you offer same-day delivery?', 
                    a: 'Yes, same-day delivery is available in Dhaka city for orders placed before 2 PM. Additional charges apply.'
                },
            ]
        },
        {
            title: 'Technical Support',
            questions: [
                { 
                    q: 'How do I get technical assistance?', 
                    a: 'Call our technical support hotline at 09678-ELECTRONIX (353876649), use live chat on our website, or email techsupport@electronix.com'
                },
                { 
                    q: 'What are your service center hours?', 
                    a: 'Our service centers are open from 10 AM to 7 PM, Saturday to Thursday. Friday: 3 PM to 7 PM.'
                },
                { 
                    q: 'Do you offer remote technical support?', 
                    a: 'Yes, we provide remote desktop support for software issues and setup assistance for a nominal fee.'
                },
            ]
        },
        {
            title: 'Payment & Returns',
            questions: [
                { 
                    q: 'What payment methods do you accept?', 
                    a: 'We accept cash on delivery, credit/debit cards, bKash, Nagad, Rocket, and bank transfers. EMI options available for orders above ৳10,000.'
                },
                { 
                    q: 'What is your return policy?', 
                    a: '7-day easy return policy for unopened products. 14-day replacement policy for defective items. Returns are subject to inspection.'
                },
                { 
                    q: 'How long do refunds take to process?', 
                    a: 'Refunds are processed within 7-10 business days. Cash on delivery refunds via bank transfer, online payments refunded to original payment method.'
                },
            ]
        },
        {
            title: 'Product Installation & Setup',
            questions: [
                { 
                    q: 'Do you offer installation services?', 
                    a: 'Yes, professional installation is available for TVs, home theaters, networking equipment, and smart home devices. Installation charges vary by product.'
                },
                { 
                    q: 'Can you help with software setup?', 
                    a: 'We provide free basic software setup for all computers and laptops purchased from us. Advanced setup services are available for a fee.'
                },
                { 
                    q: 'Do you offer data transfer services?', 
                    a: 'Yes, we offer data migration services when you purchase a new computer or upgrade your storage. Service charges apply.'
                },
            ]
        },
        {
            title: 'Bulk & Corporate Orders',
            questions: [
                { 
                    q: 'Do you offer corporate discounts?', 
                    a: 'Yes, we provide special pricing for corporate and bulk orders. Contact our corporate sales team at corporate@electronix.com for custom quotes.'
                },
                { 
                    q: 'What about warranty for bulk orders?', 
                    a: 'Extended warranty and priority support available for corporate clients. We also offer on-site support packages.'
                },
                { 
                    q: 'Can you customize products for corporate needs?', 
                    a: 'Yes, we offer customized configurations, branding, and volume licensing for software products.'
                },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-800 text-white py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1920')] opacity-10 bg-cover"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6">Electronix Support Center</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Premium electronics, exceptional support. We're here to help with all your tech needs
                    </p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-16 px-4 -mt-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {contactInfo.map((item, index) => (
                            <div key={index} className={`${item.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                                <div className="flex items-start gap-4">
                                    <div className={`${item.iconColor} text-2xl`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                                        <p className="text-gray-800 font-medium text-lg mt-1">{item.info}</p>
                                        <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Category Support */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Product Category Support</h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            Get specialized support for your specific electronics products
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {productCategories.map((category, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="text-blue-600">
                                        {category.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">{category.title}</h3>
                                        <p className="text-gray-600 text-sm">{category.support}</p>
                                        <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                                            Get Support <FaPaperPlane className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support Features */}
            <section className="py-16 px-4 bg-blue-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Support Features</h2>
                        <p className="text-gray-600 text-lg">Comprehensive support for all your electronics needs</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl p-6 text-center shadow-md">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                <FaShippingFast className="text-2xl text-blue-600" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Free Shipping</h3>
                            <p className="text-gray-600 text-sm">On orders above ৳5,000</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-6 text-center shadow-md">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <FaShieldAlt className="text-2xl text-green-600" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Extended Warranty</h3>
                            <p className="text-gray-600 text-sm">Up to 3 years coverage</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-6 text-center shadow-md">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                                <FaExchangeAlt className="text-2xl text-purple-600" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Easy Returns</h3>
                            <p className="text-gray-600 text-sm">14-day replacement guarantee</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-6 text-center shadow-md">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                                <FaHeadset className="text-2xl text-amber-600" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">24/7 Support</h3>
                            <p className="text-gray-600 text-sm">Phone, email & chat support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="md:flex">
                            {/* Form Side */}
                            <div className="md:w-2/3 p-8 md:p-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                                <p className="text-gray-600 mb-8">Our team will get back to you within 24 hours</p>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="+880 1XXX-XXXXXX"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Subject *
                                            </label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="product_inquiry">Product Inquiry</option>
                                                <option value="technical_support">Technical Support</option>
                                                <option value="warranty_claim">Warranty Claim</option>
                                                <option value="order_support">Order Support</option>
                                                <option value="corporate_sales">Corporate Sales</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="5"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Please describe your issue or inquiry in detail..."
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaPaperPlane />
                                        Send Message
                                    </button>
                                </form>
                            </div>
                            
                            {/* Info Side */}
                            <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-indigo-700 text-white p-8 md:p-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <MdSupportAgent className="text-3xl" />
                                    <h3 className="text-xl font-bold">Quick Response</h3>
                                </div>
                                
                                <ul className="space-y-4 mb-8">
                                    <li className="flex justify-between items-center pb-3 border-b border-blue-500">
                                        <span className="text-blue-100">Email Response</span>
                                        <span className="font-semibold">Within 24 hours</span>
                                    </li>
                                    <li className="flex justify-between items-center pb-3 border-b border-blue-500">
                                        <span className="text-blue-100">Phone Support</span>
                                        <span className="font-semibold">5-10 minutes</span>
                                    </li>
                                    <li className="flex justify-between items-center pb-3 border-b border-blue-500">
                                        <span className="text-blue-100">Live Chat</span>
                                        <span className="font-semibold">Instant</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-blue-100">Emergency Support</span>
                                        <span className="font-semibold">Priority Queue</span>
                                    </li>
                                </ul>
                                
                                <div className="bg-blue-800 bg-opacity-30 rounded-xl p-4">
                                    <h4 className="font-bold mb-2">Business Hours</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span>Saturday - Thursday</span>
                                            <span>9:00 AM - 10:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Friday</span>
                                            <span>3:00 PM - 10:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Holidays</span>
                                            <span>Limited Support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-600 text-lg">Quick answers to common questions about our electronics products and services</p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {faqCategories.slice(0, 3).map((category, catIndex) => (
                            <div key={catIndex} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FaHeadset className="text-blue-600" />
                                    </div>
                                    {category.title}
                                </h3>
                                <div className="space-y-4">
                                    {category.questions.map((item, itemIndex) => (
                                        <div key={itemIndex} className="border-b border-gray-100 pb-4 last:border-0">
                                            <h4 className="font-semibold text-gray-800 mb-2">{item.q}</h4>
                                            <p className="text-gray-600 text-sm">{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        {faqCategories.slice(3).map((category, catIndex) => (
                            <div key={catIndex} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FaCreditCard className="text-green-600" />
                                    </div>
                                    {category.title}
                                </h3>
                                <div className="space-y-4">
                                    {category.questions.map((item, itemIndex) => (
                                        <div key={itemIndex} className="border-b border-gray-100 pb-4 last:border-0">
                                            <h4 className="font-semibold text-gray-800 mb-2">{item.q}</h4>
                                            <p className="text-gray-600 text-sm">{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-12">
                        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            View All FAQ Questions
                        </button>
                    </div>
                </div>
            </section>

            {/* Service Centers */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Service Centers</h2>
                        <p className="text-gray-600 text-lg">Visit our authorized service centers across Bangladesh</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FaMapMarkerAlt className="text-blue-600 text-xl" />
                                <h3 className="font-bold text-lg">Dhaka Service Center</h3>
                            </div>
                            <p className="text-gray-700 mb-2">House #123, Road #456, Gulshan 1</p>
                            <p className="text-gray-600 text-sm mb-4">Beside Gulshan 2 Circle, Dhaka 1212</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Phone: 02-XXXXXXX</span>
                                <span className="text-sm text-blue-600 font-medium">Open Today</span>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FaMapMarkerAlt className="text-green-600 text-xl" />
                                <h3 className="font-bold text-lg">Chittagong Center</h3>
                            </div>
                            <p className="text-gray-700 mb-2">Agrabad CDA Avenue, Chittagong</p>
                            <p className="text-gray-600 text-sm mb-4">Opposite Standard Chartered Bank</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Phone: 031-XXXXXX</span>
                                <span className="text-sm text-green-600 font-medium">Open Today</span>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FaMapMarkerAlt className="text-purple-600 text-xl" />
                                <h3 className="font-bold text-lg">Sylhet Center</h3>
                            </div>
                            <p className="text-gray-700 mb-2">Zindabazar Main Road, Sylhet</p>
                            <p className="text-gray-600 text-sm mb-4">Near Al Hamra Shopping Center</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Phone: 0821-XXXXX</span>
                                <span className="text-sm text-purple-600 font-medium">Open Today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// শুধু একবার export default করুন
export default Contact;