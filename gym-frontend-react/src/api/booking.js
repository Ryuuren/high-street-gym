import { API_URL } from "./api.js";

// CREATE
export async function createBooking(booking) {
  const response = await fetch(API_URL + "/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.booking;
}

// READ
export async function getAllBookings() {
  const response = await fetch(API_URL + "/bookings", {
    method: "GET",
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.bookings;
}

// READ BY ID
export async function getBookingByID(bookingID) {
  const response = await fetch(API_URL + "/bookings/" + bookingID, {
    method: "GET",
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.booking;
}

// READ BY USER ID
export async function getUserBookings(userID) {
  const response = await fetch(API_URL + "/my-bookings/" + userID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.bookings;
}

// UPDATE
export async function updateBooking(booking) {
  const response = await fetch(API_URL + "/bookings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.booking;
}

// DELETE
export async function deleteBookingByID(bookingID) {
  bookingID = JSON.stringify(bookingID);
  const response = await fetch(API_URL + "/bookings", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ booking_id: bookingID }),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}
