import "./bookingDetailPage.css"
import SmallFooter from "../../components/Small Footer/smallFooter";
import CPD from "../../components/cancellation Policy dropdown/CPD";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import { useAreaSelected } from '../../context/AreaSelected';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import BookingPdfTemplate from "../../components/BookingPdfTemplate/BookingPdfTemplate.jsx";

import "../../Animated Loaders/ThreeDotLoader.css";


// importing images
import locationIcon from "../../images/icons/location_icon.png";
import arrowIcon from "/images/interface icons/arrow icon.svg";
import closeIcon from "/images/interface icons/close icon.svg";
import shareIcon from "/images/interface icons/share icon.svg";



// PICKUP LOCATION SECTION ---------------------------------------------------------
function PickUpLocationCard({ owner, shopLocation }) {

    if (!owner || !shopLocation) return null;

    return (
        <div className="bd-card-container">
            <h3>Pickup Location</h3>

            <div className="bd-card-container-content bd-pickup-location">

                <a
                    href={shopLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    <span>
                        <img src={locationIcon} alt="location-icon" />
                        {owner}
                    </span>
                </a>

            </div>
        </div>
    );
}

// DETAIL SECTION ---------------------------------------------------------
function DetailCard({ name, phone, email }) {
    return (
        <div className="bd-card-container">
            <h3>Contact Details</h3>

            <div className="bd-card-container-content">

                <h6>Name</h6>
                <p>{name}</p>

                <h6>Phone Number</h6>
                <p>{phone}</p>

                <h6 >Email</h6>
                <p className="no-margin">{email}</p>

            </div>
        </div>
    );
}

// PRICE BREAK-UP SECTION ---------------------------------------------------------
function PriceCard({ baseAmt, rate, duration, convenienceFee, quantity }) {

    const durationAmt = duration * rate;
    const total = baseAmt + durationAmt + convenienceFee;
    const subTotal = total * quantity;

    return (
        <div className="bd-card-container">
            <div className="stretch-class">
                <h3>Amount Paid</h3>
                <h3>₹{subTotal}</h3>

            </div>

            <div className="bd-card-container-content">

                <div className="price-break stretch-class">
                    <p>Base Amount</p>
                    <p>₹{baseAmt}</p>
                </div>
                <div className="price-break stretch-class">
                    <p>Duration({duration}<span>hrs</span>)</p>
                    <p>₹{durationAmt}</p>
                </div>
                <div className="price-break stretch-class">
                    <p>Convenience Fee</p>
                    <p>₹{convenienceFee}</p>
                </div>
                <div className="price-break stretch-class">
                    <p>Total</p>
                    <p>₹{total}</p>
                </div>
                <div className="price-break stretch-class">
                    <p>Quantity</p>
                    <p>x{quantity}</p>
                </div>
                <div className="price-break stretch-class last-item">
                    <p>Subtotal</p>
                    <p>{subTotal}</p>
                </div>

            </div>
        </div>
    );
}


// TRANSACTION DETAIL SECTION ---------------------------------------------------------
function TransactionDetailCard({ bookingID, time, date, status }) {
    return (
        <div className="bd-card-container">
            <h3>Transaction Details</h3>

            <div className="bd-card-container-content">

                <div className="transaction-detail stretch-class">
                    <p>Booking ID</p>
                    <p>{bookingID}</p>
                </div>
                <div className="transaction-detail stretch-class">
                    <p>Date</p>
                    <p style={{ letterSpacing: "0px" }}>{time} | {date}</p>
                </div>
                <div className="transaction-detail stretch-class no-margin">
                    <p>Status</p>
                    <p><span>{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</span></p>
                </div>

            </div>
        </div>
    );
}

// CANCELLATION SECTION ---------------------------------------------------------
function CancellationCard({ bookingID, vid, baseAmt, rate, duration, quantity, convenienceFee, city, university, fromDate }) {

    const navigate = useNavigate();

    return (
        <div className="bd-cancellation cancel-card">
            <h3>Cancellation</h3>
            <span>Cancellation Charges will be applied as per E2R cancellation policies.</span>

            <CPD className="cpd-design" />


            <button onClick={() => navigate(`/cancellation?bookingID=${bookingID}&baseAmt=${baseAmt}&rate=${rate}&duration=${duration}&quantity=${quantity}&convenienceFee=${convenienceFee}&city=${city}&university=${university}&fromDate=${fromDate}&vid=${vid}`)} className="cancel-btn placeCenter-row">
                <p>Cancel Booking</p>
                <img src={arrowIcon} alt="go btn" />
            </button>
        </div>
    );
}


function BookingDetailPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const firebase = useFirebase();
    const AreaSelected = useAreaSelected();


    const { currentUser, getData } = firebase;


    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);

    const bookingID = queryParams.get("bookingID");
    const image = queryParams.get("image");
    const name = queryParams.get("name");
    const quantity = queryParams.get("quantity");
    const fromDate = queryParams.get("fromDate");
    const toDate = queryParams.get("toDate");
    const amtPaid = queryParams.get("amtPaid");
    const status = queryParams.get("status");
    const bookingDate = queryParams.get("bookingDate");
    const vid = queryParams.get("vid");
    const city = queryParams.get("city");
    const university = queryParams.get("university");

    // state variable
    const [userInfo, setUserInfo] = useState({ name: "", phone: "", email: "" });
    const [owner, setOwner] = useState("");
    const [baseAmt, setBaseAmt] = useState(0);
    const [rate, setRate] = useState(0);
    const [shopLocation, setShopLocation] = useState("");
    const [loading, setLoading] = useState(true);


    // fetching the current user's name, phone and email, this is done so that the user can see the account from which the booking was made
    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) {
                setLoading(false); // no user, stop loading
                return;
            }
            try {
                const data = await getData(`/users/${currentUser.uid}`);
                if (data) {
                    setUserInfo({
                        name: data.name || "Unknown",
                        phone: data.phone,
                        email: data.email
                    });
                }
            } catch (err) {
                console.error("Failed to fetch user data💀:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    });

    // fetching the vehicle baseAmt, rate, owner and shop location
    useEffect(() => {
        const fetchVehicleData = async () => {
            if (!vid || !city || !university) {
                setLoading(false); // missing params, stop loading
                return;
            }
            try {
                const vehiclePath = `vehicles/${city}/${university}`;
                const vehicleData = await firebase.getFirestoreData(vehiclePath, vid);
                if (vehicleData) {
                    setBaseAmt(vehicleData.baseAmt || 0);
                    setRate(vehicleData.rate || 0);
                    setOwner(vehicleData.owner);

                    // Fetching shop location
                    const shopID = vehicleData.ownerShopID;
                    if (!shopID) return;

                    const shopDoc = await firebase.getFirestoreData("shops", shopID);
                    if (shopDoc?.location) {
                        setShopLocation(shopDoc.location);
                    }
                }
            } catch (err) {
                console.error("Error fetching vehicle data💀:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleData();
    }, [vid, city, university]);


    // updating the context values of city and university. {when the pages reloads, context values are lost, but the url values are not lost. So, I am updating the context values with the url values.}
    useEffect(() => {
        if (!AreaSelected.cityContext && city) {
            AreaSelected.setCityContext(city);
        }

        if (!AreaSelected.universityContext && university) {
            AreaSelected.setUniversityContext(university);
        }
    }, [city, university]);


    // this function simply formats query param {fromDate and toDate} to a more readable format
    const formatDateTimeFromParam = (timestampString) => {
        const match = /Timestamp\(seconds=(\d+),/.exec(timestampString);
        if (!match) return { time: "", date: "", dateObj: null };

        const seconds = parseInt(match[1]);
        const dateObj = new Date(seconds * 1000);

        const timeStr = dateObj.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        const dateStr = dateObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        return { time: timeStr, date: dateStr, dateObj };
    };

    const { time: fromTime, date: fromDateStr, dateObj: fromDateObj } = formatDateTimeFromParam(fromDate);
    const { time: toTime, date: toDateStr, dateObj: toDateObj } = formatDateTimeFromParam(toDate);
    const { time: bookingTime, date: bookingDateStr } = formatDateTimeFromParam(bookingDate);

    // this function computes the duration in hours between two date object
    const computeDurationHours = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60));
    };

    const duration = computeDurationHours(fromDateObj, toDateObj);


    // prepare the data object for the PDF
    const pdfRef = useRef();
    const bookingData = {
        booking: { id: bookingID, quantity },
        vehicle: { name, owner },
        user: { name: userInfo.name, email: userInfo.email },
        pricing: { subTotal: (baseAmt + rate * duration + 10) * parseInt(quantity) },
        pickup: {
            fromDate: fromDateStr,
            fromTime,
            toDate: toDateStr,
            toTime,
            shopLocation
        },
        status
    };

    const handleShareClick = async () => {
        const input = pdfRef.current;
        if (!input) return;

        // render to canvas at high resolution
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // create PDF sized to A4
        const pdf = new jsPDF({
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Booking_${bookingID}.pdf`);
    };


    if (loading) return <div className="three-dot-loader" style={{ margin: "50vh auto", "--dot-color": "rgba(48, 48, 48)" }}></div>

    return (
        <>
            {/* hidden offscreen template */}
            <div style={{ position: "absolute", top: -9999, left: -9999 }}>
                <BookingPdfTemplate ref={pdfRef} {...bookingData} />
            </div>

            <div className="bd-container">

                <div className="bd-top-section">
                    <button onClick={() => navigate(`/booking-history?city=${city}&university=${university}`)} className="bd-close-btn"><img style={{ cursor: 'pointer' }} src={closeIcon} alt="close btn" /></button>

                    <div className="successfulBanner">
                        <h3>Booking Successful</h3>
                        <p>Booking ID: {bookingID}</p>
                    </div>

                    <button onClick={handleShareClick} className="bd-share-btn">
                        <img src={shareIcon} alt="share btn" style={{ cursor: "pointer" }} />
                    </button>

                    <div className="booking-banner placeCenter-column ">
                        <div className="banner-top placeCenter-row ">

                            <div className="time-detail placeCenter-row">
                                <span>{fromDateStr.split(" ")[0]}</span>
                                <div >
                                    <p className="lighter-text">{fromDateStr.split(" ").slice(1).join(" ")}</p>
                                    <p>{fromTime}</p>
                                </div>
                            </div>

                            <div className="duration-line">
                                <div className="dotted-line"></div>
                                <p>{duration} hrs</p>
                            </div>

                            <div className="time-detail placeCenter-row">
                                <span>{toDateStr.split(" ")[0]}</span>
                                <div >
                                    <p className="lighter-text">{toDateStr.split(" ").slice(1).join(" ")}</p>
                                    <p>{toTime}</p>
                                </div>
                            </div>
                        </div>
                        <div className="banner-bottom placeCenter-row ">
                            <div>
                                <h2>{name}</h2>
                                <p>Quantity: {quantity}</p>
                            </div>
                            <img width={"85px"} src={image} alt="vehicle image" />
                        </div>
                    </div>

                </div>

                <div className="bd-body">

                    <PickUpLocationCard owner={owner} shopLocation={shopLocation} />
                    <DetailCard name={userInfo.name} phone={userInfo.phone} email={userInfo.email} />
                    <TransactionDetailCard bookingID={bookingID} time={bookingTime} date={bookingDateStr} status={status} />
                    <PriceCard baseAmt={baseAmt} rate={rate} duration={duration} convenienceFee={10} quantity={parseInt(quantity)} />
                    <CancellationCard bookingID={bookingID} vid={vid} baseAmt={baseAmt} rate={rate} duration={duration} quantity={quantity} convenienceFee={10} city={city} university={university} fromDate={fromDate} />

                </div>


                {/* BOOKING DETAIL PAGE FOOTER */}
                <div className="booking-detail-page-footer">
                    <SmallFooter />
                </div>
            </div>
        </>
    );
}

export default BookingDetailPage;