import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './DetailPage.module.css';

const SampleNextArrow = (props) => {
    const { className, onClick } = props;
    return (
        <div className={`${className} ${styles.nextArrow}`} onClick={onClick}>
            &#10095; 
        </div>
    );
};

const SamplePrevArrow = (props) => {
    const { className, onClick } = props;
    return (
        <div className={`${className} ${styles.prevArrow}`} onClick={onClick}>
            &#10094; 
        </div>
    );
};

function DetailsPage({ realEstates = [], agents = [], removeCard, cities: initialCities }) {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minArea, setMinArea] = useState('');
    const [maxArea, setMaxArea] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState(initialCities);
    const [formData, setFormData] = useState({ region_id: '' });
    const [fetchedRealEstates, setFetchedRealEstates] = useState(realEstates);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1); // Track the current page
    const observerRef = useRef(null); // Ref for the observer

    // Fetch regions from API
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await axios.get('https://api.real-estate-manager.redberryinternship.ge/api/regions', {
                    headers: { 'accept': 'application/json' },
                });
                setRegions(response.data);
            } catch (error) {
                console.error('Error fetching regions:', error);
            }
        };
        fetchRegions();
    }, []);

    // Fetch cities from API
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('https://api.real-estate-manager.redberryinternship.ge/api/cities', {
                    headers: { 'accept': 'application/json' },
                });
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        fetchCities();
    }, []);

    // Infinite scroll effect
    useEffect(() => {
        const loadMoreData = async () => {
            if (isLoading) return; // Prevent multiple requests
            setIsLoading(true);
            try {
                const response = await axios.get(`https://api.real-estate-manager.redberryinternship.ge/api/real-estates?page=${page}`, {
                    headers: { 'accept': 'application/json' },
                });
                setFetchedRealEstates((prev) => [...prev, ...response.data]);
                setPage((prev) => prev + 1); 
            } catch (error) {
                console.error('Error fetching real estates:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMoreData();
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [isLoading, page]);

    const filteredRealEstates = useMemo(() => {
        return fetchedRealEstates.filter((estate) => {
            const price = parseInt(estate.price, 10);
            const area = parseFloat(estate.area);
            const isInPriceRange = (minPrice ? price >= parseInt(minPrice, 10) : true) &&
                                   (maxPrice ? price <= parseInt(maxPrice, 10) : true);
            const isInAreaRange = (minArea ? area >= parseFloat(minArea) : true) &&
                                   (maxArea ? area <= parseFloat(maxArea) : true);
            const matchesBedrooms = (bedrooms ? estate.bedrooms === parseInt(bedrooms, 10) : true);
            const matchesRegion = (formData.region_id ? estate.city.region_id === parseInt(formData.region_id, 10) : true);

            return isInPriceRange && isInAreaRange && matchesBedrooms && matchesRegion;
        });
    }, [fetchedRealEstates, minPrice, maxPrice, minArea, maxArea, bedrooms, formData.region_id]);

    const { id } = useParams();
    const navigate = useNavigate();
    const [estate, setEstate] = useState(null);
    const [agent, setAgent] = useState(null);

    useEffect(() => {
        const fetchedEstate = fetchedRealEstates.find((estate) => estate.id === parseInt(id));
        if (fetchedEstate) {
            setEstate(fetchedEstate);
            const fetchedAgent = agents.find((agent) => agent.id === fetchedEstate.agent_id);
            setAgent(fetchedAgent);
        }
    }, [id, fetchedRealEstates, agents]);

    const handleDelete = async () => {
        try {
            await axios.delete(`https://api.real-estate-manager.redberryinternship.ge/api/real-estates/${id}`, {
                headers: { 'Authorization': 'Bearer 9d0ddfbb-cb6e-4617-b2f0-8480f96d7b37' },
            });
            alert('Card deleted successfully');
            removeCard(parseInt(id));
            navigate('/');
        } catch (error) {
            console.error('Error deleting card:', error.response ? error.response.data : error.message);
            alert('Error deleting card. Please try again.');
        }
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };

    if (!estate) {
        return <p>Loading...</p>;
    }
    const cityName = cities && cities.length > 0
    ? cities.find((city) => city.id === estate.city_id)?.name || 'ქალაქი ვერ მოიძებნა'
    : 'ქალაქი ვერ მოიძებნა';


    return (
        <div className={styles.details}>
            <Link className={styles.backArrow} to='/'>
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="currentColor" className="bi bi-arrow-left-short" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
                </svg>
            </Link>
            <div className={styles.estateDetails}>
                <img src={estate.image} alt={estate.description} className={styles.estateImg} />
                <div className={styles.priceDetails}>
                    <h3>{estate.description}</h3>
                    <p className={styles.price}>{estate.price} ₾</p>
                    <p className={styles.greyText}> {cityName}, {estate.address} {estate.address}</p>
                    <p className={styles.greyText}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 16C0 16.5304 0.210714 17.0391 0.585786 17.4142C0.960859 17.7893 1.46957 18 2 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V2C18 1.46957 17.7893 0.960859 17.4142 0.585786C17.0391 0.210714 16.5304 0 16 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V16ZM9 3H15V9H13V5H9V3ZM3 9H5V13H9V15H3V9Z" fill="#021526" fillOpacity="0.5"/>
                        </svg> ფართობი {estate.area} მ²
                    </p>
                    <p className={styles.greyText}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                            <path d="M80-200v-240q0-27 11-49t29-39v-112q0-50 35-85t85-35h160q23 0 43 8.5t37 23.5q17-15 37-23.5t43-8.5h160q50 0 85 35t35 85v112q18 17 29 39t11 49v240h-80v-80H160v80H80Zm440-360h240v-80q0-17-11.5-28.5T720-680H560q-17 0-28.5 11.5T520-640v80Zm-320 0h240v-80q0-17-11.5-28.5T400-680H240q-17 0-28.5 11.5T200-640v80Zm-40 200h640v-80q0-17-11.5-28.5T760-480H200q-17 0-28.5 11.5T160-440v80Zm640 0H160h640Z"/>
                        </svg>
                        საძინებელი {estate.bedrooms}
                    </p>
                    <p className={styles.greyText}><svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_54001_390)">
<path d="M11.0172 0.338139C10.808 0.554674 10.6905 0.848379 10.6904 1.15465V4.14122H5.11507C4.81934 4.14122 4.53571 4.2629 4.3266 4.47948C4.11748 4.69607 4 4.98982 4 5.29612V9.91571C4 10.222 4.11748 10.5158 4.3266 10.7323C4.53571 10.9489 4.81934 11.0706 5.11507 11.0706H10.6904V18H12.9206V11.0706H16.859C17.0225 11.0705 17.1839 11.0333 17.3319 10.9614C17.4799 10.8896 17.6108 10.7849 17.7154 10.6548L19.8709 7.97548C19.9543 7.87172 20 7.74095 20 7.60591C20 7.47088 19.9543 7.34011 19.8709 7.23635L17.7154 4.55698C17.6108 4.42691 17.4799 4.32225 17.3319 4.2504C17.1839 4.17856 17.0225 4.14128 16.859 4.14122H12.9206V1.15465C12.9206 0.926271 12.8551 0.703031 12.7326 0.513154C12.6101 0.323278 12.4359 0.175289 12.2322 0.0878981C12.0285 0.000506892 11.8043 -0.0223635 11.588 0.0221781C11.3718 0.0667197 11.1731 0.176673 11.0172 0.338139Z" fill="#021526" fill-opacity="0.5" shape-rendering="crispEdges"/>
<path d="M11.1904 4.64122H10.6904H5.11507C4.95772 4.64122 4.80311 4.7058 4.6863 4.82678C4.56891 4.94836 4.5 5.11688 4.5 5.29612V9.91571C4.5 10.095 4.56891 10.2635 4.6863 10.3851C4.80311 10.506 4.95772 10.5706 5.11507 10.5706H10.6904H11.1904V11.0706V17.5H12.4206V11.0706V10.5706H12.9206H16.8588C16.8589 10.5706 16.859 10.5706 16.859 10.5706C16.9463 10.5705 17.0331 10.5507 17.1135 10.5116C17.1941 10.4725 17.2668 10.4149 17.3258 10.3415L17.3258 10.3414L19.4812 7.66214L11.1904 4.64122ZM11.1904 4.64122V4.14122M11.1904 4.64122V4.14122M11.1904 4.14122V1.15476C11.1904 1.15472 11.1904 1.15469 11.1904 1.15465C11.1905 0.975465 11.2594 0.807016 11.3768 0.685491C11.464 0.595176 11.573 0.535771 11.6889 0.5119C11.8047 0.488056 11.9249 0.500126 12.0351 0.547404C12.1455 0.594777 12.2428 0.676245 12.3125 0.784262C12.3823 0.892426 12.4206 1.02136 12.4206 1.15465C12.4206 1.15469 12.4206 1.15472 12.4206 1.15476V4.14122V4.64122H12.9206H16.8588C16.8589 4.64122 16.859 4.64122 16.859 4.64122C16.9463 4.64128 17.0331 4.66117 17.1135 4.7002C17.1941 4.73929 17.2668 4.79697 17.3258 4.87033L17.3258 4.87039M11.1904 4.14122L17.3258 4.87039M17.3258 4.87039L19.4812 7.54969L17.3258 4.87039ZM19.5 7.60591C19.5 7.6287 19.4922 7.6485 19.4813 7.66208V7.54975C19.4922 7.56333 19.5 7.58312 19.5 7.60591Z" stroke="black" shape-rendering="crispEdges"/>
</g>
<defs>
<filter id="filter0_d_54001_390" x="0" y="0" width="24" height="26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_54001_390"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_54001_390" result="shape"/>
</filter>
</defs>
</svg>საფოსტო ინდექსი  {estate.zip_code}</p>
<div className={styles.descr}>fdsf
<p>{estate.description}</p>
</div>

<div className={styles.agent}>
    <div className={styles.agentImg}></div>
    <div className={styles.agentName}>
        <p>asdasda</p>
        <p>აგენტი</p>
        <div className={styles.info}>
            <p>email.com</p>
            <p>13123131</p>
        </div>
      </div>
      
</div>
                    <button onClick={handleDelete} className={styles.deleteButton}>ლისტინგის წაშლა</button>
                </div>
            </div>
            <h2>Related Listings</h2>
            <Slider {...settings} className={styles.carousel}>
            {filteredRealEstates.length > 0 ? (
                filteredRealEstates.map((estate) => (
                    <Link key={estate.id} to={`/details/${estate.id}`} className={styles.card}>
                        <div className={styles.cardPhoto}>
                            <img src={estate.image} alt={estate.address} />
                        </div>
                        <div className={styles.cardDetails}>
                            
                        </div>
                    </Link>
                ))
            ) : (
                <p>აღნიშნული მონაცემებით განცხადება არ იძებნება</p>
            )}
        </Slider>

        </div>
    );
}

export default DetailsPage;
