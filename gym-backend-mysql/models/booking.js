import { db } from "../database/mysql.js";

// CREATE
export async function createBooking(booking) {
  // New booking should not have an existing ID, delete just to be sure.
  delete booking.booking_id;
  // Insert the booking and return the resulting promise
  return db
    .query(
      "INSERT INTO bookings (booking_user_id, booking_session_id, booking_created_datetime) VALUES (?, ?, NOW())",
      [booking.booking_user_id, booking.booking_session_id]
    )
    .then(([result]) => {
      // Inject the inserted ID into the session object and return
      return { ...booking, booking_id: result.insertId };
    });
}

// READ
export async function getAllBookings() {
  // Get the collection of all bookings
  const [allBookingsResults] = await db.query("SELECT * FROM bookings");
  // If there are no bookings in the database, return an error
  if (allBookingsResults.length === 0) {
    return Promise.reject("No bookings available");
  }
  // Convert the collection of results into a list of booking objects
  return await allBookingsResults.map((bookingResult) => {
    return { ...bookingResult };
  });
}

// READ BY ID
export async function getBookingByID(bookingID) {
  // Find the first booking document with a matching ID
  const [bookingsResults] = await db.query(
    "SELECT * FROM bookings WHERE booking_id = ?",
    bookingID
  );
  // If there is more than one booking in the database, return the first one matching the ID
  if (bookingsResults.length > 0) {
    const bookingResult = bookingsResults[0];
    // Return the resulting document
    return Promise.resolve(bookingResult);
  } else {
    return Promise.reject("No booking found");
  }
}

export async function getBookingsByUserID(userID) {
  // Get the collection of all bookings matching the given userID
  const [bookingsResults] = await db.query(
    "SELECT * FROM bookings JOIN sessions ON bookings.booking_session_id = sessions.session_id WHERE bookings.booking_user_id = ? AND sessions.session_datetime > NOW() ORDER BY sessions.session_datetime ASC",
    userID
  );
  // Return the resulting document(s)
  return await bookingsResults.map((bookingResult) => {
    return { ...bookingResult };
  });
}

// UPDATE
export async function updateBooking(booking) {
  // Updates the booking columns but doesn't allow editing of the
  // booking_created_datetime column, as that is only for when a booking is CREATED.
  //
  // This update is for if a user books the wrong session and wants to change to another.
  const [result] = await db.query(
    "UPDATE bookings SET booking_user_id = ?, booking_session_id = ? WHERE booking_id = ?",
    [booking.booking_user_id, booking.booking_session_id, booking.booking_id]
  );
  // If a booking is updated, show the result
  if (result.affectedRows > 0) {
    return result;
  } else {
    return Promise.reject("Booking not found");
  }
}

// DELETE
export async function deleteBookingByID(bookingID) {
  const [result] = await db.query("DELETE FROM bookings WHERE booking_id = ?", bookingID);
  if (result.affectedRows === 0) {
    return Promise.reject("Activity not found");
  }
  return result;
}
