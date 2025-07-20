// src/hooks/useBookingAutoUpdater.js
import { useEffect } from "react";
import { useFirebase } from "../context/firebase";

/**
 * Auto‑updates expired bookings for the current user only.
 * Also syncs the status change to ALL_BOOKINGS.
 *
 * @param {string} uid
 */
export function useBookingAutoUpdater(uid) {
  const firebase = useFirebase();

  useEffect(() => {
    if (!uid || firebase.initializing) return;

    const path = `bookings/${uid}/userBookings`;

    const autoUpdateStatus = async () => {
      try {
        const nowSec = Math.floor(Date.now() / 1000);
        const bookings = await firebase.getAllFirestoreDocs(path);

        const expired = bookings.filter(
          b => b.status === "confirmed" && b.toDate?.seconds < nowSec
        );

        if (expired.length) {
          await Promise.all(
            expired.flatMap(b => [
              // update in the user’s own bookings
              firebase.setFirestoreData(path, b.id, { status: "completed" }),
              // mirror into ALL_BOOKINGS
              firebase.setFirestoreData("ALL_BOOKINGS", b.id, { status: "completed" })
            ])
          );
          console.log(
            `✅ User ${uid}: auto-completed ${expired.length} bookings`
          );
        }
      } catch (err) {
        console.error("🔥 Auto-update failed:", err);
      }
    };

    // run immediately, then every 10 minutes
    autoUpdateStatus();
    const interval = setInterval(autoUpdateStatus, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [uid, firebase]);
}








// Old code: This was updating status only in "/bookings/${uid}/userBookings" collection


// import { useEffect } from "react";
// import { useFirebase } from "../context/firebase";

// /**
//  * Custom hook to auto-update expired bookings for the current user.
//  * @param {string} uid - Current user's UID
//  */
// export function useBookingAutoUpdater(uid) {
//   const firebase = useFirebase();

//   useEffect(() => {
//     if (!uid || firebase.initializing) return;

//     const collectionName = `bookings/${uid}/userBookings`;

//     const autoUpdateStatus = async () => {
//       try {
//         const nowSec = Math.floor(Date.now() / 1000);
//         const bookings = await firebase.getAllFirestoreDocs(collectionName);

//         const toUpdate = bookings.filter(
//           b => b.status === "confirmed" && b.toDate?.seconds < nowSec
//         );

//         if (toUpdate.length > 0) {
//           await Promise.all(
//             toUpdate.map(b =>
//               // merge: true is default
//               firebase.setFirestoreData(
//                 collectionName,   // path to collection
//                 b.id,             // document ID
//                 { status: "completed" } // data to merge
//               )
//             )
//           );
//           console.log(
//             `✅ Auto-updated ${toUpdate.length} expired bookings for user ${uid}`
//           );
//         }
//       } catch (err) {
//         console.error("🔥 Auto-update failed:", err);
//       }
//     };

//     autoUpdateStatus();
//     const intervalId = setInterval(autoUpdateStatus, 10 * 60 * 1000);
//     return () => clearInterval(intervalId);
//   }, [uid, firebase]);
// }
