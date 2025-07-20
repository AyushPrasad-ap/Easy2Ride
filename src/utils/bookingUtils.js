import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

/**
 * Returns true if the given vehicleId is available between the two Firestore Timestamps.
 *
 * @param {string} vid           – vehicle ID
 * @param {import("firebase/firestore").Timestamp} fromTs
 * @param {import("firebase/firestore").Timestamp} toTs
 * @returns {Promise<boolean>}
 */
export async function isVehicleAvailable(vid, fromTs, toTs) {
  const db = getFirestore();

  // convert both to millisecond epoch for easy overlap math
  const newStart = fromTs.toDate().getTime();
  const newEnd   = toTs.toDate().getTime();

  // query ALL_BOOKINGS for any confirmed booking of this vid that begins on or before our requested end
  const q = query(
    collection(db, "ALL_BOOKINGS"),
    where("vid", "==", vid),
    where("status", "==", "confirmed"),
    where("fromDate", "<=", toTs)
  );
  const snap = await getDocs(q);

  for (let doc of snap.docs) {
    const { fromDate, toDate } = doc.data();
    // convert existing booking window to ms
    const exStart = fromDate.toDate().getTime();
    const exEnd   = toDate  .toDate().getTime();

    // overlap if exStart ≤ newEnd AND exEnd ≥ newStart
    if (exStart <= newEnd && exEnd >= newStart) {
      // conflict found
      return false;
    }
  }

  // no conflicts
  return true;
}
