import "./menu.css";
import GlowBtn from "../glow btn/glowBtn";
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import { useAreaSelected } from '../../context/AreaSelected';


// importing images 
import menuIcon from "../../images/interface icons/hamburger icon.svg";
import closeIcon from "../../images/interface icons/close icon.svg";


function Menu() {

    const navigate = useNavigate();
    const firebase = useFirebase();
    const AreaSelected = useAreaSelected();

    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (!firebase.currentUser) return;

        (async () => {
            try {
                const user = await firebase.getData(`/users/${firebase.currentUser.uid}`);
                setUserName(
                    user?.name                                  // 1st option
                    ?? firebase.currentUser.displayName         // 2nd option
                    ?? "User-Name"                              // default option
                );
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        })();
    }, [firebase, firebase.currentUser]);



    const [showNav, setShowNav] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await firebase.logoutUser();
        setLoading(false);

        navigate('/login');
    }


    return (
        <>
            <div className="menu" >
                <img onClick={() => setShowNav(!showNav)} className={showNav ? "menu-icon-hide" : "menu-icon"} src={menuIcon} alt="menu" />


                <div className={showNav ? "menu-container active-menu" : "menu-container"}>
                    <div className="top-section">
                        <div className="username">
                            <div className="user-icon">{userName.charAt(0).toUpperCase()}</div>
                            <p> {/* The below function simply gets the first name of the userName and makes the first letter it capital */}
                                {(() => {
                                    const first = userName.split(' ')[0] || "";
                                    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
                                })()}
                            </p>
                        </div>
                        <div className="close-btn" onClick={() => setShowNav(!showNav)}>
                            <img src={closeIcon} alt="" />
                        </div>
                    </div>
                    <div className="middle-section">
                        <ul>
                            <li><Link to={`/home?city=${encodeURIComponent(AreaSelected.cityContext)}&university=${encodeURIComponent(AreaSelected.universityContext)}`}>Home</Link></li>
                            <li><Link to={`/about?city=${encodeURIComponent(AreaSelected.cityContext)}&university=${encodeURIComponent(AreaSelected.universityContext)}`}>About Us</Link></li>
                            <li><Link to={`/profile?city=${encodeURIComponent(AreaSelected.cityContext)}&university=${encodeURIComponent(AreaSelected.universityContext)}`}>Profile</Link></li>
                            <li><Link to={`/booking-history?city=${encodeURIComponent(AreaSelected.cityContext)}&university=${encodeURIComponent(AreaSelected.universityContext)}`}>Booking History</Link></li>
                            {/* <li><Link to='/booking-history'>Booking History</Link></li> */}

                            {/*IMPORTANT: a box shadow issue was occuring thats why i used 'Link' instead of 'Navlink' */}
                        </ul>
                    </div>
                    <div className="bottom-section">
                        <GlowBtn
                            onClick={handleLogout}
                            loading={{ state: loading, text: "Logging out", loadColor: "var(--redish)" }}
                            glow="false"
                            text="LOG OUT"
                            style={{
                                fontSize: "0.7em",
                                fontWeight: "bold",
                                cursor: "pointer",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                backgroundColor: "rgba(255, 0, 0, 0.07)",
                                color: "var(--redish)",
                                transition: "all 0.3s ease",
                            }} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Menu;