import "./cancellationPage.css"
import { useState, useEffect } from "react";
import GlowBtn from "../../components/glow btn/glowBtn";
import { useNavigate, useLocation } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import { useAreaSelected } from '../../context/AreaSelected';
import { send } from "@emailjs/browser";




// importing images
import arrowIcon from "/images/interface icons/arrow icon.svg";






function BookingCancelledPopUp({ city, university }) {

    const navigate = useNavigate();

    return (
        <div className="popup-overlay">
            <div className="booking-cancelled-popup-container placeCenter-column">
                <h2>Your booking is cancelled.</h2>
                <h3><span>Refund: Initiated</span></h3>
                <p>*You will soon receive a mail regarding your cancellation*</p>
                <GlowBtn onClick={() => navigate(`/booking-history?city=${city}&university=${university}`)} text="Continue" borderRadius="10px" color="var(--bluish, #0C89E4)" glow={false} width="150px" height="40px" />
            </div>
        </div>
    );
}


function CancellationPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const AreaSelected = useAreaSelected();
    const firebase = useFirebase();



    const queryParams = new URLSearchParams(location.search);
    const bookingID = queryParams.get("bookingID");
    const city = queryParams.get("city");
    const university = queryParams.get("university");
    const fromDate = queryParams.get("fromDate");
    const vid = queryParams.get("vid");
    const baseAmt = parseInt(queryParams.get("baseAmt"), 10);
    const rate = parseInt(queryParams.get("rate"), 10);
    const duration = parseInt(queryParams.get("duration"), 10);
    const quantity = parseInt(queryParams.get("quantity"), 10);
    const convenienceFee = parseInt(queryParams.get("convenienceFee"), 10);

    const [isCancelling, setIsCancelling] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [reason, setReason] = useState("");
    const [technicalIssueDetails, setTechnicalIssueDetails] = useState("");
    const [deductionPercent, setDeductionPercent] = useState(0);




    const durationAmt = duration * rate;
    const convenienceAmt = convenienceFee * quantity;
    const amtPaid = (baseAmt + durationAmt + convenienceFee) * quantity;

    // format for pickUp Time and Date 
    //      pickUpDate: "YYYY-MM-DD" (ISO format)           eg: pickUpDate="2025-02-20"
    //      pickUpTime: "HH:MM" (24-hour format)            eg: pickUpTime="14:30"



    //This function parses a Firestore‐style Timestamp string and returns ISO date & 24‑h time.
    function parsePickUpDateTime(rawTimestampStr) {
        // 1. Extract seconds via regex
        const match = /Timestamp\(seconds=(\d+),/.exec(rawTimestampStr);
        if (!match) {
            return { pickUpDate: "", pickUpTime: "" };
        }

        const seconds = parseInt(match[1], 10);
        const dateObj = new Date(seconds * 1000);

        // 2. Format ISO date (YYYY-MM-DD)
        const pickUpDate = dateObj.toISOString().split("T")[0];

        // 3. Format 24‑hour time (HH:MM)
        const hh = String(dateObj.getHours()).padStart(2, "0");
        const mm = String(dateObj.getMinutes()).padStart(2, "0");
        const pickUpTime = `${hh}:${mm}`;

        return { pickUpDate, pickUpTime };
    }
    const { pickUpDate, pickUpTime } = parsePickUpDateTime(fromDate);



    //The below code is used to calculate the decduction percent as per the cancellation policy
    useEffect(() => {
        const calculateDeduction = () => {
            if (!pickUpDate || !pickUpTime) return;

            const pickUpDateTime = new Date(`${pickUpDate} ${pickUpTime}`).getTime();
            const currentTime = new Date().getTime();
            const hoursDiff = (pickUpDateTime - currentTime) / (1000 * 60 * 60); // Convert ms to hours

            if (hoursDiff > 72) {
                setDeductionPercent(0.25);
            } else if (hoursDiff >= 24 && hoursDiff <= 72) {
                setDeductionPercent(0.75);
            } else {
                setDeductionPercent(1);
            }
        };

        // Run the function immediately
        calculateDeduction();

        // Set interval to update every minute
        const interval = setInterval(calculateDeduction, 60000);

        // Cleanup function to clear interval on unmount
        return () => clearInterval(interval);
    }, [pickUpDate, pickUpTime]);

    // updating the context values of city and university. {when the pages reloads, context values are lost, but the url values are not lost. So, I am updating the context values with the url values.}
    useEffect(() => {
        if (!AreaSelected.cityContext && city) {
            AreaSelected.setCityContext(city);
        }

        if (!AreaSelected.universityContext && university) {
            AreaSelected.setUniversityContext(university);
        }
    }, [city, university]);



    const cancellationCharge = (amtPaid - convenienceAmt) * deductionPercent;
    const cancellationAmt = cancellationCharge + convenienceAmt;
    const refundAmt = amtPaid - cancellationAmt;


    async function sendCancellationEmail({
        toEmail, userName, bookingID,
        vehicleName, vehicleImageUrl,
        fromDate, fromTime,
        refundAmount, refundStatus
    }) {
        const logoUrl = `${window.location.origin}/images/e2r logo.png`;
        const vehicleUrl = `${window.location.origin}${vehicleImageUrl}`;

        await send(
            "service_e2rXe2r",      //  service ID
            "template_e2rCANC",     //  cancellation template ID
            {
                email: toEmail,
                user_name: userName,
                booking_id: bookingID,
                vehicle_name: vehicleName,
                vehicle_image_url: vehicleUrl,
                from_date: fromDate,
                from_time: fromTime,
                refund_amount: refundAmount,
                refund_status: refundStatus,
                logo_url: logoUrl,
                current_year: new Date().getFullYear()
            },
            "mFWTHk32IeXK7Gaqw"      //  public key
        );
    }


    const handleChange = (event) => {
        setReason(event.target.value);
        if (event.target.value !== "technical-issue") {
            setTechnicalIssueDetails(""); // Reseting input if another option is selected
        }
    };


    const handleCancelBooking = async () => {
        const confirmCancel = window.confirm("Are you sure you want to cancel the booking?");
        if (!confirmCancel) return;

        setIsCancelling(true); // Show loading spinner

        try {
            const userId = firebase.currentUser?.uid;
            if (!userId) {
                alert("User not logged in");
                setIsCancelling(false);
                return;
            }

            const cancellationReason =
                reason === "technical-issue"
                    ? `${reason}: ${technicalIssueDetails}`
                    : reason;

            await firebase.setFirestoreData(`bookings/${userId}/userBookings`, bookingID, {
                refundAmt: refundAmt,
                refundStatus: "initiated",
                cancellationDate: firebase.serverTimestamp(),
                cancellationReason,
                status: "cancelled"
            });

            // Update the global ALL_BOOKINGS reference
            await firebase.setFirestoreData("ALL_BOOKINGS", bookingID, { status: "cancelled" });


            // pull user info from Realtime Database
            const rt = await firebase.getData(`users/${userId}`);
            const toEmail = rt.email || firebase.currentUser.email;
            const userName = rt.name || firebase.currentUser.displayName;

            const vehicleDoc = await firebase.getFirestoreData(
                `vehicles/${city}/${university}`, vid
            );
            const vehicleImage = vehicleDoc.image;

            await sendCancellationEmail({
                toEmail,
                userName,
                bookingID,
                vehicleName: vehicleDoc.name,
                vehicleImageUrl: vehicleImage,
                fromDate: pickUpDate,
                fromTime: pickUpTime,
                refundAmount: refundAmt,
                refundStatus: "Initiated"
            });


            setShowPopup(true);
        } catch (error) {
            console.error("Cancellation error:", error);
            alert("Failed to cancel booking. Please try again.");
        } finally {
            setIsCancelling(false); // Hide loading spinner
        }
    };

    return (
        <div className="cp-container">

            <div className="cp-header placeCenter-row">
                <button onClick={() => navigate(-1)} className="cp-back-btn"><img style={{ cursor: 'pointer' }} src={arrowIcon} alt="back btn" /></button>
                <h1>Cancel Booking</h1>
            </div>

            <div className="refund-cal-area">

                <h3 className="blue-text">Refund Calculation</h3>

                <hr />

                <div className="amt-paid placeCenter-row">

                    <div className="amt-title">
                        <h3>Amount Paid</h3>
                        <p>Base Amount</p>
                        <p>Duration</p>
                        <p>Convenience Fee</p>
                        <p>Quantity</p>
                    </div>

                    <div className="amt-value">
                        <h3>₹{amtPaid}</h3>
                        <p>₹{baseAmt}</p>
                        <p>₹{durationAmt}</p>
                        <p>₹{convenienceAmt}</p>
                        <p>x{quantity}</p>
                    </div>

                </div>

                <hr />


                <div className="cancellation-fee placeCenter-row">

                    <div className="cancellation-title">
                        <h3>Cancellation Fee</h3>
                        <p>Cancellation Charges ({deductionPercent * 100}%)</p>
                        <p>Convenience Fee</p>
                    </div>

                    <div className="cancellation-value">
                        <h3>-₹{cancellationAmt}</h3>
                        <p>-₹{cancellationCharge}</p>
                        <p>-₹{convenienceAmt}</p>
                    </div>

                </div>

                <hr />

                <div className="refund-value placeCenter-row">
                    <h3 className="blue-text">Your Refund</h3>
                    <p className="blue-text">₹{refundAmt}</p>
                </div>

            </div>

            <div className="reason-area">
                <h3>Reason for cancellation</h3>

                <hr />

                <div className="reason">
                    <input type="radio" id="plan-change" name="reasonToCancel" value="plan-change" onChange={handleChange} />
                    <label htmlFor="plan-change">Change of Plans</label><br />
                </div>
                <div className="reason">
                    <input type="radio" id="wrong-booking" name="reasonToCancel" value="wrong-booking" onChange={handleChange} />
                    <label htmlFor="wrong-booking">Booked for Wrong Date/Time</label><br />
                </div>
                <div className="reason">
                    <input type="radio" id="alternative" name="reasonToCancel" value="alternative" onChange={handleChange} />
                    <label htmlFor="alternative">Found an Alternative</label><br />
                </div>
                <div className="reason">
                    <input type="radio" id="shop-didnt-provide-vehicle" name="reasonToCancel" value="shop-didnt-provide-vehicle" onChange={handleChange} />
                    <label htmlFor="shop-didnt-provide-vehicle">Vehicle not provided by the shop</label><br />
                </div>
                <div className="reason">
                    <input type="radio" id="vehicle-bad-condition" name="reasonToCancel" value="vehicle-bad-condition" onChange={handleChange} />
                    <label htmlFor="vehicle-bad-condition">Vehicle was not in good condition</label><br />
                </div>
                <div className="reason">
                    <input type="radio" id="technical-issue" name="reasonToCancel" value="technical-issue" onChange={handleChange} />
                    <label htmlFor="technical-issue">Technical issue</label>
                </div>


                {/* Conditionally rendering text input if 'Technical issue' is selected */}
                {reason === "technical-issue" && (
                    <div className="technical-issue-reason-area">
                        <label htmlFor="technical-details">Please describe the issue:</label><br />
                        <textarea
                            id="technical-details"
                            rows="4"
                            cols="50"
                            value={technicalIssueDetails}
                            onChange={(e) => setTechnicalIssueDetails(e.target.value)}
                            placeholder="Describe the technical issue..."
                        ></textarea>
                    </div>
                )}


            </div>

            <div className="booking-cancel-btn">
                <GlowBtn
                    onClick={handleCancelBooking}
                    loading={{ state: isCancelling, text: "Cancelling", loadColor: "#fff" }}
                    width="300px"
                    height="40px"
                    borderRadius="10px"
                    text="Cancel Booking"
                    color="var(--redish)"
                    disabled={reason === "" || (reason === "technical-issue" && technicalIssueDetails.trim() === "")}
                    style={{
                        opacity: reason === "" || (reason === "technical-issue" && technicalIssueDetails.trim() === "") ? 0.5 : 1,
                        cursor: reason === "" || (reason === "technical-issue" && technicalIssueDetails.trim() === "") ? "not-allowed" : "pointer"
                    }}
                />
            </div>

            {showPopup && <BookingCancelledPopUp city={city} university={university} />}

        </div>
    );
}

export default CancellationPage;