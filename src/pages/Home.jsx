import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getHomePageData } from '../features/homepageSlice';
import HeroCarousel from "../components/HeroCarousel";

const Home = () => {
    const dispatch= useDispatch();
    const {data: homepageData, loading, error } = useSelector(
        (state) => state.homepage

    )
    useEffect(() => {
        dispatch(getHomePageData());
    }, [dispatch])

    if(loading) {
        return(
            <div className="container mx-auto px-4 mt-4 text-center">
                <p>Loading homepage data...</p>
            </div>
        )
    }
    if(error) {
        return(
            <div className="container mx-auto px-4 mt-4 text-center">
                <p>Error: {error}</p>
            </div>
        )
    }
    const images = homepageData?.carousel || [];



    return (

        <div className="container mx-auto px-4">
            {/* TODO: carousel */}
            <HeroCarousel images= {images} />

            {/* welcome header */}
            <section className="mt-10 mb-16 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900">Welcome to Shopverse</h1>
                <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">Discover the latest trends, offers and top-notch products, all in one place.</p>
                <Link
                    to="/products"
                    className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-brand-600/20 transition-colors"
                >
                    Shop now
                </Link>
            </section>
        </div>
    );
};

export default Home;
