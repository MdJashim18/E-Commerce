import React from 'react';
import Banner from '../Banner/Banner';
import ShowProducts from '../../Products/ShowProducts';
import Footer from '../../../Footer/Footer';
import { Link } from 'react-router';
import AdvertisementSection from '../AdvertisementSection/AdvertisementSection';
import Features from '../Features';
import Services from '../Services';
import Categories from '../Categories';
import Highlights from '../Highlights';
import Statistics from '../Statistics';
import Testimonials from '../Testimonials';
import Blogs from '../Blogs';
import Newsletter from '../Newsletter';




const Home = () => {
    return (
        <div className='w-[99%]  mx-auto'>
            <Banner></Banner>
            <ShowProducts></ShowProducts>
            <div className='flex justify-center my-5'>
                <Link to='/AllProducts' className='btn btn-success'>Show All</Link>
            </div>
            <Features></Features>
            <Services></Services>
            {/* <Categories></Categories> */}
            <Highlights></Highlights>
            {/* <Statistics></Statistics> */}
            <Testimonials></Testimonials>
            <Blogs></Blogs>
            {/* <Newsletter></Newsletter> */}
            <AdvertisementSection></AdvertisementSection>
        </div>
    );
};

export default Home;
