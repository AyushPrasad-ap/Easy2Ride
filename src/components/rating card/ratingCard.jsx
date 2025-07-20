import "./ratingCard.css";

//timeAgo unit = hours

function RatingCard({ user = "User", rating = "3", timeAgo = "1.5", review = "This is the user review." }) {

    let timeDisplay = timeAgo > 1 && timeAgo < 24 ? `${Math.floor(timeAgo)}h ago` : `${Math.floor(timeAgo / 24)}d ago`;
    if (timeAgo <= 1) {
        timeDisplay = "Now";
    }

    return (
        <div className="rating-card">
            <div className="rating-header">
                <div className="rc-user-info">
                    <div className="rc-avatar">{user.charAt(0).toUpperCase()}</div>
                    <div>
                        <h3 className="rc-username">{user}</h3>
                        <div className="rc-stars">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <span
                                    key={index}
                                    className={index < rating ? "star filled" : "star"}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <span className="rc-time">{timeDisplay}</span>
            </div>
            <p className="rc-review">{review}</p>
        </div>
    );
};

export default RatingCard;
