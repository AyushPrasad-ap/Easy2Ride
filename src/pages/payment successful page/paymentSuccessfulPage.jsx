import "./paymentSuccessfulPage.css"
import GlowBtn from "../../components/glow btn/glowBtn";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAreaSelected } from '../../context/AreaSelected';
import { useFirebase } from "../../context/firebase";
import { toast } from "react-toastify";
import { send } from "@emailjs/browser";


// Importing the CSS file for the loader animation
import "../../Animated Loaders/ThreeDotLoader.css";


// importing images
import logoSrc from "/images/e2r logo.png";
import successfulIcon from "/images/icons/successful_icon.png";









// TRANSACTION DETAIL SECTION ---------------------------------------------------------
function TransactionDetailCard({ bookingID, time, date, status }) {
    return (
        <div className="psp-card-container">
            <h3>Transaction Details</h3>

            <div className="psp-card-container-content">

                <div className="psp-transaction-detail psp-stretch-class">
                    <p>Booking ID</p>
                    <p>{bookingID}</p>
                </div>
                <div className="psp-transaction-detail psp-stretch-class">
                    <p>Date</p>
                    <p>{time} | {date}</p>
                </div>
                <div className="psp-transaction-detail psp-stretch-class psp-no-margin">
                    <p>Status</p>
                    <p><span>{status}</span></p>
                </div>

            </div>
        </div>
    );
}


// RATING OVERLAY COMPONENT
function RatingOverlay({ bookingID, city, university }) {

    const firebase = useFirebase();
    const navigate = useNavigate();

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [loading, setLoading] = useState(false);


    const handleRatingSubmit = async () => {
        setLoading(true);
        try {
            const uid = await firebase.currentUser?.uid;
            await firebase.setFirestoreData("E2R_ratings_reviews", bookingID, {
                uid,
                rating,
                review: "",
                createdAt: firebase.serverTimestamp()
            });
            toast.success("Thank you for your rating!");
            navigate(`/booking-history?city=${city}&university=${university}`);
        } catch (err) {

            console.error("Error saving rating:", err);
            toast.error("Could not save your rating. Please try again.");
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="psp-overlay">
            <div className="psp-overlay-content">
                <h3>Rate your booking experience</h3>
                <div className="psp-stars">
                    {Array(5).fill(0).map((_, i) => (
                        <span
                            key={i}
                            className="psp-star"
                            style={{
                                color: (hover || rating) > i ? "gold" : "#ccc"
                            }}
                            onClick={() => setRating(i + 1)}
                            onMouseEnter={() => setHover(i + 1)}
                            onMouseLeave={() => setHover(0)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <GlowBtn
                    onClick={handleRatingSubmit}
                    disabled={rating === 0 || loading}
                    loading={{ state: loading, text: "Submitting" }}
                    className="psp-submit-btn"
                    text="Submit"
                    borderRadius="10px"
                    width="120px"
                    height="40px"
                    style={{ marginTop: "10px" }}
                />
            </div>
        </div>
    );
}


function PaymentSuccessfulPage() {

    const bookingSaved = useRef(false); // Tracking if booking is already saved
    const firebase = useFirebase();
    const AreaSelected = useAreaSelected();
    const [queryParams] = useSearchParams();
    const location = useLocation();

    const { vid, city, university, quantity, fromDate, toDate, driverData, subTotal, paymentID } = location.state;

    const [showOverlay, setShowOverlay] = useState(false);
    const [bookingID, setBookingID] = useState(null);
    const [loading, setLoading] = useState(false);


    // updating the context values of city and university. {when the pages reloads, context values are lost, but the url values are not lost. So, I am updating the context values with the url values.}
    useEffect(() => {
        if (!AreaSelected.cityContext && queryParams.get("city")) {
            AreaSelected.setCityContext(queryParams.get("city"));
        }

        if (!AreaSelected.universityContext && queryParams.get("university")) {
            AreaSelected.setUniversityContext(queryParams.get("university"));
        }

    }, []);


    // Adding the booking to the firestore database
    useEffect(() => {

        // Exit early if booking is already saved or Firebase is initializing
        if (firebase.initializing || bookingSaved.current) return;

        const uid = firebase.currentUser?.uid;
        if (!uid) {
            toast.error("You must be logged in to save a booking!");
            return;
        }

        const generateBookingID = () => {
            const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 chars
            const timePart = Date.now().toString(36).toUpperCase().padStart(6, '0').slice(-6); // force 6 chars
            return `${randomPart}${timePart}`; // Always 10 characters
        };

        const saveBooking = async () => {
            setLoading(true);
            bookingSaved.current = true;

            const vehicleData = await firebase.getFirestoreData(`vehicles/${city}/${university}`, vid);


            // Removing File objects before saving
            const sanitizedDriverData = driverData.map(d => ({
                name: d.name,
                phone: d.phone
            }));

            const bookingRecord = {
                vid,
                vehicleName: vehicleData?.name || "Unknown Vehicle💀",
                vehicleImage: vehicleData?.image,
                paymentID: paymentID,
                fromDate,
                toDate,
                quantity,
                city,
                university,
                amtPaid: subTotal,
                driverData: sanitizedDriverData,
                status: "confirmed",
                createdAt: firebase.serverTimestamp()
            };
            const adminBookingRecord = {
                uid,
                vid,
                paymentID: paymentID,
                fromDate,
                toDate,
                status: "confirmed",
                createdAt: firebase.serverTimestamp()
            };

            try {
                let customBookingID;
                let exists = true;
                do {
                    customBookingID = generateBookingID();
                    const existing = await firebase.getFirestoreData(`bookings/${uid}/userBookings`, customBookingID);
                    exists = !!existing;
                } while (exists); //This checks if the generated ID already exists and retries if needed.

                //   (user-oriented)     writing under /bookings/{uid}/userBookings/{customBookingID}
                await firebase.setFirestoreData(`bookings/${uid}/userBookings`, customBookingID, bookingRecord);


                await firebase.setFirestoreData("ALL_BOOKINGS", customBookingID, adminBookingRecord);

                setBookingID(customBookingID);

            } catch (err) {
                console.error("Error saving booking:", err);
                toast.error("Could not save booking. Please contact support.");
            } finally {
                setLoading(false);
            }
        };

        saveBooking();
    }, [
        firebase.initializing,
        firebase.currentUser,
        vid, fromDate, toDate, quantity, city, university, subTotal, driverData
    ]);


    // intercepting action when the user tries to reload or close the page.
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            // Chrome requires returnValue to be set
            event.returnValue = "";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);






    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }); // e.g., "08:26"

    const formattedDate = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }); // e.g., "12 Mar 2025"


    //
    async function sendBookingEmail({
        toEmail,
        userName,
        bookingId,
        vehicleName,
        quantity,
        bookingDate,
        bookingTime,
        amount,
        vehicleImageUrl
    }) {
        const logoUrl = `${window.location.origin}/assets/e2r logo.png`;
        const vehicleUrl = `${window.location.origin}${vehicleImageUrl}`;

        try {
            await send(
                "service_e2rXe2r",        // from EmailJS dashboard
                "template_e2rBOOK",   // your template ID
                {
                    email: toEmail,
                    user_name: userName,
                    booking_id: bookingId,
                    vehicle_name: vehicleName,
                    quantity_amt: quantity,
                    booking_date: bookingDate,
                    booking_time: bookingTime,
                    amount: amount,
                    logo_url: logoUrl,
                    vehicle_image_url: vehicleUrl,
                    current_year: new Date().getFullYear()
                },
                "mFWTHk32IeXK7Gaqw"    // public key from EmailJS dashboard
            );
            console.log("Confirmation Email sent!");
        } catch (err) {
            console.error("EmailJS error:", err);
        }
    }

    useEffect(() => {
        if (!bookingID) return;         // only run once we have a bookingID
        (async () => {
            try {
                // a) Get the current user name
                const uid = firebase.currentUser.uid;
                const rtData = await firebase.getData(`users/${uid}`);
                const userEmail = rtData?.email || firebase.currentUser.email;
                const userName = rtData?.name || firebase.currentUser.displayName || "E2R Customer";

                // b) Get the vehicle data so we can pull the image & name
                const vehicleDoc = await firebase.getFirestoreData(
                    `vehicles/${city}/${university}`, vid
                );
                const vehicleName = vehicleDoc?.name;
                const vehicleImageUrl = vehicleDoc?.image;

                // c) Call your helper
                sendBookingEmail({
                    toEmail: userEmail,
                    userName,
                    bookingId: bookingID,
                    vehicleName,
                    quantity,
                    bookingDate: formattedDate,
                    bookingTime: formattedTime,
                    amount: subTotal,
                    vehicleImageUrl
                });
            } catch (err) {
                console.error("Failed to prepare/send booking email:", err);
            }
        })();
    }, [bookingID]);
    //



    const handleDoneClick = () => {
        setShowOverlay(true);
    };


    if (loading) {
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

    return (
        <div className="psp-container">

            <div className="psp-banner">
                <img className="psp-successful-icon" src={successfulIcon} alt="success img" />
                <h1 className="green-color">Payment Successful</h1>
                <h3>Successfully paid ₹{subTotal}</h3>
            </div>

            <TransactionDetailCard bookingID={bookingID || "…"} time={formattedTime} date={formattedDate} status="Success" />

            <div className="psp-comments">
                <h3>THANKYOU FOR BOOKING WITH E2R</h3>
                <h4>*You will shortly receive an email regarding your booking</h4>
            </div>


            <div className="done-btn" onClick={handleDoneClick}>
                Done
            </div>

            {showOverlay && <RatingOverlay bookingID={bookingID} city={city} university={university} />}
        </div>
    )
}

export default PaymentSuccessfulPage;