
import "./loginPage.css"
import InputBox from "../../components/inputBox/inputBox";
import GlowBtn from "../../components/glow btn/glowBtn";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import { toast } from "react-toastify";




// importing images
import backIcon from "/images/interface icons/back icon.png";
import googleIcon from "/images/company icons/google_icon.png";
import githubIcon from "/images/company icons/github_icon.png";
import facebookIcon from "/images/company icons/facebook_icon.png";





function LoginPage() {

    const navigate = useNavigate();
    const firebase = useFirebase();


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loginError, setLoginError] = useState("");
    const [loading, setLoading] = useState(false);

    // if the user is already logged in, redirect to asp page
    useEffect(() => {
        if (!firebase.initializing && firebase.isLoggedIn) {
            navigate('/asp', { replace: true }); // Redirect to area selection page
        }
    }, [firebase.initializing, firebase.isLoggedIn, navigate]);



    // Checking if all inputs are filled
    const isDisabled = !email || !password;


    const handleSubmit = async () => {
        setLoading(true);
        try {
            const value = await firebase.loginUserWithEmailAndPassword(email, password);

            toast.success("Logged in as " + (value.user.displayName || value.user.email));
            navigate('/asp'); // redirecting to area selection page
        } catch (error) {
            console.error("Login Failed", error);

            switch (error.code) {
                case "auth/invalid-email":
                    setLoginError("Please enter a valid email address.");
                    break;
                case "auth/user-disabled":
                    setLoginError("This account has been disabled. Please contact support.");
                    break;
                case "auth/user-not-found":
                    setLoginError("No account found with this email.");
                    break;
                case "auth/wrong-password":
                    setLoginError("Incorrect password. Please try again.");
                    break;
                case "auth/too-many-requests":
                    setLoginError("Too many failed attempts. Please try again later.");
                    break;
                case "auth/network-request-failed":
                    setLoginError("Network error. Check your connection and try again.");
                    break;
                case "auth/invalid-credential":
                    setLoginError("Invalid credentials provided. Please try again.");
                    break;
                // case "auth/operation-not-allowed":
                //     setLoginError("Email/password sign-in is not enabled.");
                //     break;
                default:
                    setLoginError("Login failed: Unexpected Error");
                    console.error(error.message);
                    break;
            }

            setTimeout(() => {
                setLoginError("");
            }, 5000);
        } finally {
            setLoading(false);
        }
    };

    // function to handle errors from social media login
    const showAuthError = (error) => {
        switch (error.code) {
            case "auth/account-exists-with-different-credential":
                toast.error("An account already exists with the same email but different sign-in method.");
                break;
            case "auth/popup-closed-by-user":
                break;
            case "auth/cancelled-popup-request":
                toast.error("Only one popup request is allowed at a time.");
                break;
            case "auth/popup-blocked":
                toast.error("Popup blocked by browser. Please allow popups.");
                break;
            case "auth/network-request-failed":
                toast.error("Network error. Please check your internet connection.");
                break;
            default:
                toast.error("Signup failed");
                break;
        }
    };


    const handleGoogleLogin = async () => {
        try {
            const val = await firebase.loginWithGoogle();
            const user = val.user;

            // Check if user already exists
            const existingUser = await firebase.getData(`/users/${user.uid}`);

            const userData = {
                name: user.displayName
                    ? user.displayName
                        .split(' ')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                        .join(' ')
                    : "",
                email: user.email,
                phone: user.phoneNumber || "",
                signupMethod: "Google"
            };

            if (!existingUser) {
                // Create new user node
                await firebase.putData(`/users/${user.uid}`, userData);
            }

            toast.success("Logged in as " + (val.user.displayName || val.user.email));
            navigate('/asp'); // redirecting to area selection page
        } catch (err) {
            console.error("Google Login Failed", err);
            showAuthError(err);
        }
    };


    const handleFacebookLogin = async () => {
        try {
            const val = await firebase.loginWithFacebook();
            const user = val.user;

            // Check if user already exists
            const existingUser = await firebase.getData(`/users/${user.uid}`);

            const userData = {
                name: user.displayName
                    ? user.displayName
                        .split(' ')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                        .join(' ')
                    : "",
                email: user.email,
                phone: user.phoneNumber || "",
                signupMethod: "Facebook"
            };

            if (!existingUser) {
                // Create new user node
                await firebase.putData(`/users/${user.uid}`, userData);
            }

            toast.success("Logged in as " + (val.user.displayName || val.user.email));
            navigate('/asp'); // redirecting to area selection page
        } catch (err) {
            console.error("Facebook Login Failed", err);
            showAuthError(err);
        }
    };


    const handleGithubLogin = async () => {
        try {
            const val = await firebase.loginWithGithub();
            const user = val.user;

            // Check if user already exists
            const existingUser = await firebase.getData(`/users/${user.uid}`);

            const userData = {
                name: user.displayName
                    ? user.displayName
                        .split(' ')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                        .join(' ')
                    : "",
                email: user.email,
                phone: user.phoneNumber || "",
                signupMethod: "GitHub"
            };

            if (!existingUser) {
                // Create new user node
                await firebase.putData(`/users/${user.uid}`, userData);
            }

            toast.success("Logged in as " + (val.user.displayName || val.user.email));
            navigate('/asp'); // redirecting to area selection page
        } catch (err) {
            console.error("GitHub Login Failed", err);
            showAuthError(err);
        }
    };


    return (
        <div className="lp-container">
            <button onClick={() => navigate('/landing')} className="lp-back-btn">
                <img style={{ cursor: 'pointer' }} src={backIcon} alt="back btn" />
            </button>
            <div className="lp-sub-container">

                <div className="lp-top-section">
                    <h3>Login to your account.</h3>
                    <p>Hello, welcome back to your account</p>
                </div>

                <div className="lp-inputs placeCenter-column">
                    <InputBox onChange={(value) => setEmail(value)} typeName="email" labelName="E-mail" activeColorValue="#6A6DEE" defaultColorValue="#494949" style={{ width: "90%", height: "60px", maxWidth: "370px" }} />

                    <InputBox onChange={(value) => setPassword(value)} typeName="password" labelName="Password" activeColorValue="#6A6DEE" defaultColorValue="#494949" eye={true} style={{ width: "90%", height: "60px", maxWidth: "370px" }} />
                </div>

                <button className="lp-forgot-password-btn">Forgot Password?</button>

                <div id="lp-login-btn">
                    <GlowBtn
                        disabled={isDisabled || loading}
                        loading={{ state: loading, text: "Logging In" }}
                        onClick={handleSubmit}
                        blur="0px"
                        text="Login"
                        color="#6a6dee"
                        borderRadius="10px"
                        style={{ width: "90%", height: "60px", maxWidth: "370px", fontSize: "1.4em", fontWeight: "200" }} />
                </div>
                {loginError && <p className="sup-login-error">{loginError}</p>}



                {/* other login options */}

                <div className="lp-separator">
                    <p>or Login with</p>
                </div>

                <div className="lp-login-options placeCenter-row">
                    <div className="lp-option">
                        <img onClick={handleGoogleLogin} src={googleIcon} alt="google" />
                    </div>
                    <div className="lp-option">
                        <img onClick={handleGithubLogin} src={githubIcon} alt="github" />
                    </div>
                    <div className="lp-option">
                        <img onClick={handleFacebookLogin} src={facebookIcon} alt="facebook" />
                    </div>
                </div>




                {/* if user doesn't have an account */}
                <p className="no-account">Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span> </p>

            </div>
        </div>
    );
}

export default LoginPage;