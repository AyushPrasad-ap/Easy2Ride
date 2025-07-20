import "./smallFooter.css";


// importing images
import arrowLogo_img from "/images/arrow_logo.svg";


function SmallFooter() {
    return (
        <footer className="footer">
            {/* sf stands for small footer */}
            <div className="container sf-container">
                <div className="group">
                    <div className="sf-uptop">
                        <img src={arrowLogo_img} alt="" />
                    </div>
                    <div className="company-name"><h1>EASY2RIDE</h1></div>
                </div>
                <div className="sf-copyright-mark">©2025 E2R</div>
            </div>
        </footer>
    );
}

export default SmallFooter;