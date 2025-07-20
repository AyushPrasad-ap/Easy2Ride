import "./vehicleCard.css";
import GlowBtn from "../glow btn/glowBtn";



// importing images
import filledStarIcon from "/images/icons/filled_star_icon.png";
import unfilledStarIcon from "/images/icons/unfilled_star_icon.png";




function VehicleCard({
    imgSrc = "",
    vehicleName = "Vehicle Name",
    ratingCount = "4.6",
    reviewCount = "100",
    onBookNow
}) {


    const handleBookNowClick = () => {
        if (onBookNow) {
            onBookNow({ vehicleName });
        }
    };


    return (
        <div className="vc-container placeCenter-row" >
            <div className="vc-part1 placeCenter-column">
                <div className="vc-details">
                    <h3>{vehicleName}</h3>
                    <div className="vc-ratings placeCenter-row">
                        <div className="ratings">
                            <img src={filledStarIcon} alt="star icon" />
                            <p><span>{ratingCount}</span>/5</p>
                        </div>
                        <p>{reviewCount} Reviews</p>
                    </div>
                </div>

                <GlowBtn onClick={handleBookNowClick} text="Book Now" color="var(--orangish)" borderRadius="10px" blur="8px" />
            </div>

            <div className="vc-part2">
                <img src={imgSrc} alt={vehicleName} />
            </div>
        </div>
    );
}

export default VehicleCard;