import "./ongoingBC.css";
import GlowBtn from "../glow btn/glowBtn";
import { useNavigate } from "react-router-dom";




// importing images
import confirmedImg from "/images/icons/confirmed.svg";
import liveImg from "/images/icons/live.svg";






// this function simply formats the firestore timestamp to a more readable format
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


function OngoingBC({ image, name = "Unknown", quantity, fromDate, toDate, amtPaid, bookingID, status, bookingDate, vid, city, university }) {


    const navigate = useNavigate();

    /*  the 'indicator' variable decides which img to render.
    if the booking is in the future the 'confirmed' img will show
    and if the time has come it will show the 'live' img    */

    const startTime = new Date(fromDate.seconds * 1000);
    const currentDateTime = new Date();

    const indicator = currentDateTime < startTime ? confirmedImg : liveImg;

    const { time: fromTime, date: fromDateStr } = formatFirestoreTimestamp(fromDate);
    const duration = computeDurationHours(fromDate, toDate);



    return (
        <div className="obc-container placeCenter-row">
            {/* section one */}
            <div className="obc-section-one placeCenter-column">
                <img width={"85px"} className="obc-vehicle-img" src={image} alt="vehicle img" />
                <img width={"85px"} height={"30px"} src={indicator} alt="indicator" />
            </div>

            {/* section two */}
            <div className="obc-section-two placeCenter-column">
                <div className="obc-name-details placeCenter-row">
                    <p id="vname">{name}</p>
                    <p>x{quantity}</p>
                </div>
                <div className="obc-time-details placeCenter-row">
                    <div className="detail-banner">
                        <p className="g-all-caps"><span>{fromTime}</span></p>
                        <p>{fromDateStr}</p>
                    </div>
                    <div className="detail-banner align-right">
                        <p>Duration</p>
                        <p><span>{duration} hrs</span></p>
                    </div>
                </div>

                <GlowBtn
                    onClick={() => navigate(`/booking-detail?bookingID=${bookingID}&image=${image}&name=${name}&quantity=${quantity}&fromDate=${fromDate}&toDate=${toDate}&amtPaid=${amtPaid}&status=${status}&bookingDate=${bookingDate}&vid=${vid}&city=${city}&university=${university}`)}
                    text="View" width="200px" borderRadius="10px" glow="false" color="#0C89E4"
                />
            </div>
        </div>
    );
}

export default OngoingBC;