// Dummy data: universityOptions




import "./homePage.css"
import Header from "../../components/header/header";
import SearchBar from "../../components/searchBar/searchBar";
import FilterDropdown from "../../components/filter dropdown/filterDropdown";
import VehicleCard from "../../components/vehicle card/vehicleCard";
import LargeFooter from "../../components/LargeFooter/LargeFooter";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import { useAreaSelected } from '../../context/AreaSelected';
import { toast } from "react-toastify";

// Importing the CSS file for the loader animation
import "../../Animated Loaders/ThreeDotLoader.css";
// import { s } from "framer-motion/client";



function FilterBtn({ text, isActive, onClick }) {
    return (
        <button
            className={`hp-filter-btn ${isActive ? 'filter-active' : ''}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}


function HomePage() {

    const firebase = useFirebase();
    const navigate = useNavigate();
    const AreaSelected = useAreaSelected();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const searchValue = params.get('searchValue');
    const city = AreaSelected.cityContext || params.get('city');
    const university = AreaSelected.universityContext || params.get('university');


    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVehicleName, setSelectedVehicleName] = useState(null);
    const [selectedCity, setSelectedCity] = useState(city);
    const [selectedUniversity, setSelectedUniversity] = useState(university);
    const [vehicle_data, set_vehicle_data] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    // updating the context values of city and university. {when the pages reloads, context values are lost, but the url values are not lost. So, I am updating the context values with the url values.}
    useEffect(() => {
        if (!AreaSelected.cityContext && params.get('city')) {
            AreaSelected.setCityContext(params.get('city'));
        }

        if (!AreaSelected.universityContext && params.get('university')) {
            AreaSelected.setUniversityContext(params.get('university'));
        }
    }, []);


    useEffect(() => {
        if (searchValue) {
            setSearchQuery(searchValue);
        }
    }, [searchValue]);


    // Fetching vehicle data from the database
    useEffect(() => {
        const fetchVehicles = async () => {
            setIsLoading(true);
            try {
                if (!selectedCity || !selectedUniversity) return;

                const city = selectedCity;
                const university = selectedUniversity;

                const colPath = `vehicles/${city}/${university}`;
                const snapshot = await firebase.getAllFirestoreDocs(colPath);

                set_vehicle_data(snapshot); // snapshot is an array of vehicle objects
            } catch (error) {
                console.error("Faileddddd to fetch vehicle data:", error);
            }
            finally {
                setIsLoading(false); // Set loading to false after fetching data

                // // For debugging purposes
                // console.log(`Querying path: vehicles/${selectedCity}/${selectedUniversity}`);
                // console.log("Vehicle Data:", vehicleData);
            }
        };

        fetchVehicles();

    }, [selectedCity, selectedUniversity]);




    const universityOptions = {
        Jaipur: [
            'Manipal University Jaipur',
            'MNIT Jaipur',
            'Jaipur Engineering College',
            'Amity University Jaipur'
        ],
        Delhi: [
            'IIT Delhi',
            'NIT Delhi',
            'DTU, Delhi'
        ],
        Bangalore: [
            'IIT Bangalore',
            'MSRIT Bangalore'
        ],
        Mumbai: [
            'IIT Bombay',
            'DJ Sanghvi College',
            'NMIMS College'
        ]
    };


    // this is a call back function which is passed to the vehicle card component and when the user clicks on the book now button then this function will be called.
    const handleBookNow = ({ vehicleName }) => {
        setSelectedVehicleName(vehicleName === selectedVehicleName ? null : vehicleName);
    };

    const handleShopSelect = async (vehicleName, shopOwner) => {
        const selectedVehicle = vehicle_data.find(
            v => v.name === vehicleName && v.owner.toLowerCase() === shopOwner.toLowerCase()
        );


        // checking whether the user profile has a phone number and name value
        try {
            setIsLoading(true);

            const user = await firebase.getData(`users/${firebase.currentUser.uid}`);
            if (!user || !user.phone?.trim() || !user.name?.trim()) {
                toast.error("Please update your profile with a valid phone number and name before booking.");
                return;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }



        if (!selectedVehicle) {
            console.warn("Vehicle not found for:", vehicleName, shopOwner);
            return;
        }

        if (selectedVehicle) {
            // Navigating to the product detail page with the selected vehicle ID
            navigate(`/product-detail/${selectedVehicle.id}?city=${encodeURIComponent(selectedCity)}&university=${encodeURIComponent(selectedUniversity)}`);  // id is the vehicle id in the database (vid)

        }
    };

    const filter_options = [
        'All',
        'Kumawat',
        'Right Bite',
        'Food Trolly',
        'Black Pearl',
        'Mama PG',
    ];


    // Step 1: Apply filters and search (i.e. Filter vehicles based on active filter and search query)
    const tempFiltered = vehicle_data.filter(vehicle => {
        const matchesFilter = activeFilter === 'All' ||
            vehicle.owner.toLowerCase() === activeFilter.toLowerCase();

        const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFilter && matchesSearch;
    });
    // Step 2: Deduplicate by vehicle name (i.e. Ensure each vehicle is shown only once)
    const filteredVehicles = Object.values(
        tempFiltered.reduce((acc, vehicle) => {
            if (!acc[vehicle.name]) {
                acc[vehicle.name] = vehicle;
            }
            return acc;
        }, {})
    );


    return (
        <div className="home-page-container">
            <div className="hp-header">
                <Header />
            </div>

            <div className="hp-body">

                {/* seachbar and filters */}
                <div className="search-section">

                    <div className="hp-area-selection">
                        {/* City dropdown */}
                        <select
                            className="hp-city-dropdown hp-dropdown"
                            value={selectedCity || "Jaipur"} // Default to Jaipur if selectedCity is null
                            onChange={(e) => {
                                const newCity = e.target.value;

                                if (newCity !== "Jaipur") {
                                    toast.info("Coming soon 🤩");
                                    // Keep Jaipur as the selected city
                                    setSelectedCity("Jaipur");
                                } else {
                                    setSelectedCity(newCity);

                                    // Reset university selection when city changes
                                    setSelectedUniversity(null);
                                }
                            }}
                        >
                            {/* Map through the keys of universityOptions to get all cities */}
                            {Object.keys(universityOptions).map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>

                        {/* University dropdown */}
                        <select
                            className="hp-university-dropdown hp-dropdown"
                            value={selectedUniversity || "Manipal University Jaipur"} // Default to Manipal University, Jaipur if selectedUniversity is null
                            onChange={(e) => {
                                const newUniversity = e.target.value;

                                if (newUniversity !== "Manipal University, Jaipur" && newUniversity !== "") {
                                    toast.info("Coming soon 🤩");
                                    // Keep the previously selected university or reset to null
                                    setSelectedUniversity(selectedUniversity);
                                } else {
                                    setSelectedUniversity(newUniversity);
                                }
                            }}
                        >
                            <option value="">Select University</option>
                            {/* Map through universities of the selected city */}
                            {selectedCity &&
                                universityOptions[selectedCity].map((university) => (
                                    <option key={university} value={university}>
                                        {university}
                                    </option>
                                ))
                            }
                        </select>
                    </div>


                    <div id="top">
                        <SearchBar width={"100%"} onSearch={setSearchQuery} value={searchQuery} />
                        <FilterDropdown />
                    </div>

                    <div id="bottom">
                        {filter_options.map((option) => (
                            <FilterBtn
                                key={option}
                                text={option}
                                isActive={activeFilter === option}
                                onClick={() => setActiveFilter(option)}
                            />
                        ))}
                    </div>
                </div>


                {/* showing the vehicles */}
                <div className="list-section">

                    {isLoading ? (
                        <div className="three-dot-loader" style={{ marginTop: "50px" }}></div>
                    )
                        :
                        //(After loading is complete) Below I am displaying vehicles as per the filters applied and the search query
                        filteredVehicles.length > 0 ? (
                            filteredVehicles.map((vehicle, index) => (
                                <div key={index}>
                                    <VehicleCard
                                        imgSrc={vehicle.image}
                                        vehicleName={vehicle.name}
                                        ratingCount={vehicle.rating}
                                        reviewCount={vehicle.reviews}
                                        owner={vehicle.owner}
                                        onBookNow={handleBookNow}
                                    />

                                    {/* Render dropdown ONLY under the selected card */}
                                    {selectedVehicleName === vehicle.name && (
                                        <div className="hp-shop-dropdown">
                                            <h4>Select a shop</h4>

                                            {
                                                [...new Set(
                                                    vehicle_data
                                                        .filter(v => v.name === vehicle.name)
                                                        .map(v => v.owner)
                                                )].map((shop, idx) => (
                                                    <p key={idx} onClick={() => handleShopSelect(vehicle.name, shop)}>
                                                        {shop}
                                                    </p>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            ))
                        )
                            :
                            (
                                <h1 className="hp-not-available">Not Available</h1>
                            )}

                </div>


            </div>

            <div className="hp-footer">
                <LargeFooter />
            </div>
        </div >
    );
}

export default HomePage;