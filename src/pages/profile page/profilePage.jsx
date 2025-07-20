import "./profilePage.css"
import { useState, useEffect } from "react";
import LargeFooter from "../../components/LargeFooter/LargeFooter";
import GlowBtn from "../../components/glow btn/glowBtn";
import { useNavigate, useLocation } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import { toast } from "react-toastify";
import { useAreaSelected } from '../../context/AreaSelected';

// Importing the CSS file for the loader animation
import "../../Animated Loaders/BookLoader.css";



// importing imgs
import editIcon from "/images/interface icons/edit icon.svg";
import uploadIcon from "/images/interface icons/upload icon.svg";
import homeIcon from "/images/interface icons/home icon.png";
import bgImg from "/images/bg img.jpg";
import profileHeaderSubtractImg from "/images/profile-header-subtract-img.svg";





// DETAIL SECTION ---------------------------------------------------------
function DetailCard({ name, phone, setName, setPhone, email, firebase }) {

    const [displaySaveBtn, setDisplaySaveBtn] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedPhone, setEditedPhone] = useState(phone);
    const [isLoading, setIsLoading] = useState(false);


    const handleNameChange = (e) => {
        setEditedName(e.target.value);
        setDisplaySaveBtn(true);
    };

    const handlePhoneChange = (e) => {
        setEditedPhone(e.target.value);
        setDisplaySaveBtn(true);
    };

    const handleSave = async () => {

        const nameRegex = /^[a-zA-Z\s]{1,50}$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!nameRegex.test(editedName)) {
            toast.error("Name can only contain letters.");
            return;
        }
        if (!phoneRegex.test(editedPhone)) {
            toast.error("Enter a valid Phone Number.");
            return;
        }

        setIsLoading(true);

        try {
            const uid = firebase.currentUser?.uid;

            if (!uid) throw new Error("User not logged in.");

            await firebase.updateData(`/users/${uid}`, {
                //saving the name in title case format
                name: editedName.split(' ')
                    .map(w => w[0].toUpperCase() + w.slice(1))
                    .join(' '),
                phone: editedPhone
            });

            // update parent state
            setName(editedName);
            setPhone(editedPhone);
            setDisplaySaveBtn(false);
            toast.success("Profile updated successfully.");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <>
            <div className="card-container">
                <h2>Details</h2>

                <div className="card-container-content">

                    <h6>Name</h6>
                    <div className="placeCenter-row space-between">
                        <input id="name-field" type="text" value={editedName} onChange={handleNameChange} />
                        <label htmlFor="name-field"><img src={editIcon} alt="edit icon" /></label>
                    </div>

                    <h6>Phone Number</h6>
                    <div className="placeCenter-row space-between">
                        <input id="phone-field" type="tel" value={editedPhone} onChange={handlePhoneChange} maxLength={10} />
                        <label htmlFor="phone-field"><img src={editIcon} alt="edit icon" /></label>
                    </div>

                    <h6 >Email</h6>
                    <div className="placeCenter-row space-between">
                        <p className="no-margin">{email}</p>
                    </div>

                </div>
            </div>
            {
                displaySaveBtn
                &&
                <GlowBtn
                    disabled={isLoading}
                    onClick={handleSave}
                    loading={{ state: isLoading, text: "Saving" }}
                    glow="false"
                    text="Save"
                    color="var(--bluish)"
                    width="90%"
                    height="40px"
                    borderRadius="5px"
                    style={{
                        margin: "-10px 0 10px 0"
                    }}
                />
            }
        </>
    );
}


// PASSWORD SECTION ---------------------------------------------------------
function PasswordCard({ password, setPassword }) {

    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="card-container">
            <h2>Password</h2>
            <div className="card-container-content">
                <div className="placeCenter-row space-between">
                    <input className="no-margin" id="password-field" value={password} onChange={(e) => setPassword(e.target.value)} type={isEditing ? "text" : "password"} onFocus={() => setIsEditing(true)} onBlur={() => setIsEditing(false)} />
                    <label htmlFor="password-field"><img src={editIcon} alt="edit icon" /></label>
                </div>
            </div>
        </div>
    );
}


// TRAVEL DOCUMENT SECTION ---------------------------------------------------------
function DocDetailCard({ licensePreview, setLicensePreview, idPreview, setIdPreview, universityPreview, setUniversityPreview }) {
    const handleFileChange = (event, setPreview) => {
        const file = event.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file)); // Create preview URL
        }
    };

    // I am not storing these files in the database yet, (I have to purchase a firebase storage plan for that)

    return (
        <div className="card-container">
            <h2>Travel Document Details</h2>
            <div className="card-container-content">

                {/* Driving License Upload */}
                <input id="drivingLicense" type="file" accept=".jpg, .jpeg, .png, .pdf" onChange={(e) => handleFileChange(e, setLicensePreview)} />
                <label htmlFor="drivingLicense" className="tdc-labels placeCenter-row space-between">
                    Upload Driver's License
                    <img src={uploadIcon} alt="upload icon" />
                </label>
                {licensePreview && <img src={licensePreview} alt="License Preview" className="doc-preview" />} {/* Show preview */}

                {/* Government ID Upload */}
                <input id="governmentID" type="file" accept=".jpg, .jpeg, .png, .pdf" onChange={(e) => handleFileChange(e, setIdPreview)} />
                <label htmlFor="governmentID" className="tdc-labels placeCenter-row space-between">
                    Upload Aadhar card
                    <img src={uploadIcon} alt="upload icon" />
                </label>
                {idPreview && <img src={idPreview} alt="ID Preview" className="doc-preview" />} {/* Show preview */}

                {/* University ID Upload */}
                <input id="universityID" type="file" accept=".jpg, .jpeg, .png, .pdf" onChange={(e) => handleFileChange(e, setUniversityPreview)} />
                <label htmlFor="universityID" className="tdc-labels placeCenter-row space-between">
                    Upload University ID
                    <img src={uploadIcon} alt="upload icon" />
                </label>
                {universityPreview && <img src={universityPreview} alt="University ID Preview" className="doc-preview" />} {/* Show preview */}

            </div>
        </div>
    );
}


// GENERAL DETAIL SECTION ---------------------------------------------------------
function GeneralDetailCard({ age, DOB, gender, setAge, setDOB, setGender, firebase }) {

    const [editedAge, setEditedAge] = useState(age);
    const [editedDOB, setEditedDOB] = useState(DOB);
    const [editedGender, setEditedGender] = useState(gender);
    const [displaySaveBtn, setDisplaySaveBtn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAgeChange = e => {
        setEditedAge(e.target.value);
        setDisplaySaveBtn(true);
    };
    const handleDOBChange = e => {
        setEditedDOB(e.target.value);
        setDisplaySaveBtn(true);
    };
    const handleGenderChange = e => {
        setEditedGender(e.target.value);
        setDisplaySaveBtn(true);
    };

    const handleSave = async () => {

        const ageRegex = /^[1-9][0-9]?$/;
        if (!ageRegex.test(editedAge)) {
            toast.error("Enter a valid Age!");
            return;
        }


        setIsLoading(true);
        try {
            const uid = firebase.currentUser?.uid;
            if (!uid) throw new Error("Not logged in");
            await firebase.updateData(`/users/${uid}`, {
                age: editedAge,
                DOB: editedDOB,
                gender: editedGender
            });
            // propagate up
            setAge(editedAge);
            setDOB(editedDOB);
            setGender(editedGender);
            setDisplaySaveBtn(false);
            toast.success("Profile updated successfully.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <>
            <div className="card-container">
                <h2>General Details</h2>

                <div className="card-container-content">

                    <h6>Age</h6>
                    <div className="placeCenter-row space-between">
                        <input id="age-field" type="tel" value={editedAge} onChange={handleAgeChange} maxLength={2} placeholder="-" />
                        <label htmlFor="age-field"><img src={editIcon} alt="edit icon" /></label>
                    </div>

                    <h6>DOB</h6>
                    <div className="placeCenter-row space-between">
                        <input id="DOB-field" type="date" value={editedDOB} onChange={handleDOBChange} className="hide-calendar-icon" />
                        <label htmlFor="DOB-field"><img src={editIcon} alt="edit icon" /></label>
                    </div>

                    <h6>Gender</h6>
                    <div className="placeCenter-row space-between">
                        <select
                            id="gender-field"
                            value={editedGender}
                            onChange={handleGenderChange}
                            className="no-margin"
                        >
                            <option value="Select a gender">Select a gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                </div>
            </div>

            {displaySaveBtn && (
                <GlowBtn
                    disabled={isLoading}
                    loading={{ state: isLoading, text: "Saving" }}
                    onClick={handleSave}
                    glow="false"
                    text="Save"
                    color="var(--bluish)"
                    width="90%"
                    height="40px"
                    borderRadius="5px"
                    style={{ margin: "-10px 0 10px" }}
                />
            )}
        </>
    );
}


function ProfilePage() {

    const firebase = useFirebase();
    const navigate = useNavigate();
    const AreaSelected = useAreaSelected();
    const location = useLocation();


    // Extracting city and university from the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get("city");
    const university = queryParams.get("university");

    // state management for detail card
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    // state management for password card
    const [password, setPassword] = useState("abcdefg");

    // state management travel document card for password card
    const [licensePreview, setLicensePreview] = useState(null);
    const [idPreview, setIdPreview] = useState(null);
    const [universityPreview, setUniversityPreview] = useState(null);

    // state management for general detail card
    const [age, setAge] = useState("");
    const [DOB, setDOB] = useState("");
    const [gender, setGender] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [logoutLoad, setLogoutLoad] = useState(false);
    const [email, setEmail] = useState("");

    const [bookingCount, setBookingCount] = useState(0);


    // updating the context values of city and university. {when the pages reloads, context values are lost, but the url values are not lost. So, I am updating the context values with the url values.}
    useEffect(() => {
        if (!AreaSelected.cityContext && city) {
            AreaSelected.setCityContext(city);
        }

        if (!AreaSelected.universityContext && university) {
            AreaSelected.setUniversityContext(university);
        }
    }, [city, university]);


    useEffect(() => {
        if (!firebase.currentUser) return;

        (async () => {
            setIsLoading(true);
            try {
                const user = await firebase.getData(`/users/${firebase.currentUser.uid}`);
                setName(
                    user?.name                                  // 1st option
                    ?? firebase.currentUser.displayName         // 2nd option
                    ?? "User-Name"                              // default option
                );
                setPhone(user?.phone ?? "");
                setEmail(user?.email);
                setAge(user?.age ?? "");
                setDOB(user?.DOB ?? "");
                setGender(user?.gender ?? "");


                // Fetching booking count from Firestore
                const count = await firebase.getFirestoreDocCount(`bookings/${firebase.currentUser.uid}/userBookings`);
                setBookingCount(count);

            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [firebase, firebase.currentUser]);


    if (isLoading) {
        return (
            <div className="book-loader" style={{
                position: "absolute",
                transform: "translate(-50%,-50%)",
                left: "50%",
                top: "50%",
            }}></div>
        );
    }


    const handleLogout = async () => {
        setLogoutLoad(true);
        await firebase.logoutUser();
        setLogoutLoad(false);

        navigate('/login');
    }



    return (
        <div className="profile-page-container">


            {/* PROFILE PAGE HEADER */}
            <div className="profile-page-header">
                <img src={bgImg} alt="" className="profile-bg-image" />
                <div className="floating-bar">
                    <div className="relative-container">
                        <img src={profileHeaderSubtractImg} alt="" />
                        <div className="profile-user-icon">{name.charAt(0).toUpperCase()}</div>
                        <h2 className="overflowHidden">{name.trim().split(/\s+/)[0]}</h2>
                        <p>Rides Booked: {bookingCount}</p>
                    </div>
                </div>

                <img onClick={() => navigate(`/home?city=${city}&university=${university}`)} className="profile-home-btn" style={{ cursor: 'pointer' }} src={homeIcon} alt="home button" />
            </div>


            {/* PROFILE PAGE CONTENT */}
            <div className="profile-page-content">
                <DetailCard name={name} phone={phone} setName={setName} setPhone={setPhone} email={email} firebase={firebase} />

                {/* TO BE IMPLEMENTED LATER... */}
                {/* <PasswordCard password={password} setPassword={setPassword} /> */}

                <DocDetailCard
                    licensePreview={licensePreview} setLicensePreview={setLicensePreview}
                    idPreview={idPreview} setIdPreview={setIdPreview}
                    universityPreview={universityPreview} setUniversityPreview={setUniversityPreview}
                />

                <GeneralDetailCard age={age} DOB={DOB} gender={gender} setAge={setAge} setDOB={setDOB} setGender={setGender} firebase={firebase} />

                <GlowBtn
                    onClick={handleLogout}
                    loading={{ state: logoutLoad, text: "Logging out" }}
                    // glow="false"
                    text="LOG OUT"
                    className="profile-pg-logout-btn"
                    color="var(--redish)"
                    borderRadius="10px"
                />
            </div>



            {/* PROFILE PAGE FOOTER */}
            <div className="profile-page-footer">
                <LargeFooter />
            </div>
        </div>
    );
}

export default ProfilePage;




