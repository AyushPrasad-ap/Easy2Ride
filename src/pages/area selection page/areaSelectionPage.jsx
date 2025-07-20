import './areaSelectionPage.css';
import GlowBtn from '../../components/glow btn/glowBtn';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useAreaSelected } from '../../context/AreaSelected';





// importing images
import bigLogo from "/images/big-logo.svg";





function UniversityNotAvailablePopup({ show, onClose }) {

    // Automatically close the popup after 3 seconds if it's shown.
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer); // Clean up the timer when the component unmounts or show changes.
        }
    }, [show, onClose]);

    // If show is false, render nothing
    if (!show) return null;

    return (
        // <div className={`popup-container ${show ? "popup-active" : ""}`}>
        <div className="asp-popup-container">
            <div className="asp-progress-bar"></div>

            <h2>Coming Soon!</h2>
            <p>We are soon coming to your place...</p>
        </div>
    );
}

function AreaSelectionPage() {

    const navigate = useNavigate();
    const { setCityContext, setUniversityContext } = useAreaSelected(); //for storing the city and university in context values



    const [selectedCity, setSelectedCity] = useState("");
    const [selectedUniversity, setSelectedUniversity] = useState("");
    const [showUniversityPopup, setShowUniversityPopup] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const cityDropdownRef = useRef(null);
    const universityDropdownRef = useRef(null);
    const cityTextboxRef = useRef(null);
    const universityTextboxRef = useRef(null);

    const handleEnterClick = () => {
        if (selectedCity === "Jaipur") {
            if (selectedUniversity === "Manipal University Jaipur") {
                setCityContext(selectedCity);
                setUniversityContext(selectedUniversity);

                navigate(`/landing?city=${encodeURIComponent(selectedCity)}&university=${encodeURIComponent(selectedUniversity)}`);

            } else {
                setShowUniversityPopup(true);
            }
        } else {
            setShowUniversityPopup(true);
        }
    };

    const showCity = (text) => {
        setSelectedCity(text);
        setSelectedUniversity(""); // Clear university when city changes
        if (cityTextboxRef.current) {
            cityTextboxRef.current.value = text;
        }
        setActiveDropdown(null); // Close dropdown after selection
    };

    const showUniversity = (text) => {
        if (!selectedCity) return;
        setSelectedUniversity(text);
        if (universityTextboxRef.current) {
            universityTextboxRef.current.value = text;
        }
        setActiveDropdown(null); // Close dropdown after selection
    };

    // DUMMY DATA FOR CITIES AND UNIVERSITIES
    // You can replace this with your actual data fetching logic
    const universityOptions = {
        Jaipur: [
            'Manipal University Jaipur',
            'MNIT Jaipur',
            'Jaipur Engineering College',
            'Amity University Jaipur'
        ],
        Delhi: [
            'IIT Delhi',
            'NIT Delhi',
            'DTU, Delhi'
        ],
        Bangalore: [
            'IIT Bangalore',
            'MSRIT Bangalore'
        ],
        Mumbai: [
            'IIT Bombay',
            'DJ Sanghvi College',
            'NMIMS College'
        ]
    };

    useEffect(() => {
        if (cityDropdownRef.current) {
            cityDropdownRef.current.onclick = function () {
                cityDropdownRef.current.classList.toggle('asp-active');
            };
        }

        // Only attach click event to university dropdown if a city is selected
        if (universityDropdownRef.current) {
            universityDropdownRef.current.onclick = function () {
                // Toggle only if selectedCity exists
                if (selectedCity) {
                    universityDropdownRef.current.classList.toggle('asp-active');
                }
            };
        }
    }, [selectedCity]); // Dependency on selectedCity so that behavior updates

    return (
        <div className="asp-container">

            <UniversityNotAvailablePopup
                show={showUniversityPopup}
                onClose={() => setShowUniversityPopup(false)}
            />

            <img className='asp-logo' src={bigLogo} alt="" />
            <div className="asp-box">
                <h1>Easy2Ride</h1>

                <div className="asp-inputs">

                    {/* City Dropdown */}
                    <div
                        className={`asp-dropdown ${activeDropdown === 'city' ? 'asp-active' : ''}`}
                        ref={cityDropdownRef}
                        onClick={() => setActiveDropdown(activeDropdown === 'city' ? null : 'city')}
                    >
                        <input
                            type="text"
                            className='asp-textbox'
                            placeholder='Select City'
                            readOnly
                            ref={cityTextboxRef}
                            value={selectedCity}
                        />
                        <div className="asp-options">
                            {Object.keys(universityOptions).map((city, index) => (
                                <div key={index} onClick={() => showCity(city)}>
                                    {city}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* University Dropdown */}
                    <div
                        className={`asp-dropdown ${activeDropdown === 'university' ? 'asp-active' : ''}`}
                        ref={universityDropdownRef}
                        onClick={() => {
                            if (selectedCity) {
                                setActiveDropdown(activeDropdown === 'university' ? null : 'university');
                            }
                        }}
                    >
                        <input
                            type="text"
                            className='asp-textbox'
                            placeholder='Select nearby University'
                            readOnly
                            ref={universityTextboxRef}
                            value={selectedUniversity}
                        />
                        <div className="asp-options">
                            {selectedCity && universityOptions[selectedCity] ? (
                                universityOptions[selectedCity].map((option, index) => (
                                    <div key={index} onClick={() => showUniversity(option)}>
                                        {option}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: "10px", color: "rgba(255, 0, 0, 0.7)" }}>
                                    Please select a city first
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                <GlowBtn
                    disabled={!(selectedCity && selectedUniversity)}
                    text='ENTER'
                    glow='false'
                    borderRadius='10px'
                    onClick={handleEnterClick}
                    width='120px'
                    height='50px'
                    color='rgba(0, 0, 0, 0.37)'
                    style={{ fontSize: "1.2em", marginTop: "20px" }}
                />
            </div>
        </div>
    );
}

export default AreaSelectionPage;
