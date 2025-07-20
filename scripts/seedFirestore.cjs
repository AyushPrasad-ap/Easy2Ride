// Run ONLY ONCE with `node scripts/seedFirestore.js`
// If this file is re-ran, the existing data in Firestore will be overwritten with the data in the DATA SECTION below.



// --------------------------------------------------
// Use the Admin SDK to seed your Firestore collections.
// This bypasses your client‐side security rules.
// --------------------------------------------------

// 1) Use require for CommonJS
const admin    = require("firebase-admin");
const fs       = require("fs");
const path     = require("path");

// 2) Derive __dirname automatically in CJS
// (No need for import.meta workarounds here.)

// 3) Load your service account key JSON file
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf8")
);

// 4) Initialize the Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


// ─────────────────────────────────────────────────────────────────────────────
// DATA SECTION

const vehicle_data = [
    {
        vid: "kw001",
        city: "Jaipur",
        university: "Manipal University Jaipur",
        rate: 50,
        baseAmt: 400,
        image: "/images/2wheeler images/Yamaha MT 15 V2.webp",
        name: "Yamaha MT 15",
        rating: 4.7,
        reviews: 221,
        owner: "Kumawat",
        ownerShopID: "RJ-JP-MUJ-KW",
        keywords: ['bike', 'motorbike', 'Kumawat']
    },
    {
        vid: "ft001",
        city: "Jaipur",
        university: "Manipal University Jaipur",
        rate: 60,
        baseAmt: 420,
        image: "/images/2wheeler images/Yamaha MT 15 V2.webp",
        name: "Yamaha MT 15",
        rating: 4.7,
        reviews: 1,
        owner: "Food Trolly",
        ownerShopID: "RJ-JP-MUJ-FT",
        keywords: ['bike', 'motorbike', 'Food Trolly']
    },
    {
        vid: "kw002",
        city: "Jaipur",
        university: "Manipal University Jaipur",
        rate: 100,
        baseAmt: 600,
        image: "/images/2wheeler images/Royal Enfield hunter 350.webp",
        name: "RE Hunter 350",
        rating: 4.7,
        reviews: 221,
        owner: "Kumawat",
        ownerShopID: "RJ-JP-MUJ-KW",
        keywords: ['bike', 'motorbike', 'royal enfield', 'Kumawat']
    },
    {
        vid: "kw003",
        city: "Jaipur",
        university: "Manipal University Jaipur",
        rate: 20,
        baseAmt: 100,
        image: "/images/2wheeler images/honda activa 6g.webp",
        name: "Honda Activa 6G",
        rating: 4.8,
        reviews: 121,
        owner: "Kumawat",
        ownerShopID: "RJ-JP-MUJ-KW",
        keywords: ['scooty', 'scooter', 'Kumawat']
    },
    {
        vid: "bp001",
        city: "Jaipur",
        university: "Manipal University Jaipur",
        rate: 20,
        baseAmt: 100,
        image: "/images/2wheeler images/honda activa 6g.webp",
        name: "Honda Activa 6G",
        rating: 4.8,
        reviews: 121,
        owner: "Black Pearl",
        ownerShopID: "RJ-JP-MUJ-BP",
        keywords: ['scooty', 'scooter', 'Black Pearl']
    },
    {
        vid: "rb001",
        city: "Jaipur",
        university: "Manipal University Jaipur",
        rate: 20,
        baseAmt: 100,
        image: "/images/2wheeler images/honda activa 6g.webp",
        name: "Honda Activa 6G",
        rating: 4.8,
        reviews: 121,
        owner: "Right Bite",
        ownerShopID: "RJ-JP-MUJ-RB",
        keywords: ['scooty', 'scooter', 'Right Bite']
    },
    {
        vid: "rb002",
        city: "Jaipur",
        university: "Manipal University Jaipur",
        rate: 20,
        baseAmt: 100,
        image: "/images/2wheeler images/tvs jupiter.webp",
        name: "TVS Jupiter",
        rating: 4.3,
        reviews: 79,
        owner: "Right Bite",
        ownerShopID: "RJ-JP-MUJ-RB",
        keywords: ['scooty', 'scooter', 'right bite']
    },
    {
        vid: "rb003",
        city: "Jaipur",
        university: "Manipal University Jaipur",
        rate: 10,
        baseAmt: 150,
        image: "/images/2wheeler images/ola s1 x gen 2.webp",
        name: "Ola S1 X Gen 2",
        rating: 4.3,
        reviews: 79,
        owner: "Right Bite",
        ownerShopID: "RJ-JP-MUJ-RB",
        keywords: ['scooty', 'scooter', 'right bite']
    },
    {
        vid: "rb004",
        city: "Jaipur",
        university: "Manipal University Jaipur",
        rate: 20,
        baseAmt: 100,
        image: "/images/2wheeler images/tvs ntorq.webp",
        name: "TVS Ntorq",
        rating: 3.3,
        reviews: 279,
        owner: "Right Bite",
        ownerShopID: "RJ-JP-MUJ-RB",
        keywords: ['scooty', 'scooter', 'right bite']
    },
    {
        vid: "bp002",
        city: "Jaipur",
        university: "Manipal University Jaipur",
        rate: 20,
        baseAmt: 100,
        image: "/images/2wheeler images/suzuki access.webp",
        name: "Suzuki Access",
        rating: 4.9,
        reviews: 579,
        owner: "Black Pearl",
        ownerShopID: "RJ-JP-MUJ-BP",
        keywords: ['scooty', 'scooter', 'black pearl']
    },
];


const shopDetails = [
    {   
        shopID: "RJ-JP-MUJ-KW",
        name: "Kumawat",
        location: "https://maps.app.goo.gl/mqpcEFVTiCBCuaHy5",
        phoneContact: "",
        emailContact: ""
    },
    {
        shopID: "RJ-JP-MUJ-RB",
        name: "Right Bite",
        location: "https://maps.app.goo.gl/hq5atin5wTH6mRQz5",
        phoneContact: "",
        emailContact: ""
    },
    {
        shopID: "RJ-JP-MUJ-FT",
        name: "Food Trolly",
        location: "https://maps.app.goo.gl/dsREz5cCoRTGjG3q8",
        phoneContact: "",
        emailContact: ""
    },
    {
        shopID: "RJ-JP-MUJ-BP",
        name: "Black Pearl",
        location: "https://maps.app.goo.gl/qpNWQNHVeqGEavxY8",
        phoneContact: "",
        emailContact: ""
    },
    {  
        shopID: "RJ-JP-MUJ-MPG",
        name: "Mama PG",
        location: "https://maps.app.goo.gl/hpAt6eJmvz5eZrcW9",
        phoneContact: "",
        emailContact: ""
    },
];

// ─────────────────────────────────────────────────────────────────────────────


// writing them to Firestore
async function seedFirestore() {
    console.log("Starting Firestore seeding...");

    // Vehicles
  for (const v of vehicle_data) {
    // /vehicles/{city}/{university}/{vid}
    await db
      .collection("vehicles")
      .doc(v.city)
      .collection(v.university)
      .doc(v.vid)
      .set(
        {
          name: v.name,
          rate: v.rate,
          baseAmt: v.baseAmt,
          image: v.image,
          rating: v.rating,
          reviews: v.reviews,
          owner: v.owner,
          ownerShopID: v.ownerShopID,
          keywords: v.keywords,
        },
        { merge: false }
      );
    console.log(`✅ Vehicle ${v.vid}`);
  }

  // Shops
  for (const s of shopDetails) {
    await db
      .collection("shops")
      .doc(s.shopID)
      .set(s, { merge: false });
    console.log(`✅ Shop ${s.shopID}`);
  }

    console.log("✅ All data has been seeded!");
    process.exit(0);
}

seedFirestore().catch(err => {
  console.error("❌ Error seeding Firestore:", err);
  process.exit(1);
});
