// THIS IS READY


import "./signup.css"
import InputBox from "../../components/inputBox/inputBox";
import GlowBtn from "../../components/glow btn/glowBtn";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";




// importing images
import backIcon from "/images/interface icons/back icon.png";
import googleIcon from "/images/company icons/google_icon.png";
import githubIcon from "/images/company icons/github_icon.png";
import facebookIcon from "/images/company icons/facebook_icon.png";





function SignupPage() {

    const navigate = useNavigate();
    const firebase = useFirebase();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [nameError, setNameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [signupError, setSignupError] = useState("");
    const [loading, setLoading] = useState(false);


    // if the user is already logged in, redirect to asp page
    useEffect(() => {
        if (!firebase.initializing && firebase.isLoggedIn) {
            navigate('/asp', { replace: true }); // Redirect to area selection page
        }
    }, [firebase.initializing, firebase.isLoggedIn, navigate]);



    // Checking if all inputs are filled
    const isDisabled = !name || !phone || !email || !password;



    const validateInputs = () => {
        let isValid = true;

        // validating the inputs
        const nameRegex = /^[a-zA-Z\s]{1,50}$/;
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

        if (!nameRegex.test(name)) {
            setNameError("*Name can only contain letters.");
            isValid = false;
        } else {
            setNameError("");
        }

        if (!phoneRegex.test(phone)) {
            setPhoneError("*Phone number must be exactly 10 digits.");
            isValid = false;
        } else {
            setPhoneError("");
        }

        if (!emailRegex.test(email)) {
            setEmailError("*Please enter a valid email address.");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!passwordRegex.test(password)) {
            setPasswordError("*Password must be more than 8 characters and must include uppercase, lowercase, a number, and a special character.");
            isValid = false;
        } else {
            setPasswordError("");
        }



        if (isValid) {
            emailPasswordSignup();
        }
    };

    const emailPasswordSignup = async () => {
        setLoading(true);
        try {
            const userCredential = await firebase.signupUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            // Updating display name
            await updateProfile(user, {
                displayName: name.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
            });

            // Saving user info in Realtime Database
            const userId = user.uid;
            firebase.putData(`/users/${userId}`, {
                //saving the name in title case format
                name: name.split(' ')
                    .map(w => w[0].toUpperCase() + w.slice(1))
                    .join(' '),
                phone: phone,
                email: email,
                signupMethod: "Email"
            });

            toast.success("Signup Successful.");
            navigate('/asp'); // redirect to area selection page
        } catch (error) {
            console.error("Signup failed:", error);

            // error handling for better user experience
            switch (error.code) {
                case "auth/email-already-in-use":
                    setSignupError("This email is already in use!");
                    break;
                case "auth/invalid-email":
                    setSignupError("Please enter a valid email address.");
                    break;
                case "auth/weak-password":
                    setSignupError("Password is too weak.");
                    break;
                case "auth/operation-not-allowed":
                    setSignupError("Email/password sign-up is currently disabled.");
                    break;
                case "auth/network-request-failed":
                    setSignupError("Network error. Please check your internet connection.");
                    break;
                case "auth/internal-error":
                    setSignupError("An unexpected error occurred. Please try again.");
                    break;
                default:
                    setSignupError("Signup failed: Unexpected Error");
                    console.error(error.message);
                    break;
            }

            // Automatically clears the error after 5 seconds
            setTimeout(() => {
                setSignupError("");
            }, 5000);
        } finally {
            setLoading(false);
        }
    };

    // function to handle errors from social media signup
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

    const handleGoogleSignup = async () => {
        try {
            const result = await firebase.signupWithGoogle();
            const user = result.user;

            // Save user info in Realtime Database
            firebase.putData(`/users/${user.uid}`, {
                name: user.displayName
                    ? user.displayName
                        .split(' ')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                        .join(' ')
                    : "",
                email: user.email,
                phone: user.phoneNumber || "",
                signupMethod: "Google"
            });


            toast.success("Signed in as " + (user.displayName || user.email));
            navigate('/asp'); // redirect to area selection page
        } catch (error) {
            console.error("Google signup failed:", error);
            showAuthError(error);
        }
    };

    const handleFacebookSignup = async () => {
        try {
            const result = await firebase.signupWithFacebook();
            const user = result.user;

            // Save user info in Realtime Database
            firebase.putData(`/users/${user.uid}`, {
                name: user.displayName
                    ? user.displayName
                        .split(' ')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                        .join(' ')
                    : "",
                email: user.email,
                phone: user.phoneNumber || "",
                signupMethod: "Facebook"
            });

            toast.success("Signed in as " + (user.displayName || user.email));
            navigate('/asp'); // redirect to area selection page
        } catch (error) {
            console.error("Facebook signup failed:", error);
            showAuthError(error);
        }
    };

    const handleGithubSignup = async () => {
        try {
            const result = await firebase.signupWithGithub();
            const user = result.user;

            // Save user info in Realtime Database
            firebase.putData(`/users/${user.uid}`, {
                name: user.displayName
                    ? user.displayName
                        .split(' ')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                        .join(' ')
                    : "",
                email: user.email,
                phone: user.phoneNumber || "",
                signupMethod: "GitHub"
            });

            toast.success("Signed in as " + (user.displayName || user.email));
            navigate('/asp'); // redirect to area selection page
        } catch (error) {
            console.error("GitHub signup failed:", error);
            showAuthError(error);
        }
    };

    return (
        <div className="sup-container">
            <button onClick={() => navigate('/login')} className="sup-back-btn">
                <img style={{ cursor: 'pointer' }} src={backIcon} alt="back btn" />
            </button>
            <div className="sup-sub-container">

                <div className="sup-top-section">
                    <h3>Create an account</h3>
                    <p>Get Started 🚀</p>
                </div>

                <div className="sup-inputs placeCenter-column">
                    <InputBox onChange={(value) => setName(value)} typeName="text" labelName="Full Name" activeColorValue="#6A6DEE" defaultColorValue="#494949" style={{ width: "90%", height: "60px", maxWidth: "370px" }} />
                    {nameError && <p className="sup-input-error">{nameError}</p>}

                    <InputBox onChange={(value) => setPhone(value)} typeName="tel" labelName="Phone" activeColorValue="#6A6DEE" defaultColorValue="#494949" maxLength="10" style={{ width: "90%", height: "60px", maxWidth: "370px" }} />
                    {phoneError && <p className="sup-input-error">{phoneError}</p>}

                    <InputBox onChange={(value) => setEmail(value)} typeName="email" labelName="E-mail" activeColorValue="#6A6DEE" defaultColorValue="#494949" style={{ width: "90%", height: "60px", maxWidth: "370px" }} />
                    {emailError && <p className="sup-input-error">{emailError}</p>}

                    <InputBox onChange={(value) => setPassword(value)} typeName="password" labelName="Password" activeColorValue="#6A6DEE" defaultColorValue="#494949" eye={true} style={{ width: "90%", height: "60px", maxWidth: "370px" }} />
                    {passwordError && <p className="sup-input-error">{passwordError}</p>}
                </div>


                <div id="sup-signup-btn">
                    <GlowBtn
                        disabled={isDisabled || loading}
                        loading={{ state: loading, text: "Signing Up" }}
                        onClick={validateInputs}
                        blur="0px"
                        text="Sign Up"
                        color="#6a6dee"
                        borderRadius="10px"
                        style={{
                            width: "90%",
                            height: "60px",
                            maxWidth: "370px",
                            fontSize: "1.4em",
                            fontWeight: "200"
                        }}
                    />
                </div>
                {signupError && <p className="sup-signup-error">{signupError}</p>}



                {/* other signup options */}

                <div className="sup-separator">
                    <p>or Signup with</p>
                </div>

                <div className="sup-signup-options placeCenter-row">
                    <div className="sup-option">
                        <img onClick={handleGoogleSignup} src={googleIcon} alt="google" />
                    </div>
                    <div className="sup-option">
                        <img onClick={handleGithubSignup} src={githubIcon} alt="github" />
                    </div>
                    <div className="sup-option">
                        <img onClick={handleFacebookSignup} src={facebookIcon} alt="facbook" />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SignupPage;