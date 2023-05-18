import { Router } from "express";
import { validate } from "../middleware/validator.js";
import {
  createBooking,
  getAllBookings,
  getBookingByID,
  getBookingsByUserID,
  updateBooking,
  deleteBookingByID,
} from "../models/booking.js";

const bookingController = Router();

// Start - Create Booking Endpoint
const createBookingSchema = {
  type: "object",
  required: ["booking_user_id", "booking_session_id"],
  properties: {
    booking_user_id: {
      type: "string",
    },
    booking_session_id: {
      type: "string",
    },
  },
};

bookingController.post("/bookings", async (req, res) => {
  // Get the booking data out of the request
  const booking = req.body;

  // Use the create booking model function to insert this booking into the DB
  createBooking(booking)
    .then((booking) => {
      res.status(200).json({
        status: 200,
        message: "Created booking",
        booking: booking,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to create booking " + error.message,
      });
    });
});
// End - Create Booking Endpoint
//
// Start - Get All Bookings Endpoint
const getBookingListSchema = {
  type: "object",
  properties: {},
};

bookingController.get("/bookings", validate({ body: getBookingListSchema }), async (req, res) => {
  // Use the get all bookings model function to retrieve all bookings
  getAllBookings()
    .then((bookings) => {
      res.status(200).json({
        status: 200,
        message: "Got all bookings",
        bookings: bookings,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get all bookings",
      });
    });
});
// End - Get All Bookings Endpoint
//
// Start - Get Booking By ID Endpoint
const getBookingByIDSchema = {
  type: "object",
  properties: {
    booking_id: {
      type: "string",
    },
  },
};

bookingController.get(
  "/bookings/:booking_id",
  validate({ params: getBookingByIDSchema }),
  async (req, res) => {
    const bookingID = req.params.booking_id;

    // Use the get by ID model function to retrieve the single booking
    getBookingByID(bookingID)
      .then((booking) => {
        res.status(200).json({
          status: 200,
          message: "Got booking by ID",
          booking: booking,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to get booking by ID - ID invalid or doesn't exist",
        });
      });
  }
);
// End - Get Booking By ID Endpoint
//
// Start - Get Bookings By User ID Endpoint
const getBookingsByUserIDSchema = {
  type: "object",
  properties: {
    user_id: {
      type: "string",
    },
  },
};

bookingController.get(
  "/my-bookings/:user_id",
  validate({ params: getBookingsByUserIDSchema }),
  async (req, res) => {
    const userID = req.params.user_id;

    const bookings = await getBookingsByUserID(userID);

    res.status(200).json({
      status: 200,
      message: "Got all bookings by user ID",
      bookings: bookings,
    });
  }
);
// End - Get Bookings By User ID Endpoint
//
// Start - Update Booking By ID Endpoint
const updateBookingSchema = {
  type: "object",
  required: ["booking_id"],
  properties: {
    booking_id: {
      type: "string",
    },
    booking_user_id: {
      type: "string",
    },
    booking_session_id: {
      type: "string",
    },
  },
};

bookingController.patch("/bookings", async (req, res) => {
  const booking = req.body;

  // Check that the booking has an ID
  if (!booking.booking_id) {
    res.status(404).json({
      status: 404,
      message: "Cannot find booking to update without ID",
    });
    return;
  }

  // Use the update model function to update the existing row/document
  // in the database for this booking
  updateBooking(booking)
    .then((updatedBooking) => {
      res.status(200).json({
        status: 200,
        message: "Booking updated",
        booking: updatedBooking,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to update booking - ID invalid or doesn't exist",
      });
    });
});
// End - Update Booking By ID Endpoint
//
// Start - Delete Booking By ID Endpoint
const deleteBookingSchema = {
  type: "object",
  required: ["booking_id"],
  properties: {
    booking_id: {
      type: "string",
      minLength: 1,
    },
  },
};

bookingController.delete("/bookings", validate({ body: deleteBookingSchema }), (req, res) => {
  const bookingID = req.body.booking_id;

  deleteBookingByID(bookingID)
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "Deleted booking by ID",
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to delete booking by ID - ID invalid or doesn't exist",
      });
    });
});
// End - Delete Booking By ID Endpoint

export default bookingController;
