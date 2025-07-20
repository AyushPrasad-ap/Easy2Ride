import { useEffect } from "react";

/**
 * Custom hook to auto-update expired bookings across all users.
 * @param {object} firebase - Firebase context instance
 */



export function useGlobalBookingAutoUpdater(firebase) {
    useEffect(() => {
        if (!firebase || firebase.initializing) return;

        const autoUpdateAllUsersBookings = async () => {
            try {
                const nowInSeconds = Math.floor(Date.now() / 1000);

                // Fetch all users in the bookings collection
                const users = await firebase.getAllFirestoreDocs("bookings");

                for (const user of users) {
                    const uid = user.id;
                    const collectionName = `bookings/${uid}/userBookings`;
                    const bookings = await firebase.getAllFirestoreDocs(collectionName);

                    const toUpdate = bookings.filter(
                        b => b.status === "confirmed" && b.toDate?.seconds < nowInSeconds
                    );

                    if (toUpdate.length > 0) {
                        await Promise.all(
                            toUpdate.flatMap(b => [
                                firebase.setFirestoreData(
                                    collectionName,
                                    b.id,
                                    { status: "completed" }
                                ),
                                firebase.setFirestoreData(
                                    "ALL_BOOKINGS",
                                    b.id,
                                    { status: "completed" }
                                )
                            ])
                        );
                        console.log(
                            `✅ Updated ${toUpdate.length} bookings for user ${uid}`
                        );
                    }
                }

            } catch (err) {
                console.error("🔥 Global auto-update failed:", err);
            }
        };

        // Run once on mount
        autoUpdateAllUsersBookings();

        // Run again every 10 minutes
        const interval = setInterval(autoUpdateAllUsersBookings, 10 * 60 * 1000);

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, [firebase]);
}








//old code: this was updating status only in "/bookings/${uid}/userBookings" collection

// import { useEffect } from "react";

// /**
//  * Custom hook to auto-update expired bookings across all users.
//  * @param {object} firebase - Firebase context instance
//  */
// export function useGlobalBookingAutoUpdater(firebase) {
//     useEffect(() => {
//         if (!firebase || firebase.initializing) return;

//         const autoUpdateAllUsersBookings = async () => {
//             try {
//                 const nowInSeconds = Math.floor(Date.now() / 1000);

//                 // Fetch all users in the bookings collection
//                 const users = await firebase.getAllFirestoreDocs("bookings");

//                 for (const user of users) {
//                     const uid = user.id;
//                     const collectionName = `bookings/${uid}/userBookings`;
//                     const bookings = await firebase.getAllFirestoreDocs(collectionName);

//                     const toUpdate = bookings.filter(
//                         b => b.status === "confirmed" && b.toDate?.seconds < nowInSeconds
//                     );

//                     if (toUpdate.length > 0) {
//                         await Promise.all(
//                             toUpdate.map(b =>
//                                 // merge: true by default
//                                 firebase.setFirestoreData(
//                                     collectionName,
//                                     b.id,
//                                     { status: "completed" }
//                                 )
//                             )
//                         );
//                         console.log(
//                             `✅ Updated ${toUpdate.length} bookings for user ${uid}`
//                         );
//                     }
//                 }

//             } catch (err) {
//                 console.error("🔥 Global auto-update failed:", err);
//             }
//         };

//         // Run once on mount
//         autoUpdateAllUsersBookings();

//         // Run again every 10 minutes
//         const interval = setInterval(autoUpdateAllUsersBookings, 10 * 60 * 1000);

//         // Cleanup on unmount
//         return () => clearInterval(interval);
//     }, [firebase]);
// }
