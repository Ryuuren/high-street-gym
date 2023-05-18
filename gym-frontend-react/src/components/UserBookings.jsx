import { useEffect, useState } from "react";
import { getUserBookings, deleteBookingByID } from "../api/booking";
import { getSessionByID } from "../api/session";
import { getActivityByID } from "../api/activity";
import { getUserByID } from "../api/user";
import Spinner from "./Spinner";

export default function UserBookings({ userID, refreshDependency }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingID, setSelectedBookingID] = useState(null);

  useEffect(() => {
    getUserBookings(userID).then(async (bookings) => {
      // fetch members and sessions for each booking
      const bookingsWithExtras = await Promise.all(
        bookings.map(async (booking) => {
          const session = await getSessionByID(booking.booking_session_id);
          const activity = await getActivityByID(session.session_activity_id);
          const trainer = await getUserByID(session.session_trainer_user_id);

          return Promise.resolve({
            booking_id: booking.booking_id,
            session,
            activity,
            session_date: new Date(session.session_datetime).toLocaleDateString(),
            session_time: new Date(session.session_datetime)
              .toLocaleTimeString([], {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                hourCycle: "h11",
              })
              .toUpperCase(),
            trainer,
          });
        })
      );

      setBookings(bookingsWithExtras);
      setLoading(false);
    });
  }, [refreshDependency]);

  useEffect(() => {
    if (selectedBookingID !== null) {
      deleteBookingByID(selectedBookingID).then(() => {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.booking_id !== selectedBookingID)
        );
      });
      setSelectedBookingID(null);
    }
  }, [selectedBookingID]);

  const handleDeleteBooking = (bookingID) => {
    setSelectedBookingID(bookingID);
  };

  return loading ? (
    <Spinner />
  ) : (
    <>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">
            ✕
          </label>
          <h3 className="text-lg font-bold">Congratulations random Internet user!</h3>
          <p className="py-4">
            You've been selected for a chance to get one year of subscription to use Wikipedia for
            free!
          </p>
          <button
            className="btn btn-outline btn-info btn-xs"
            onClick={() => handleDeleteBooking(selectedBookingID)}
          >
            Yes
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold uppercase text-cyan-500 ml-32 sm:ml-64">My Bookings</h2>
      <table className="table table-compact w-full mt-16 mb-14">
        <thead>
          <tr className="text-cyan-500">
            <th className="w-1/5">Activity</th>
            <th className="w-1/5">Date</th>
            <th className="w-1/5">Time</th>
            <th className="w-1/5">Trainer</th>
            <th className="w-1/5">Cancel</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.booking_id}>
              <td>{booking.activity.activity_name}</td>
              <td>{new Date(booking.session.session_datetime).toLocaleDateString()}</td>
              <td>
                {new Date(booking.session.session_datetime)
                  .toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                    hourCycle: "h11",
                  })
                  .toUpperCase()}
              </td>

              <td>
                {booking.trainer.user_firstname} {booking.trainer.user_lastname}
              </td>
              <td>
                <input
                  type="checkbox"
                  id={`my-modal-${booking.booking_id}`}
                  className="modal-toggle"
                />
                <div className="modal">
                  <div className="modal-box relative max-w-sm bg-base-200">
                    <label
                      htmlFor={`my-modal-${booking.booking_id}`}
                      className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                      ✕
                    </label>
                    <h3 className="text-lg font-bold uppercase text-cyan-500">Cancel Booking</h3>
                    <p className="py-4">Are you sure you want to cancel this booking?</p>
                    <button
                      className="btn btn-outline btn-info btn-md"
                      onClick={() => handleDeleteBooking(booking.booking_id)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
                <label
                  className="btn btn-outline btn-info btn-xs"
                  htmlFor={`my-modal-${booking.booking_id}`}
                >
                  Cancel
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
