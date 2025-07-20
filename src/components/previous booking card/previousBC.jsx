import "./previousBC.CSS"

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


function PreviousBC({ image, name = "Unknown", quantity = "X", fromDate, status, onClick }) {


    const { time: fromTime, date: fromDateStr } = formatFirestoreTimestamp(fromDate);


    return (
        <div onClick={onClick} className="pbc-container placeCenter-row">
            {/* section one */}
            <div className="pbc-section-one placeCenter-column">
                <img width={"85px"} className="pbc-vehicle-img" src={image} alt="vehicle img" />
            </div>

            {/* section two */}
            <div className="pbc-section-two placeCenter-column">
                <div className="pbc-name-details placeCenter-row">
                    <p id="vname">{name}</p>
                    <p>x{quantity}</p>
                </div>
                <div className="pbc-time-details placeCenter-row">
                    <div className="detail-banner">
                        <p><span>{fromTime}</span></p>
                        <p>{fromDateStr}</p>
                    </div>
                    <div id={status.toLowerCase()} className="pbc-status">
                        <p>{status.toUpperCase()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PreviousBC;