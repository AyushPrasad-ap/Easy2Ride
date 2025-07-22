import "./LargeFooter.css";

// importing images
import upArrow from "/images/arrow_logo.svg";
import twitterSymbol from "/images/company icons/twitter_symbol.png";
import linkedinSymbol from "/images/company icons/linkedin_symbol.png";
import facebookSymbol from "/images/company icons/facebook_symbol.png";
import instagramSymbol from "/images/company icons/instagram_symbol.png";

function LargeFooter() {

    // Function to scroll to the top smoothly
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const gotoLinkedIn = () => {
        window.open("https://www.linkedin.com/in/ayush-prasad-ap/", "_blank");
    }

    return (
        <footer className="footer">
            <div className="uptop" onClick={scrollToTop}>
                <img src={upArrow} alt="go up" />
            </div>
            <div className="container">
                <div className="name">
                    <div className="company-name"><h1>EASY2RIDE</h1></div>
                    <div className="developer-name">
                        <p>Ayush</p>
                        <p>Aditya</p>
                    </div>
                </div>
                <div className="quick-links" onClick={gotoLinkedIn} style={{ cursor: "pointer" }}>
                    <div className="links-column">
                        <p>Terms of Use</p>
                        <p>Privacy Policy</p>
                        <p>License Agreement</p>
                        <p>Blogs</p>
                    </div>
                    <div className="links-column">
                        <p>Company</p>
                        <p>Contact Us</p>
                        <p>Join Us</p>
                    </div>
                </div>
                <div className="social-handles">
                    <a href="https://www.linkedin.com/in/ayush-prasad-ap/" target="_blank" rel="noopener noreferrer">
                        <img src={twitterSymbol} alt="twitter" />
                    </a>
                    <a href="https://www.linkedin.com/in/ayush-prasad-ap/" target="_blank" rel="noopener noreferrer">
                        <img src={linkedinSymbol} alt="linkedin" />
                    </a>
                    <a href="https://www.linkedin.com/in/ayush-prasad-ap/" target="_blank" rel="noopener noreferrer">
                        <img src={facebookSymbol} alt="facebook" />
                    </a>
                    <a href="https://www.linkedin.com/in/ayush-prasad-ap/" target="_blank" rel="noopener noreferrer">
                        <img src={instagramSymbol} alt="instagram" />
                    </a>
                </div>
                <div className="copyright-mark">©2025 E2R | ALL RIGHTS RESERVED</div>
            </div>
        </footer>
    );
};

export default LargeFooter;
