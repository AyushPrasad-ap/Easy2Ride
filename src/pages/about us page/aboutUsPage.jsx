import "./aboutUsPage.css"
import Menu from "../../components/hamburgerMenu/menu";
import LargeFooter from "../../components/LargeFooter/LargeFooter";



// importing images
import e2rDesignedLogo from "/images/e2r-designed-logo.svg";




function AboutUsPage() {
    return (
        <div className="aboutUs-page-container">
            <div className="aboutUs-page-body">
                <div className="aboutUs-top-section placeCenter-row">
                    <div className="placeCenter-row">
                        <h1 className="margin-right-10">About Us |</h1>
                        <img width={55} src={e2rDesignedLogo} alt="e2r logo" />
                    </div>
                    <Menu />
                </div>

                <div className="aboutUs-content">

                    <div className="aboutUs-info-section">
                        <h2>Who we are</h2>
                        <p>Welcome to Easy2Ride, your go-to platform for hassle-free two-wheeler rentals! We aim to provide students and travelers with an affordable, convenient, and seamless way to rent bikes and scooters. Whether you're commuting to college, exploring the city, or running errands, we’ve got the perfect ride for you.</p>
                    </div>
                    <div className="aboutUs-info-section">
                        <h2>Our Mission</h2>
                        <p>At Easy2Ride, we believe in freedom and flexibility. We found the traditional booking method, of physically going over there, very cumbersome. So we brought it ONLINE!</p>
                    </div>
                    <div className="aboutUs-info-section">
                        <h2>How It Works?</h2>

                        <ol className="padding-left-20">
                            <li>
                                Enter Your Location - Select your pickup point near your campus.
                            </li>
                            <li>
                                Choose Your Ride - Pick from a variety of well-maintained two-wheelers.
                            </li>
                            <li>
                                Quickly upload your documents for verification.
                            </li>
                            <li>
                                Book & Ride - Confirm your booking, grab your helmet, and hit the road!
                            </li>
                        </ol>

                    </div>
                    <div className="aboutUs-info-section custom-tick">
                        <h2>Why Choose Easy2Ride?</h2>
                        <ul>
                            <li>
                                Convenient Booking - Rent a bike in just a few clicks.
                            </li>
                            <li>
                                Affordable Pricing - No hidden charges, just pocket-friendly rates.
                            </li>
                            <li>
                                Wide Range of Bikes - From scooters to sports bikes, we've got it all.
                            </li>
                            <li>
                                Safe & Secure - Verified vehicles, insured rides, and 24/7 support.
                            </li>
                            <li>
                                Flexible Pickup & Drop - Multiple locations for added convenience.
                            </li>
                        </ul>
                    </div>
                    <div className="aboutUs-info-section no-margin">
                        <h2>Join the E2R Community</h2>
                        <p>
                            We are more than just a rental service—we're a community of riders who value ease, efficiency, and affordability. Join us in redefining the way people move around the city.

                            <br />
                            <br />

                            Ready to ride? Start your journey with Easy2Ride today!

                            <br />
                            <br />

                            📍 Location: <br />
                            Manipal University Jaipur

                            <br />
                            <br />

                            📞 Contact Us: <br />
                            support.easy2ride@gmail.com

                            <br />
                            <br />

                            Follow us on: <br />
                            🔹 [Instagram]  🔹 [Twitter]
                        </p>
                    </div>

                </div>

            </div>

            <div className="aboutUs-footer">
                <LargeFooter />
            </div>
        </div>
    );
}

export default AboutUsPage;