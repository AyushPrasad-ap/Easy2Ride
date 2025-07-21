
const express = require('express');
const serverless = require('serverless-http');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  try {
    // Always use environment variables in production
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    } else {
      console.error('Missing Firebase environment variables');
      throw new Error('Firebase credentials not configured properly');
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}


// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET'
});

const app = express();
const router = express.Router();

// Middleware
app.use('/api/create-order', express.raw({ type: 'application/json' }));
app.use('/api/verify-payment', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'API is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    razorpayConfigured: {
      hasKeyId: !!process.env.RAZORPAY_KEY_ID,
      hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET
    }
  });
});




// ===== YOUR ORIGINAL PAYMENT ROUTES FROM server.cjs =====

// Create Order API
router.post('/create-order', async (req, res) => {
  let requestBody;
  try {
    // Handle Buffer
    if (Buffer.isBuffer(req.body)) {
      requestBody = JSON.parse(req.body.toString('utf8'));
    } else if (typeof req.body === 'string') {
      requestBody = JSON.parse(req.body);
    } else {
      requestBody = req.body; // Already parsed (local/dev)
    }

    console.log('Parsed request body:', requestBody);

    let { amount, currency = 'INR', receipt } = requestBody;
    amount = Number(amount);

    if (!amount || isNaN(amount) || amount < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Valid numeric amount (≥ 1) is required' });
    }

    const options = {
      amount: amount * 100,
      currency,
      receipt,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});


// Verify Payment API
router.post('/verify-payment', async (req, res) => {
  let payload;
  try {
    // parse raw Buffer or string into object
    if (Buffer.isBuffer(req.body)) {
      payload = JSON.parse(req.body.toString('utf8'));
    } else if (typeof req.body === 'string') {
      payload = JSON.parse(req.body);
    } else {
      payload = req.body;
    }
  } catch (err) {
    console.error('Error parsing verify-payment body:', err);
    return res.status(400).json({ success: false, message: 'Invalid JSON' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;
  console.log('verify-payment payload:', payload);

  const signed = razorpay_order_id + '|' + razorpay_payment_id;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(signed)
    .digest('hex');

  if (expected === razorpay_signature) {
    return res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    console.warn('Signature mismatch:', { expected, got: razorpay_signature });
    return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});








// ===== ADDITIONAL FIREBASE/FIRESTORE ROUTES FOR YOUR APP =====

// // Bookings endpoints
// router.get('/bookings', async (req, res) => {
//   try {
//     const db = admin.firestore();
//     const bookingsRef = db.collection('bookings');
//     const snapshot = await bookingsRef.get();
    
//     const bookings = [];
//     snapshot.forEach(doc => {
//       bookings.push({ id: doc.id, ...doc.data() });
//     });
    
//     res.json({ success: true, bookings });
//   } catch (error) {
//     console.error('Error fetching bookings:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.post('/bookings', async (req, res) => {
//   try {
//     const db = admin.firestore();
//     const bookingData = {
//       ...req.body,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       updatedAt: admin.firestore.FieldValue.serverTimestamp()
//     };
    
//     const result = await db.collection('bookings').add(bookingData);
//     res.json({ success: true, id: result.id });
//   } catch (error) {
//     console.error('Error creating booking:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get specific booking
// router.get('/bookings/:id', async (req, res) => {
//   try {
//     const db = admin.firestore();
//     const docRef = db.collection('bookings').doc(req.params.id);
//     const doc = await docRef.get();
    
//     if (!doc.exists) {
//       return res.status(404).json({ success: false, error: 'Booking not found' });
//     }
    
//     res.json({ success: true, booking: { id: doc.id, ...doc.data() } });
//   } catch (error) {
//     console.error('Error fetching booking:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Update booking
// router.put('/bookings/:id', async (req, res) => {
//   try {
//     const db = admin.firestore();
//     const docRef = db.collection('bookings').doc(req.params.id);
    
//     const updateData = {
//       ...req.body,
//       updatedAt: admin.firestore.FieldValue.serverTimestamp()
//     };
    
//     await docRef.update(updateData);
//     res.json({ success: true, message: 'Booking updated successfully' });
//   } catch (error) {
//     console.error('Error updating booking:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Vehicles endpoints
// router.get('/vehicles', async (req, res) => {
//   try {
//     const db = admin.firestore();
//     const vehiclesRef = db.collection('vehicles');
//     const snapshot = await vehiclesRef.get();
    
//     const vehicles = [];
//     snapshot.forEach(doc => {
//       vehicles.push({ id: doc.id, ...doc.data() });
//     });
    
//     res.json({ success: true, vehicles });
//   } catch (error) {
//     console.error('Error fetching vehicles:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.post('/vehicles', async (req, res) => {
//   try {
//     const db = admin.firestore();
//     const vehicleData = {
//       ...req.body,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       updatedAt: admin.firestore.FieldValue.serverTimestamp()
//     };
    
//     const result = await db.collection('vehicles').add(vehicleData);
//     res.json({ success: true, id: result.id });
//   } catch (error) {
//     console.error('Error creating vehicle:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Users endpoints (for profile management)
// router.get('/users/:uid', async (req, res) => {
//   try {
//     const db = admin.firestore();
//     const docRef = db.collection('users').doc(req.params.uid);
//     const doc = await docRef.get();
    
//     if (!doc.exists) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ success: true, user: { id: doc.id, ...doc.data() } });
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.post('/users', async (req, res) => {
//   try {
//     const db = admin.firestore();
//     const { uid, ...userData } = req.body;
    
//     const userDoc = {
//       ...userData,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       updatedAt: admin.firestore.FieldValue.serverTimestamp()
//     };
    
//     await db.collection('users').doc(uid).set(userDoc, { merge: true });
//     res.json({ success: true, message: 'User profile updated successfully' });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });



// Use the router
app.use('/api', router);

// Export the handler
module.exports.handler = serverless(app);
