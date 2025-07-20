import "./bookingHistory.css"
import LargeFooter from "../../components/LargeFooter/LargeFooter";
import OngoingBC from "../../components/ongoing booking card/ongoingBC";
import PreviousBC from "../../components/previous booking card/previousBC";
import OutlineBtn from "../../components/outline btn/outlineBtn";
import { useState, useEffect } from "react";
import { useAreaSelected } from '../../context/AreaSelected';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import { useBookingAutoUpdater } from "../../hooks/useBookingAutoUpdater";


import "../../Animated Loaders/ThreeDotLoader.css";



// importing images
import closeIcon from "/images/interface icons/close icon.svg";
import arrowIcon from "/images/interface icons/arrow icon.svg";
import cancelledImg from "/images/icons/cancelled_img.png";



//made as pop up detail 1 in figma design file
function PopUp({ vehicleName, quantity, fromDate, toDate, bookingID, cancelled, amtPaid, refundAmt, refundStatus, closePopup }) {

    // this functions simply formats the firestore timestamp to a more readable format
    const formatFirestoreTimestamp = (timestamp) => {
        if (!timestamp?.seconds) return { time: "", date: "" };

        const dateObj = new Date(timestamp.seconds * 1000);

        // Format time → e.g., "9:00 AM"
        const timeStr = dateObj.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        // Format date → e.g., "Thu, 01 Jan 42"
        const dateStr = dateObj.toLocaleDateString("en-GB", {
            weekday: "short", // Thu
            day: "2-digit",   // 01
            month: "short",   // Jan
            year: "2-digit"   // 42
        });

        return { time: timeStr, date: dateStr };
    };

    // this function computes the duration in hours between two firestore timestamps
    const computeDurationHours = (startTs, endTs) => {
        if (!startTs?.seconds || !endTs?.seconds) return 0;
        const startMs = startTs.seconds * 1000;
        const endMs = endTs.seconds * 1000;
        const diffHrs = (endMs - startMs) / (1000 * 60 * 60);
        return Math.ceil(diffHrs);
    };


    const { time: fromTime, date: fromDateStr } = formatFirestoreTimestamp(fromDate);
    const { time: toTime, date: toDateStr } = formatFirestoreTimestamp(toDate);
    const duration = computeDurationHours(fromDate, toDate);

    return (
        <div className="bh-popup-container boxShadowStyle">
            <img onClick={closePopup} className="popup-close-btn" src={closeIcon} alt="close btn" />

            {cancelled &&
                <img className="cancelled-img" src={cancelledImg} alt="close btn" />
            }

            <h2>{vehicleName}</h2>

            <hr />

            <div className="popup-time-details placeCenter-row">
                <div className="popup-detail-banner">
                    <p className="g-all-caps"><span>{fromTime}</span></p>
                    <p>{fromDateStr}</p>
                </div>
                <div className="popup-detail-banner align-right">
                    <p className="g-all-caps"><span>{toTime}</span></p>
                    <p>{toDateStr}</p>
                </div>
            </div>

            <div className="popup-field placeCenter-row">
                <p>Duration</p>
                <p>{duration} hrs</p>
            </div>

            <div className="popup-field placeCenter-row">
                <p>Quantity</p>
                <p>x{quantity}</p>
            </div>

            <hr />

            <div className="popup-field placeCenter-row">
                <p>Booking ID</p>
                <p>{bookingID}</p>
            </div>

            <div className="popup-field placeCenter-row">
                <p>Status</p>
                <p>{cancelled ? "Cancelled" : "Completed"}</p>
            </div>

            <hr />

            <div className="popup-field placeCenter-row">
                <p>Amount Paid</p>
                <p>₹{amtPaid}</p>
            </div>

            {cancelled
                ?
                <>
                    <div className="popup-field placeCenter-row">
                        <p>Refund Amount</p>
                        <p>₹{refundAmt}</p>
                    </div>
                    <hr />

                    <div className="popup-field placeCenter-row">
                        <p>Refund Status</p>
                        <p style={{ fontWeight: "bold" }}>{refundStatus.toUpperCase()}</p>
                    </div>
                </>
                :
                null
            }

        </div>
    );
}


function BookingHistoryPage() {

    const navigate = useNavigate();
    const firebase = useFirebase();
    const AreaSelected = useAreaSelected();
    const [queryParams] = useSearchParams();


    const uid = firebase.currentUser?.uid;
    // This hook will check all bookings for this user every 10 minutes and update their status from "confirmed" to "completed" if the end time has passed
    useBookingAutoUpdater(uid);



    const city = queryParams.get("city");
    const university = queryParams.get("university");


    const [activeFilter, setActiveFilter] = useState("All");    /* I can access which filter is active by this state variable*/
    const [popUp, setPopUp] = useState(false);

    const [userBookings, setUserBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);


    // updating the context values of city and university. {when the pages reloads, context values are lost, but the url values are not lost. So, I am updating the context values with the url values.}
    useEffect(() => {
        if (!AreaSelected.cityContext && city) {
            AreaSelected.setCityContext(city);
        }

        if (!AreaSelected.universityContext && university) {
            AreaSelected.setUniversityContext(university);
        }
    }, [city, university]);




    useEffect(() => {
        // 1) don’t run at all until auth is ready
        if (firebase.initializing) return;

        // 2) if there is no logged‑in user, bail out
        if (!firebase.currentUser) {
            console.warn("User not signed in — skipping bookings fetch");
            setLoading(false);
            return;
        }

        // 3) now we know currentUser is valid
        const fetchBookings = async () => {
            try {
                const path = `bookings/${uid}/userBookings`;
                const bookings = await firebase.getAllFirestoreDocs(path);
                setUserBookings(bookings);

            } catch (err) {
                console.error("Error loading bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [firebase.initializing, firebase.currentUser, firebase]);


    // now split into ongoing vs previous
    const ongoingBookings = userBookings.filter((b) => b.status === "confirmed");
    const previousBookings = userBookings.filter((b) => b.status === "completed" || b.status === "cancelled");








    // Applied filtering based on activeFilter
    const filteredBookings = previousBookings.filter((booking) => {
        if (activeFilter === "All") return true; // Show all bookings
        if (activeFilter === "Completed") return booking.status === "completed"; // Show only completed
        if (activeFilter === "Cancelled") return booking.status === "cancelled"; // Show only cancelled
        return true;
    });

    if (loading) return <div className="three-dot-loader" style={{ margin: "50vh auto", "--dot-color": "rgba(48, 48, 48)" }}></div>

    return (
        <div className="bh-container">

            <div className="bh-header">
                <div className="bh-header-content">
                    <h1>Booking History</h1>
                    <p>Manage your bookings</p>

                    <button onClick={() => navigate(`/profile?city=${city}&university=${university}`)} className="bh-back-btn placeCenter-row">
                        <img style={{ cursor: 'pointer' }} src={arrowIcon} alt="back btn" />
                    </button>
                </div>
            </div>

            <div className="bh-body">


                {/* ONGOING BOOKINGS */}
                <div className="bh-section-divider">
                    <span>ONGOING</span>
                </div>

                <div className="bh-bookings-container">
                    {ongoingBookings.length > 0 ? (
                        ongoingBookings.map((booking, index) => (
                            <OngoingBC
                                key={index}
                                image={booking.vehicleImage}
                                name={booking.vehicleName}
                                quantity={booking.quantity}
                                fromDate={booking.fromDate}
                                toDate={booking.toDate}
                                amtPaid={booking.amtPaid}
                                bookingID={booking.id}
                                status={booking.status}
                                bookingDate={booking.createdAt}
                                vid={booking.vid}
                                city={city}
                                university={university}
                            />
                        ))
                    ) : (
                        <p className="no-bookings">No Ongoing Bookings</p>
                    )}
                </div>





                {/* PREVIOUS BOOKINGS */}
                <div className="bh-section-divider">
                    <span>PREVIOUS BOOKINGS</span>
                </div>

                <div className="bh-filter-btns placeCenter-row">
                    {/* Each button sets activeFilter to its respective value */}
                    <OutlineBtn
                        id="all-btn"
                        text="All"
                        onClick={() => setActiveFilter("All")}
                        className={activeFilter === "All" ? "active-btn" : ""}
                    />
                    <OutlineBtn
                        id="completed-btn"
                        text="Completed"
                        onClick={() => setActiveFilter("Completed")}
                        className={activeFilter === "Completed" ? "active-btn" : ""}
                    />
                    <OutlineBtn
                        id="cancelled-btn"
                        text="Cancelled"
                        onClick={() => setActiveFilter("Cancelled")}
                        className={activeFilter === "Cancelled" ? "active-btn" : ""}
                    />
                </div>


                <div className="bh-bookings-container">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking, index) => (
                            <PreviousBC
                                key={index}
                                image={booking.vehicleImage}
                                name={booking.vehicleName}
                                quantity={booking.quantity}
                                fromDate={booking.fromDate}
                                toDate={booking.toDate}
                                status={booking.status}
                                amtPaid={booking.amtPaid}
                                bookingID={booking.id}
                                onClick={() => {
                                    setSelectedBooking(booking);
                                    setPopUp(true);
                                }}
                            />
                        ))
                    ) : (
                        <p className="no-bookings">No Bookings</p>
                    )}
                </div>

            </div>

            <div className="bh-footer">
                <LargeFooter />
            </div>

            {popUp && selectedBooking &&
                <div className="popup-overlay">
                    <PopUp
                        vehicleName={selectedBooking.vehicleName}
                        quantity={selectedBooking.quantity}
                        fromDate={selectedBooking.fromDate}
                        toDate={selectedBooking.toDate}
                        bookingID={selectedBooking.id}
                        cancelled={selectedBooking.status === "cancelled"}
                        amtPaid={selectedBooking.amtPaid}
                        refundAmt={selectedBooking.refundAmt}
                        refundStatus={selectedBooking.refundStatus}
                        closePopup={() => setPopUp(false)}
                    />
                </div>
            }

        </div>
    );
}

export default BookingHistoryPage;


