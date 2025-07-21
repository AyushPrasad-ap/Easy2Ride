import "./paymentPage.css";
import GlowBtn from "../../components/glow btn/glowBtn";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAreaSelected } from '../../context/AreaSelected';
import { useFirebase } from '../../context/firebase';
import { Timestamp } from "firebase/firestore";




// importing images
import backIcon from "/images/interface icons/back icon.png";
import shieldIcon from "/images/icons/shield_icon.png";







// Load Razorpay script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

function PaymentPage() {
    const navigate = useNavigate();
    const AreaSelected = useAreaSelected();
    const firebase = useFirebase();
    const [queryParams] = useSearchParams();
    const location = useLocation();

    // Get data from CheckoutPage
    const { vid, city, university, quantity, fromDate, toDate, driverData, subTotal } = location.state;

    // State management
    const [loading, setLoading] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [vehicleName, setVehicleName] = useState("...");


    // Load Razorpay script on component mount
    useEffect(() => {
        const loadScript = async () => {
            const loaded = await loadRazorpayScript();
            setRazorpayLoaded(loaded);
            if (!loaded) {
                alert('Failed to load Razorpay. Please refresh the page.');
            }
        };
        loadScript();
    }, []);

    // updating the context values of city and university. {when the pages reloads, context values are lost, but the url values are not lost. So, I am updating the context values with the url values.}
    useEffect(() => {
        if (!AreaSelected.cityContext && queryParams.get("city")) {
            AreaSelected.setCityContext(queryParams.get("city"));
        }
        if (!AreaSelected.universityContext && queryParams.get("university")) {
            AreaSelected.setUniversityContext(queryParams.get("university"));
        }
    }, []);

    // fetching vehicle name from the database
    useEffect(() => {
        const fetchVehicleName = async () => {
            if (!vid || !city || !university) return;
            try {
                const path = `vehicles/${city}/${university}`;
                const vehicleDoc = await firebase.getFirestoreData(path, vid);
                setVehicleName(vehicleDoc?.name || "Unknown Vehicle");
            } catch (error) {
                console.error("Failed to fetch vehicle name:", error);
                setVehicleName("Unknown Vehicle");
            }
        };

        fetchVehicleName();
    }, [vid, city, university]);




    // Create Order function
    const createOrder = async (amount) => {
        try {
            const orderPayload = {
                amount: Number(amount),       // make sure it is a number
                currency: 'INR',
                receipt: `receipt_${Date.now()}`
            };

            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
            });

            if (!response.ok) {
                throw new Error('💀Failed to create order');
            }

            return await response.json();
        } catch (error) {
            console.error('💀Error creating order:', error);
            throw error;
        }
    };

    // Verify Payment function
    const verifyPayment = async (paymentData) => {
        try {
            const response = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (!response.ok) {
                throw new Error('Payment verification failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    };

    // Save Payment Data to Firestore[20][23]
    const savePaymentToFirestore = async (paymentData) => {
        try {
            const paymentDocument = {
                paymentId: paymentData.razorpay_payment_id,
                orderId: paymentData.razorpay_order_id,
                amount: subTotal,
                // currency: 'INR',
                status: 'completed',
                userId: firebase.currentUser?.uid,
                createdAt: Timestamp.now(),
                signature: paymentData.razorpay_signature
            };

            // Save to Firestore at /payments/{paymentID}
            await firebase.setFirestoreData(
                'payments',
                paymentData.razorpay_payment_id,
                paymentDocument
            );

            console.log('Payment data saved to Firestore');
            return paymentData.razorpay_payment_id;
        } catch (error) {
            console.error('Error saving payment to Firestore:', error);
            throw error;
        }
    };

    // Handle Payment Success
    const handlePaymentSuccess = async (response) => {
        try {
            setLoading(true);

            // Verify payment signature[16][18]
            const verificationResult = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            });

            if (verificationResult.success) {
                // Save payment data to Firestore
                const paymentID = await savePaymentToFirestore(response);

                navigate('/payment-success', {
                    state: {
                        vid,
                        city,
                        university,
                        fromDate,
                        toDate,
                        quantity,
                        driverData,
                        subTotal,
                        paymentID
                    }
                });
            } else {
                alert('Payment verification failed. Please contact support.');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment processing failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Payment Failure
    const handlePaymentFailure = (error) => {
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
        setLoading(false);
    };

    // Initiate Payment
    const initiatePayment = async () => {
        if (!razorpayLoaded) {
            alert('Razorpay is not loaded. Please refresh the page.');
            return;
        }

        try {
            setLoading(true);

            // Create order on backend[3][12]
            const orderData = await createOrder(Number(subTotal));

            if (!orderData.success) {
                throw new Error('Failed to create order');
            }

            // Razorpay options[2][3]
            const options = {
                key: 'rzp_test_aGWFgOduEMJhYK', // razorpay key id
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Easy2Ride',
                description: 'Vehicle Booking Payment',
                order_id: orderData.order_id,
                handler: handlePaymentSuccess,
                prefill: {
                    name: firebase.currentUser?.displayName || '',
                    email: firebase.currentUser?.email || '',
                    contact: '9999999980' // You can get this from user profile
                },
                theme: {
                    color: '#3399cc'
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', handlePaymentFailure);
            rzp.open();

        } catch (error) {
            console.error('Error initiating payment:', error);
            alert('Failed to initiate payment. Please try again.');
            setLoading(false);
        }
    };



    // a simple function to format date and time (nothing fancy)
    function formatDateTime(dateObj) {
        if (!(dateObj instanceof Date)) {
            throw new Error("Invalid date object");
        }

        const datePart = dateObj.toLocaleDateString("en-GB", {
            day: "numeric",        // no leading zero
            month: "short"         // e.g., Jan, Feb, Mar
        });

        const timePart = dateObj.toLocaleTimeString("en-US", {
            hour: "numeric",       // 1–12 format
            minute: "2-digit",     // always two digits
            hour12: true           // 12-hour format with AM/PM
        });

        return `${datePart}, ${timePart}`;
    }
    function calDuration(from, to) {
        try {
            const fromTime = new Date(from).getTime();
            const toTime = new Date(to).getTime();

            if (isNaN(fromTime) || isNaN(toTime)) return "Invalid time";

            const diffInHours = Math.ceil((toTime - fromTime) / (1000 * 60 * 60));
            return `${diffInHours} hrs`;
        } catch (error) {
            console.error("Error calculating duration:", error);
            return "-";
        }
    }




    return (
        <div className="payment-page-container">
            <div className="payment-page-title placeCenter-row ">
                <img
                    onClick={() => { navigate(-1) }}
                    width={"30px"} src={backIcon} alt="back btn"
                />
                <h1>Payment</h1>
            </div>



            <div className="pp-card-container">
                <h2>Booking Summary</h2>

                <div className="pp-card-container-content">

                    <div className="pp-transaction-detail pp-stretch-class">
                        <p>Vehicle</p>
                        <p style={{ color: "black" }}>{vehicleName}</p>
                    </div>
                    <div className="pp-transaction-detail pp-stretch-class">
                        <p>Date</p>
                        <p style={{ color: "black" }}>{formatDateTime(fromDate)}</p>
                    </div>
                    <div className="pp-transaction-detail pp-stretch-class">
                        <p>Duration</p>
                        <p style={{ color: "black" }}>{calDuration(fromDate, toDate)}</p>
                    </div>
                    <div className="pp-transaction-detail pp-stretch-class">
                        <p>Quantity</p>
                        <p style={{ color: "black" }}>{quantity}</p>
                    </div>
                    <div className="pp-transaction-detail pp-stretch-class pp-no-margin">
                        <p>Amount</p>
                        <p style={{ color: "black" }}>₹{subTotal}</p>
                    </div>

                </div>
            </div>



            <GlowBtn
                text={loading ? "Processing..." : "Pay Now"}
                onClick={initiatePayment}
                disabled={loading || !razorpayLoaded}
                color="var(--bluish)"
                glow="false"
                borderRadius="10px"
                className="pp-glow-btn"
            />


            {/* Payment Safety Policy */}
            <div className="payment-safety-policy placeCenter-row">
                <img width={"30px"} src={shieldIcon} alt="" />
                <p>We entirely adhere to the data security standards of the UPI payments.</p>
            </div>

            {
                !razorpayLoaded && (
                    <p style={{ textAlign: "center", marginTop: "15px" }}>
                        Loading payment gateway...
                    </p>
                )
            }


        </div>
    );
}

export default PaymentPage;
