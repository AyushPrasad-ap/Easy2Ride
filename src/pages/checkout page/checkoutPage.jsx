import "./checkoutPage.css";
import Header from "../../components/header/header";
import LargeFooter from "../../components/LargeFooter/LargeFooter";
import SmallFooter from "../../components/Small Footer/smallFooter";
import InputBox from "../../components/inputBox/inputBox";
import GlowBtn from "../../components/glow btn/glowBtn";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAreaSelected } from '../../context/AreaSelected';
import { useFirebase } from "../../context/firebase";
import { toast } from "react-toastify";


// Importing the CSS file for the loader animation
import "../../Animated Loaders/ThreeDotLoader.css";





// importing images
import uploadIcon from "/images/interface icons/upload icon.svg";
import closeIcon from "/images/interface icons/close icon.svg";
import locationIcon from "/images/icons/location_icon.png";







function BookingCloseAlert({ show, onClose, vid, city, university }) {

    const navigate = useNavigate();

    return (
        <div className={`bca-container ${show ? "bca-active" : ""} `}>
            <p>Are you sure you <br />
                want to terminate the Booking process?</p>
            <div className="bca-btns">
                <GlowBtn onClick={() => navigate(`/product-detail/${vid}?city=${encodeURIComponent(city)}&university=${encodeURIComponent(university)}`)} text="Terminate" borderRadius="10px" height="45px" color="#FF4C4C" blur="5px" />
                <GlowBtn onClick={onClose} text="Continue" borderRadius="10px" height="45px" color="#44CB7E" blur="5px" />
            </div>
        </div>
    );
}


function DriverDetails({ driverNum, driverData, setDriverData }) {
    const [licensePreview, setLicensePreview] = useState(null);
    const [idPreview, setIdPreview] = useState(null);

    // Handle file upload and store in state
    const handleFileChange = (event, field, setPreview) => {
        const file = event.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setDriverData((prev) => {
                const updatedData = [...prev];
                updatedData[driverNum - 1] = {
                    ...updatedData[driverNum - 1],
                    [field]: file
                };
                return updatedData;
            });
        }
    };

    // Handle input change
    const handleChange = (field, value) => {
        setDriverData((prev) => {
            const updatedData = [...prev];
            updatedData[driverNum - 1] = {
                ...updatedData[driverNum - 1],
                [field]: value
            };
            return updatedData;
        });
    };

    return (
        <div className="driver-details-container">
            <h3>Driver {driverNum}</h3>

            <div className="driver-details-inputs">
                {/* Name Input */}
                <InputBox
                    typeName="text"
                    labelName="Name"
                    value={driverData[driverNum - 1]?.name || ""}
                    onChange={(value) => handleChange("name", value)}
                />

                {/* Phone Input */}
                <InputBox
                    typeName="tel"
                    labelName="Phone"
                    value={driverData[driverNum - 1]?.phone || ""}
                    onChange={(value) => handleChange("phone", value)}
                />

                {/* Driving License Upload */}
                <input
                    id={`drivingLicense-${driverNum}`}
                    type="file"
                    accept=".jpg, .jpeg, .png, .pdf"
                    onChange={(e) => handleFileChange(e, "licenseFile", setLicensePreview)}
                    required
                />
                <label htmlFor={`drivingLicense-${driverNum}`} className="driver-detail-tdc-labels placeCenter-row space-between">
                    Upload Driver's License
                    <img src={uploadIcon} alt="upload icon" />
                </label>
                {licensePreview && <img src={licensePreview} alt="License Preview" className="driver-detail-doc-preview" />}

                {/* Government ID Upload */}
                <input
                    id={`governmentID-${driverNum}`}
                    type="file"
                    accept=".jpg, .jpeg, .png, .pdf"
                    onChange={(e) => handleFileChange(e, "idFile", setIdPreview)}
                    required
                />
                <label htmlFor={`governmentID-${driverNum}`} className="driver-detail-tdc-labels placeCenter-row space-between">
                    Upload College/Govt. ID
                    <img src={uploadIcon} alt="upload icon" />
                </label>
                {idPreview && <img src={idPreview} alt="ID Preview" className="driver-detail-doc-preview" />}
            </div>
        </div>
    );
}


function PriceCard({ baseAmt, subTotal, duration, durationAmt, total, convenienceFee, quantity }) {

    return (
        <div className="checkout-card-container">

            <div className="checkout-card-container-content">

                <div className="checkout-price-break">
                    <p>Base Amount</p>
                    <p>₹{baseAmt}</p>
                </div>
                <div className="checkout-price-break">
                    <p>Duration({duration}<span>hrs</span>)</p>
                    <p>₹{durationAmt}</p>
                </div>
                <div className="checkout-price-break">
                    <p>Convenience Fee</p>
                    <p>₹{convenienceFee}</p>
                </div>
                <div className="checkout-price-break">
                    <p>Total</p>
                    <p>₹{total}</p>
                </div>
                <div className="checkout-price-break">
                    <p>Quantity</p>
                    <p>x{quantity}</p>
                </div>
                <div className="checkout-price-break ">
                    <p>Subtotal</p>
                    <p>{subTotal}</p>
                </div>

            </div>

            <div className="checkout-stretch-class">
                <h3>Total Payable Amount</h3>
                <h3>₹{subTotal}</h3>

            </div>
        </div>
    );
}


function CheckoutPage() {

    const navigate = useNavigate();
    const AreaSelected = useAreaSelected();
    const firebase = useFirebase();
    const [queryParams] = useSearchParams();

    // Retrieving query parameters
    const vid = queryParams.get("vid");
    const quantity = queryParams.get("quantity");
    const date = queryParams.get("date");
    const night = parseInt(queryParams.get("night"), 10);
    const fromTime = queryParams.get("fromTime");
    const toTime = queryParams.get("toTime");
    const city = AreaSelected.cityContext || queryParams.get("city");
    const university = AreaSelected.universityContext || queryParams.get("university");



    const [showAlert, setShowAlert] = useState(false);
    // State to store driver details
    const [driverData, setDriverData] = useState(
        Array.from({ length: quantity }, () => ({
            name: "",
            phone: "",
            licenseFile: null,
            idFile: null
        }))
    );

    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [userProfile, setUserProfile] = useState({ name: "", phone: "" });
    const [loading, setLoading] = useState(false);


    // fetching the users name and phone from the realtime-database 
    useEffect(() => {
        const fetchProfile = async () => {
            const uid = firebase.currentUser?.uid;
            // if (!uid) {
            //     console.error("NO USER FOUND 💀");
            //     return;
            // }

            try {
                const data = await firebase.getData(`users/${uid}`);
                if (data) {
                    setUserProfile({
                        name: data.name || "",
                        phone: data.phone || "",
                    });
                }
            } catch (err) {
                console.error("Failed to load profile 💀:", err);
            }
        };

        fetchProfile();
    }, [firebase.currentUser]);


    // updating the context values of city and university. {when the pages reloads, context values are lost, but the url values are not lost. So, I am updating the context values with the url values.}
    useEffect(() => {
        if (!AreaSelected.cityContext && queryParams.get("city")) {
            AreaSelected.setCityContext(queryParams.get("city"));
        }

        if (!AreaSelected.universityContext && queryParams.get("university")) {
            AreaSelected.setUniversityContext(queryParams.get("university"));
        }

    }, []);

    // Function to validate all inputs and checkbox status
    const validateForm = () => {
        const allFilled = driverData.every(
            (driver) =>
                driver.name &&
                driver.phone &&
                driver.licenseFile &&
                driver.idFile
        );
        setIsButtonDisabled(!(allFilled && checkboxChecked));
    };

    // Effect to recheck whenever input data or checkbox status changes
    useEffect(() => {
        validateForm();
    }, [driverData, checkboxChecked]);




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



    // Handles the case where vehicle isn't found {depending on the loading state}
    if (!selectedVehicle && loading == false) {
        return (
            <div className="checkout-container">
                <Header />
                <div className="checkout-vehicle-not-found">
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


    const vehicleName = selectedVehicle.name;
    const vehicleRate = selectedVehicle.rate;
    const owner = selectedVehicle.owner;
    const baseAmt = selectedVehicle.baseAmt;
    const vehicleImage = selectedVehicle.image;


    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const calculateDuration = (fromTime, toTime) => {
        const [fromHour, fromMinute] = fromTime.split(':').map(Number);
        const [toHour, toMinute] = toTime.split(':').map(Number);

        // Convert both to minutes
        const fromTotalMinutes = fromHour * 60 + fromMinute;
        const toTotalMinutes = toHour * 60 + toMinute;

        // If toTime is on the next day (e.g. from 23:00 to 05:30)
        const diffMinutes = toTotalMinutes >= fromTotalMinutes
            ? toTotalMinutes - fromTotalMinutes
            : (24 * 60 - fromTotalMinutes) + toTotalMinutes;

        // Convert to hours and round up
        const duration = Math.ceil(diffMinutes / 60);

        return duration;
    }
    const duration = calculateDuration(fromTime, toTime);

    const fromDate = new Date(`${date}T${fromTime}`);
    const toDate = new Date(`${date}T${toTime}`);
    toDate.setDate(fromDate.getDate() + night);

    // Formatting Date and Time 👇🏻👇🏻
    // Formatting the date as per requirement. Nothing fancy, just a simple string manipulation
    const fromDayNumber = fromDate.getDate().toString().padStart(2, "0");
    const fromMonthYear = fromDate.toLocaleString('default', { month: 'short', year: 'numeric' });
    const toDayNumber = toDate.getDate().toString().padStart(2, "0");
    const toMonthYear = toDate.toLocaleString('default', { month: 'short', year: 'numeric' });
    // Formatting the time as per requirement
    function formatTime(timeStr) {
        const [hour, minute] = timeStr.split(':');
        const date = new Date();
        date.setHours(Number(hour));
        date.setMinutes(Number(minute));
        // Format to "h:mm AM/PM"
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    const formattedFromTime = formatTime(fromTime);
    const formattedToTime = formatTime(toTime);

    // Formatting Date and Time 👆🏻👆🏻



    // Calculating the subtotal amount
    const convenienceFee = 10; // change this as per requirement
    const durationAmt = duration * vehicleRate;
    const total = baseAmt + durationAmt + convenienceFee;
    const subTotal = total * quantity;

    const handleProceedClick = () => {
        const nameRegex = /^[a-zA-Z\s]{1,50}$/;
        const phoneRegex = /^[0-9]{10}$/;

        for (let i = 0; i < driverData.length; i++) {
            const { name, phone } = driverData[i];

            if (!nameRegex.test(name)) {
                toast.error(`Driver ${i + 1}: Invalid name.`);
                return;
            }

            if (!phoneRegex.test(phone)) {
                toast.error(`Driver ${i + 1}: Invalid phone number.`);
                return;
            }
        }


        navigate('/payment', {
            state: {
                vid,
                city,
                university,
                fromDate,
                toDate,
                quantity,
                driverData,
                subTotal
            }
        })
    }


    return (
        <div className="checkout-container">


            <BookingCloseAlert show={showAlert} onClose={handleCloseAlert} vid={vid} city={city} university={university} />

            <div className="checkout-body">

                <div className="checkout-title">
                    <h1 className="bluish-color">CHECKOUT</h1>
                    <img onClick={() => setShowAlert(true)} id="checkout-close-btn" width={"30px"} src={closeIcon} alt="close btn" style={{ cursor: "pointer" }} />
                </div>



                <div className="checkout-vehicle placeCenter-row">
                    <img width={"50%"} src={vehicleImage} alt="vehicle image" />

                    <div className="checkout-vehicle-details">
                        <div className="checkout-user">
                            <p>{userProfile.name}</p>
                            <p>{userProfile.phone}</p>
                        </div>

                        <h3>{vehicleName}</h3>
                        <h4>Quantity: {quantity}</h4>
                    </div>
                </div>


                {/* Date and Time */}
                <div>
                    <h3 className="bluish-color">Date and Time</h3>

                    <div className="checkout-banner-top placeCenter-row ">
                        {/* From Date and Time */}
                        <div className="checkout-time-detail placeCenter-row">
                            <span>{fromDayNumber}</span>
                            <div>
                                <p className="checkout-lighter-text">{fromMonthYear}</p>
                                <p>{formattedFromTime}</p>
                            </div>
                        </div>

                        <div className="checkout-duration-line">
                            <div className="checkout-dotted-line"></div>
                            <p>{duration} hrs</p>
                        </div>

                        {/* To Date and Time */}
                        <div className="checkout-time-detail placeCenter-row">
                            <span>{toDayNumber}</span>
                            <div>
                                <p className="checkout-lighter-text">{toMonthYear}</p>
                                <p>{formattedToTime}</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="checkout-separator"></div>


                {/* Pickup and Drop Location */}
                <div className="checkout-pickup-drop">
                    <h3 className="bluish-color">Pickup and Drop Location</h3>

                    <div className="checkout-location placeCenter-row">
                        <img width={"17px"} src={locationIcon} alt="location" />
                        <p>{owner}</p>
                    </div>
                </div>


                <div className="checkout-separator"></div>


                {/* Things to Remember */}
                <div className="checkout-ttr">
                    <h3 className="bluish-color">Things to Remember</h3>
                    <div className="ttr-list">
                        <div className="ttr-item placeCenter-row">
                            <p>Kilometer Limit</p>
                            <p>100 km</p>
                        </div>

                        <div className="ttr-item placeCenter-row">
                            <p>Excess Kilometer Charges</p>
                            <p>₹10 / km</p>
                        </div>

                        <div className="ttr-item placeCenter-row">
                            <p>Hourly Charges</p>
                            <p>₹20 / km</p>
                        </div>

                        <div className="ttr-item placeCenter-row">
                            <p>Late Drop Fee</p>
                            <p>₹200 / hr</p>
                        </div>
                    </div>
                </div>


                <div className="checkout-separator"></div>


                {/* Upload Documents */}
                <div className="checkout-upload-documents">
                    <h3 className="bluish-color">Upload Documents</h3>
                    {Array.from({ length: quantity }).map((_, index) => (
                        <DriverDetails
                            key={index}
                            driverNum={index + 1}
                            driverData={driverData}
                            setDriverData={setDriverData}
                        />
                    ))}
                </div>


                <div className="checkout-separator"></div>


                {/* Fair Details */}
                <div className="checkout-fair-details">
                    <h3 className="bluish-color fair-details-h3">Fair Details</h3>
                    <PriceCard baseAmt={baseAmt} subTotal={subTotal} duration={duration} durationAmt={durationAmt} total={total} convenienceFee={convenienceFee} quantity={quantity} />
                </div>


                {/* Terms and condition */}
                <div className="checkout-terms-conditions">
                    <input
                        type="checkbox"
                        id="terms-condition"
                        checked={checkboxChecked}
                        onChange={(e) => setCheckboxChecked(e.target.checked)}
                    />
                    <label htmlFor="terms-condition">
                        I agree to the Terms and Conditions
                    </label>
                </div>


                {/* Payment Page Button */}
                {/* <GlowBtn onClick={() => navigate('/payment')} disabled={isButtonDisabled} glow="false" text="Proceed to Payment" color="var(--bluish)" borderRadius="10px" width="100%" height="50px" style={{ fontSize: "1.3em", fontWeight: "500", marginTop: "25px" }} /> */}
                <GlowBtn
                    onClick={handleProceedClick}
                    disabled={isButtonDisabled}
                    glow="false"
                    text="Proceed to Payment"
                    color="var(--bluish)"
                    borderRadius="10px"
                    width="100%"
                    height="50px"
                    style={{ fontSize: "1.3em", fontWeight: "500", marginTop: "25px" }}
                />


            </div>

            <SmallFooter />

        </div>
    );
}

export default CheckoutPage;
