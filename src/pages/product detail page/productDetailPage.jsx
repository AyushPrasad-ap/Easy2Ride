import "./productDetailPage.css";
import Header from "../../components/header/header";
import InputBox from "../../components/inputBox/inputBox";
import GlowBtn from "../../components/glow btn/glowBtn";
import CPD from "../../components/cancellation Policy dropdown/CPD";
import RatingCard from "../../components/rating card/ratingCard";
import LargeFooter from "../../components/LargeFooter/LargeFooter";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAreaSelected } from '../../context/AreaSelected';
import { useFirebase } from "../../context/firebase";
import { toast } from "react-toastify";
import { isVehicleAvailable } from "../../utils/bookingUtils";
import { Timestamp } from "firebase/firestore";


// importing images 
import infoIcon from "/images/interface icons/info icon.png";
import backIcon from "/images/interface icons/back icon.png";
import closeIcon from "/images/interface icons/close icon.svg";
import confettiIcon from "/images/icons/confetti_icon.png";
import filledStarIcon from "/images/icons/filled_star_icon.png";
import unfilledStarIcon from "/images/icons/unfilled_star_icon.png";
import locationIcon from "/images/icons/location_icon.png";


// Importing the CSS file for the loader animation
import "../../Animated Loaders/ThreeDotLoader.css";




function VehicleAvailabePopUp({ show, onClose, vid, date, quantity, fromTime, toTime, city, university }) {

    const navigate = useNavigate();

    // Create Date Objects
    const fromDate = new Date(`${date}T${fromTime}`);
    let toDate = new Date(`${date}T${toTime}`);
    let night = 0;

    // If toTime is less than fromTime, add 1 day
    if (toDate < fromDate) {
        toDate.setDate(toDate.getDate() + 1);
        night = 1;
    }

    // Format Date and Time
    const formattedFromDate = fromDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
    });
    const formattedToDate = toDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
    });

    const formattedFromTime = fromDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    const formattedToTime = toDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    return (
        <div className={`pdp-popup-container ${show ? "popup-active" : ""}`}>

            <img onClick={onClose} className="popup-close-btn" src={closeIcon} alt="closeBtn" />

            <h2 className="color-bluish">Vehicle Availabe</h2>
            <p>
                {formattedFromDate}, {formattedFromTime} to {formattedToDate}, {formattedToTime}
            </p>

            <img width={"15px"} src={confettiIcon} alt="confetti-icon" />
            <span> THE TRIP IS ON</span>
            <img width={"15px"} src={confettiIcon} alt="confetti-icon" />


            <GlowBtn
                onClick={() => navigate(`/checkout?vid=${encodeURIComponent(vid)}&quantity=${encodeURIComponent(quantity)}&date=${encodeURIComponent(date)}&night=${encodeURIComponent(night)}&fromTime=${encodeURIComponent(fromTime)}&toTime=${encodeURIComponent(toTime)}&city=${encodeURIComponent(city)}&university=${encodeURIComponent(university)}`)}
                text="Book Now" width="150px" height="40px" color="var(--bluish)" glow="false" borderRadius="10px" style={{ display: "block", margin: "25px auto 0 auto" }}
            />

        </div>
    );
}

function VehicleNotAvailabePopUp({ show, onClose, city, university }) {

    const navigate = useNavigate();

    return (
        <div className={`pdp-popup-container ${show ? "popup-active" : ""}`}>

            <img onClick={onClose} className="popup-close-btn" src={closeIcon} alt="close-btn" />

            <h2 className="color-redish">Not Availabe</h2>
            <p>Try for some other time slot!</p>
            {/* <p>Vehicle will be available on <br /> March 3, 2025 - 7pm</p> */}

            <GlowBtn
                onClick={() => navigate(`/home?city=${encodeURIComponent(city)}&university=${encodeURIComponent(university)}`)}
                text="Browse other vehicles" width="200px" height="40px" color="var(--bluish)" glow="false" borderRadius="10px" style={{ display: "block", margin: "25px auto 0 auto" }}
            />

        </div>
    );
}


function ProductDetailPage() {

    const { vid } = useParams();
    const navigate = useNavigate();
    const AreaSelected = useAreaSelected();
    const firebase = useFirebase();

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const city = AreaSelected.cityContext || params.get('city');
    const university = AreaSelected.universityContext || params.get('university');


    // updating the context values of city and university. {when the pages reloads, context values are lost, but the url values are not lost. So, I am updating the context values with the url values.}
    useEffect(() => {
        if (!AreaSelected.cityContext && params.get('city')) {
            AreaSelected.setCityContext(params.get('city'));
        }

        if (!AreaSelected.universityContext && params.get('university')) {
            AreaSelected.setUniversityContext(params.get('university'));
        }
    }, []);



    // State to store input values
    const [date, setDate] = useState("");
    const [quantity, setQuantity] = useState("");
    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");

    // State to control tooltip visibility
    const [showDistanceTooltip, setShowDistanceTooltip] = useState(false);
    const [showPriceTooltip, setShowPriceTooltip] = useState(false);

    // State to control popup visibility
    const [showAvailablePopup, setShowAvailablePopup] = useState(false);
    const [showNotAvailablePopup, setShowNotAvailablePopup] = useState(false);

    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [shopLocation, setShopLocation] = useState("");

    const [loading, setLoading] = useState(false);
    const [availabilityLoader, setAvailabilityLoader] = useState(false);


    const today = new Date().toISOString().split('T')[0];  //Eg: "2025-04-20"


    // Dummy data for user reviews to list👇🏻
    // (AFTER THE BACKEND AND DATABASE ARE CONNECTED...  I HAVE TO REPLACE THIS DUMMY DATA WITH ACTUAL DATA FROM THE DATABASE USING API CALLS)
    const reviews = [
        {
            user: "Devarsh",
            rating: "4",
            timeAgo: "2",
            reviewText: "Easy2Ride's booking process is seamless and intuitive. I found the perfect scooter in seconds, paid securely with Razorpay, and got instant confirmation. The UI is clean and performance is flawless!"
        },
        {
            user: "Vraj",
            rating: "5",
            timeAgo: "30",
            reviewText: "Fantastic experience! The vehicle options are well-categorized, real-time availability checks save time, and the payment flow is effortless. Customer support was responsive when I had a query. Highly recommend Easy2Ride!"
        },
        {
            user: "Ayush",
            rating: "3",
            timeAgo: "100",
            reviewText: "Love Easy2Ride! The site loads quickly, the map-based pickup details are super handy, and cancellation policies are transparent. Booking, payment, and email confirmations all worked without a hitch. Will use again!"
        }
    ];




    // Fetching the vehicle document and setting it to selectedVehicle
    useEffect(() => {
        setLoading(true);
        const fetchVehicleDetails = async () => {
            if (!city || !university || !vid) return;

            try {
                // collection path is a “nested” path
                const collectionPath = `vehicles/${city}/${university}`;
                const vehicle = await firebase.getFirestoreData(collectionPath, vid);
                setSelectedVehicle(vehicle);
            } catch (error) {
                console.error("Failed to fetch vehicle details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleDetails();
    }, [city, university, vid]);

    // fetching the shop of the vehicle using ownerShopId
    useEffect(() => {
        setLoading(true);
        const fetchShopLocation = async () => {
            // ownerShopID comes straight from the vehicle doc
            const shopID = selectedVehicle?.ownerShopID;
            if (!shopID) return;

            try {
                const shopDoc = await firebase.getFirestoreData("shops", shopID);
                setShopLocation(shopDoc?.location || "");
            } catch (error) {
                console.error("Failed to fetch shop location:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShopLocation();
    }, [selectedVehicle]);


    // Handles the case where vehicle isn't found {depending on the loading state}
    if (!selectedVehicle && loading == false) {
        return (
            <div className="pdp-container">
                <Header />
                <div className="pdp-vehicle-not-found">
                    <h2>Vehicle not found</h2>
                    <p>Sorry, we couldn't find the vehicle you're looking for.</p>
                    <GlowBtn
                        text="Back to Home"
                        onClick={() => navigate(`/home?city=${encodeURIComponent(city)}&university=${encodeURIComponent(university)}`)}
                        color="var(--bluish)"
                        glow="false"
                        borderRadius="10px"
                    />
                </div>
                <LargeFooter />
            </div>
        );
    }
    else if (!selectedVehicle && loading == true) {
        return (
            <div
                className="three-dot-loader"
                style={{
                    margin: "50vh auto",
                    "--dot-color": "rgba(48, 48, 48)"
                }}>
            </div>
        );
    }

    // assigning the selected vehicle data to variables
    const vehicleName = selectedVehicle.name;
    const vehicleRating = selectedVehicle.rating;
    const vehicleReview = selectedVehicle.reviews;
    const baseAmt = selectedVehicle.baseAmt;
    const vehicleRate = selectedVehicle.rate;
    const owner = selectedVehicle.owner;
    const vehicleImage = selectedVehicle.image;

    const vehicleImageUrl = new URL(vehicleImage, import.meta.url).href;


    // Function to handle "Check Availability" button click
    const handleCheckAvailability = async () => {

        if (!date || !quantity || !fromTime || !toTime) {
            toast.info("Please fill all the fields.");
            return;
        }

        if (quantity < 1) {
            toast.info("Min booking quantity is 1");
            return;
        }

        if (fromTime == toTime) {
            toast.info(
                <>
                    Rent duration is 0 Hrs.<br />
                    Select valid timings.
                </>
            );
            return;
        }


        // if the time selected is less than 1 hour then i want to show a toast message saying "Minimum booking duration is 1 hour"
        // Combine date and times into full datetime strings
        const fromDateTime = new Date(`${date}T${fromTime}`);
        let toDateTime = new Date(`${date}T${toTime}`);
        // if overnight booking
        if (toDateTime <= fromDateTime) {
            toDateTime.setDate(toDateTime.getDate() + 1);
        }

        //Enforce minimum 1‑hour booking
        const diffMinutes = (toDateTime - fromDateTime) / (1000 * 60);
        if (diffMinutes < 60) {
            toast.info(
                <>
                    Minimum booking duration is<br /> 1 hour
                </>
            );
            return;
        }


        const fromTimestamp = Timestamp.fromDate(fromDateTime);
        const toTimestamp = Timestamp.fromDate(toDateTime);

        try {
            setAvailabilityLoader(true);
            // Check real availability via bookingUtils
            const available = await isVehicleAvailable(
                vid,
                fromTimestamp,
                toTimestamp
            );

            if (available) {
                setShowAvailablePopup(true);
            } else {
                setShowNotAvailablePopup(true);
            }

        } catch (err) {
            console.error("Error checking availability:", err);
            toast.error("Could not check availability. Please try again.");
        } finally {
            setAvailabilityLoader(false);
        }

    };

    const closePopup = () => {
        setShowAvailablePopup(false);
        setShowNotAvailablePopup(false);
    };




    return (
        <div className="pdp-container">

            <VehicleAvailabePopUp
                show={showAvailablePopup}
                onClose={closePopup}
                date={date}
                quantity={quantity}
                fromTime={fromTime}
                toTime={toTime}
                vid={vid}
                city={city}
                university={university}
            />

            <VehicleNotAvailabePopUp
                show={showNotAvailablePopup}
                onClose={closePopup}
                city={city}
                university={university}
            />


            {/* 👆🏻 */}

            <Header />

            <div className="pdp-body">
                <img
                    onClick={() => navigate(`/home?city=${encodeURIComponent(city)}&university=${encodeURIComponent(university)}`)}
                    width={"30px"} style={{ cursor: 'pointer' }} src={backIcon} alt="back icon"
                />

                <div className="pdp-vehicle-detail">
                    <img width={"100%"} src={vehicleImageUrl} alt="vehicle-image" />
                    <h2>{vehicleName}</h2>

                    <div className="pdp-rating-review">
                        <div className="pdp-rating">
                            {vehicleRating}
                            {[...Array(5)].map((_, index) => (
                                <img
                                    key={index}
                                    src={
                                        index < Math.floor(vehicleRating)
                                            ? filledStarIcon
                                            : unfilledStarIcon
                                    }
                                    alt={index < Math.floor(vehicleRating) ? "filled-star" : "unfilled-star"}
                                />
                            ))}
                        </div>
                        <div id="color-bluish" onClick={() => document.getElementById("rating-and-review")?.scrollIntoView({ behavior: "smooth" })}>{vehicleReview} Reviews</div>
                    </div>
                </div>

                <div className="pdp-input-section">
                    <div className="pdp-inputs">
                        <InputBox
                            width={"100%"}
                            // style={{ maxWidth: "300px" }}
                            typeName="date"
                            labelName="Date"
                            value={date}
                            onChange={(val) => setDate(val)}
                            minSelection={today}
                        />
                        <InputBox
                            width={"100%"}
                            // style={{ maxWidth: "300px" }}
                            typeName="number"
                            labelName="Quantity"
                            value={quantity}
                            onChange={(val) => setQuantity(Number(val))}
                        />
                        <InputBox
                            width={"100%"}
                            // style={{ maxWidth: "300px" }}
                            typeName="time"
                            labelName="From"
                            value={fromTime}
                            onChange={(val) => setFromTime(val)}
                        />
                        <InputBox
                            width={"100%"}
                            // style={{ maxWidth: "300px" }}
                            typeName="time"
                            labelName="To"
                            value={toTime}
                            onChange={(val) => setToTime(val)}
                        />
                    </div>



                    <div className="pdp-info">
                        {/* Distance Tooltip */}
                        <div className="pdp-info-inner">
                            Distance limit
                            <img
                                id="distance-hover-info"
                                src={infoIcon}
                                alt="info-icon"
                                onMouseEnter={() => setShowDistanceTooltip(true)}
                                onMouseLeave={() => setShowDistanceTooltip(false)}
                                onClick={() => setShowDistanceTooltip(!showDistanceTooltip)} // Toggle on click
                            />
                            {/* Tooltip for Distance */}
                            {showDistanceTooltip && (
                                <div className="pdp-tooltip">
                                    Distance limit is 100km.
                                    <br /><br />
                                    ₹10 will be added <br /> on every extra 1km
                                </div>
                            )}
                        </div>

                        {/* Price Tooltip */}
                        <div className="pdp-info-inner">
                            <span className="more-letter-spacing">₹{vehicleRate}/hr</span>
                            <img
                                id="price-hover-info"
                                src={infoIcon}
                                alt="info-icon"
                                onMouseEnter={() => setShowPriceTooltip(true)}
                                onMouseLeave={() => setShowPriceTooltip(false)}
                                onClick={() => setShowPriceTooltip(!showPriceTooltip)} // Toggle on click
                            />
                            {/* Tooltip for Price */}
                            {showPriceTooltip && (
                                <div className="pdp-tooltip">
                                    Base Price is ₹{baseAmt}.
                                    <br /><br />
                                    ₹{vehicleRate} will be added <br /> for every hour.
                                </div>
                            )}
                        </div>
                    </div>



                    {/* Check Availability Button */}
                    <div className="checkAvailability-btn">
                        <GlowBtn
                            text="Check Availability"
                            borderRadius="10px"
                            color="var(--bluish)"
                            glow="false"
                            height="40px"
                            style={{ width: "80%", maxWidth: "300px" }}
                            onClick={handleCheckAvailability}
                            loading={{ state: availabilityLoader, text: "Checking" }}
                        />
                    </div>
                </div>

                <div className="pdp-pickup-location">
                    Pickup Location:
                    <a
                        href={shopLocation}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: '10px' }}
                    >
                        <span>
                            {owner}
                            <img src={locationIcon} alt="location-icon" />
                        </span>
                    </a>
                </div>

                <div className="pdp-terms-condition">
                    <p>Terms and Condition</p>
                    <ul>
                        <li>Required Documents: Original Aadhaar Card and Original Driving License. One original ID must be presented and may be submitted during vehicle pickup.</li>
                        <li>Document Presentation: The rider is required to present all original documents at the time of vehicle pickup.</li>
                        <li>Vehicle Damage Liability: In the event of any damage to the vehicle, the customer is responsible for paying the repair charges as determined by the Authorized Service Center.</li>
                        <li>Geographical Restriction: The scooter is not permitted to be taken outside of Jaipur.</li>
                        <li>Document Photocopy: A photocopy of one original ID (either the Driving License or Aadhaar Card) is required.</li>
                        <li>Fuel Policy: The scooter must be returned with the same amount of fuel as it had at the time of pickup.</li>
                    </ul>
                </div>

                <div className="pdp-separator"></div>

                <CPD />

                <div className="pdp-separator2"></div>

                <div className="pdp-review-section">
                    <h3 id="rating-and-review">Rating & Reviews</h3>

                    <div className="pdp-reviews">
                        {reviews.map((review, index) => (
                            <RatingCard
                                key={index}
                                user={review.user}
                                rating={review.rating}
                                timeAgo={review.timeAgo}
                                review={review.reviewText}
                            />
                        ))}
                    </div>
                </div>

            </div>

            <LargeFooter />
        </div>
    );
}

export default ProductDetailPage;