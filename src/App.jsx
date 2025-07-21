// ----------------------------------------------(14components)
import GlowBtn from './components/glow btn/glowBtn.jsx';
import OutlineBtn from './components/outline btn/outlineBtn.jsx';
import LargeFooter from './components/LargeFooter/LargeFooter.jsx';
import SmallFooter from './components/Small Footer/smallFooter.jsx';
import SearchBar from './components/searchBar/searchBar.jsx';
import InputBox from './components/inputBox/inputBox.jsx';
import Menu from './components/hamburgerMenu/menu.jsx';
import Header from './components/header/header.jsx';
import FilterDropdown from './components/filter dropdown/filterDropdown.jsx';
import CPD from './components/cancellation Policy dropdown/CPD.jsx';
import VehicleCard from './components/vehicle card/vehicleCard.jsx';
import RatingCard from './components/rating card/ratingCard.jsx';
import OngoingBC from './components/ongoing booking card/ongoingBC.jsx';
import PreviousBC from './components/previous booking card/previousBC.jsx';
// ----------------------------------------------(13pages)
import ProfilePage from './pages/profile page/profilePage.jsx';
import AboutUsPage from './pages/about us page/aboutUsPage.jsx';
import BookingHistoryPage from './pages/booking history page/bookingHistory.jsx';
import BookingDetailPage from './pages/booking detail page/bookingDetailPage.jsx';
import CancellationPage from './pages/cancellation page/cancellationPage.jsx';
import LoginPage from './pages/login page/loginPage.jsx';
import SignupPage from './pages/signup page/signup.jsx';
import LandingPage from './pages/landing page/landingPage.jsx';
import HomePage from './pages/home page/homePage.jsx';
import ProductDetailPage from './pages/product detail page/productDetailPage.jsx';
import CheckoutPage from './pages/checkout page/checkoutPage.jsx';
import PaymentPage from './pages/payment page/payementPage.jsx';
import PaymentSuccessfulPage from './pages/payment successful page/paymentSuccessfulPage.jsx';
import AreaSelectionPage from './pages/area selection page/areaSelectionPage.jsx';
// ----------------------------------------------(React Router)
import { Routes, Route } from 'react-router-dom';
// ----------------------------------------------(Firebase)
import { useFirebase } from "./context/firebase.jsx";
// ----------------------------------------------(others)
import { useGlobalBookingAutoUpdater } from "./hooks/useGlobalBookingAutoUpdater";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";





function App() {

  // This hook will check all user bookings every 10 minutes and update their status from "confirmed" to "completed" if the end time has passed
  const firebase = useFirebase();
  useGlobalBookingAutoUpdater(firebase);

  return (
    <>

      {/* <div style={{ height: "100px" }}></div> */}



      {/* forgot password button on the login page  */}
      {/* work on the review section (its still using dummy data) */}
      {/* implement the "filter by" button on the home page (currently not doing anything)  */}




      {/* when deploying this project : remove scripts folder (serviceAccountKey.json file has sensitive info) */}
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/asp' element={<AreaSelectionPage />} />
        <Route path='/landing' element={<LandingPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/about' element={<AboutUsPage />} />
        <Route path='/booking-history' element={<BookingHistoryPage />} />
        <Route path='/booking-detail' element={<BookingDetailPage />} />
        <Route path='/cancellation' element={<CancellationPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/product-detail/:vid' element={<ProductDetailPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/payment-success' element={<PaymentSuccessfulPage />} />
      </Routes>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  )
}

export default App;



{/* <div style={{ height: "100px" }}></div> */ }

// Get vehicle images from: https://www.bikewale.com/











// some info for DFD design            (expendable!!)

// ----------------------------------------------(13pages)
// import LoginPage from './pages/login page/loginPage.jsx';
// import SignupPage from './pages/signup page/signup.jsx';
// import LandingPage from './pages/landing page/landingPage.jsx';
// import HomePage from './pages/home page/homePage.jsx';
// import ProductDetailPage from './pages/product detail page/productDetailPage.jsx';
// import AreaSelectionPage from './pages/area selection page/areaSelectionPage.jsx';
// import CheckoutPage from './pages/checkout page/checkoutPage.jsx';
// import PaymentPage from './pages/payment page/payementPage.jsx';
// import PaymentSuccessfulPage from './pages/payment successful page/paymentSuccessfulPage.jsx';
// ----------------------------------------------
// import AboutUsPage from './pages/about us page/aboutUsPage.jsx';
// import ProfilePage from './pages/profile page/profilePage.jsx';
// import BookingHistoryPage from './pages/booking history page/bookingHistory.jsx';
// import BookingDetailPage from './pages/booking detail page/bookingDetailPage.jsx';
// import CancellationPage from './pages/cancellation page/cancellationPage.jsx';