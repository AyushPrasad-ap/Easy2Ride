import "./landingPage.css"
import Header from "../../components/header/header";
import LargeFooter from "../../components/LargeFooter/LargeFooter";
import SearchBar from "../../components/searchBar/searchBar";
import OutlineBtn from "../../components/outline btn/outlineBtn";
import { useNavigate, useLocation } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import { toast } from "react-toastify";
import { useAreaSelected } from '../../context/AreaSelected';
import { useEffect } from "react";





// importing images
import heroImg1 from "/images/2D vector illustrations/hero_img1.png";
import heroImg2 from "/images/2D vector illustrations/hero_img2.png";
import searchGif from "/images/gifs/search.gif";
import dateAndTimeGif from "/images/gifs/date and time.gif";
import documentUploadGif from "/images/gifs/document upload.gif";
import motorcycleGif from "/images/gifs/motorcycle.gif";
import bikegangImg from "/images/2D vector illustrations/bikeGang_img.jpg";








function LandingPage() {

    const navigate = useNavigate();
    const firebase = useFirebase();
    const AreaSelected = useAreaSelected();


    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const city = AreaSelected.cityContext || params.get('city');
    const university = AreaSelected.universityContext || params.get('university');

    // updating the context values of city and university. {when the pages reloads, context values are lost, but the url values are not lost. So, I am updating the context values with the url values.}
    useEffect(() => {
        if (!AreaSelected.cityContext && params.get('city')) {
            AreaSelected.setCityContext(params.get('city'));
        }

        if (!AreaSelected.universityContext && params.get('university')) {
            AreaSelected.setUniversityContext(params.get('university'));
        }
    }, []);



    // Handling search and passing the search value to home page
    const handleSearch = (searchValue) => {

        // the user has to be logged in to search for vehicles
        if (firebase.isLoggedIn) {
            navigate(`/home?searchValue=${encodeURIComponent(searchValue)}&city=${encodeURIComponent(city)}&university=${encodeURIComponent(university)}`);
        }
        else {
            toast.error("Please login to continue.");

        }
    };

    const handleRidenow = () => {
        // the user has to be logged in , in order to proceed to home page
        if (firebase.isLoggedIn) {
            navigate(`/home?city=${encodeURIComponent(city)}&university=${encodeURIComponent(university)}`);
        }
        else {
            toast.error("Please login to continue.");
        }
    }

    return (
        <div className="landing-page-container">
            <div className="landing-header">
                <Header />
            </div>

            <div className="landing-body">

                <div className="landing-hero-section">
                    <img id="left-img" width={"80px"} src={heroImg1} alt="img" />
                    <img id="right-img" width={"80px"} src={heroImg2} alt="img" />

                    <h1>Find the</h1>
                    <h1>Perfect Wheels</h1>
                    <h1>for your trip.</h1>
                </div>

                <div className="landing-page-sb">
                    <SearchBar
                        width={"100%"}
                        style={{ maxWidth: "400px", margin: "0 auto" }}
                        showClearBtn={false}
                        onSearch={handleSearch}
                    />
                </div>

                {/* <div className="area-selected">
                    <p>{city}</p>
                    <p>{university}</p>
                </div> */}

                <div className="working-section">
                    <h3>How it works</h3>
                    <div className="working-steps">
                        <div className="working-step">
                            <img width={"140px"} src={searchGif} alt="gif" />
                            <div>
                                <p>Step 1</p>
                                <p>Browse vehicle as per your need.</p>
                            </div>
                        </div>
                        <div className="working-step">
                            <img width={"140px"} src={dateAndTimeGif} alt="gif" />
                            <div>
                                <p>Step 2</p>
                                <p>Select time and duration.</p>
                            </div>
                        </div>
                        <div className="working-step">
                            <img width={"140px"} src={documentUploadGif} alt="gif" />
                            <div>
                                <p>Step 3</p>
                                <p>Upload your documents.</p>
                            </div>
                        </div>
                        <div className="working-step" id="last-step">
                            <img width={"140px"} src={motorcycleGif} alt="gif" />
                            <div>
                                <p>Step 4</p>
                                <p>Enjoy your ride.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="explore-section">
                    <h3>Explore</h3>

                    <div className="explore-content">
                        <div className="placeCenter-column">
                            <img width={"95%"} src={bikegangImg} alt="img" />
                            <p>Gear up and check out the coolest rides waiting for you!</p>
                        </div>

                        <OutlineBtn onClick={handleRidenow} text="Ride Now" />
                    </div>
                </div>
            </div>

            <div className="landing-footer">
                <LargeFooter />
            </div>
        </div>
    );
}

export default LandingPage;