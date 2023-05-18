import { useEffect, useState } from "react";
import { deleteBookingByID, getAllBookings, getBookingByID, updateBooking } from "../api/booking";
import { getUserByID } from "../api/user";
import { getSessionByID, getAllSessions } from "../api/session";
import { getActivityByID } from "../api/activity";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import { useAuthentication } from "../hooks/authentication";

export default function BookingCRUD() {
  const [user] = useAuthentication();
  // Creates an empty space to store the bookings list and selected bookings
  const [bookings, setBookings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedBookingID, setSelectedBookingID] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState({
    booking_id: "",
    booking_user_id: "",
    booking_session_id: "",
    booking_created_datetime: "",
  });

  useEffect(() => {
    getAllBookings(user.user_authenticationkey).then(async (bookings) => {
      // fetch members and sessions for each booking
      const bookingsWithExtras = await Promise.all(
        bookings.map(async (booking) => {
          const session = await getSessionByID(booking.booking_session_id);
          const activity = await getActivityByID(session.session_activity_id);
          const user = await getUserByID(booking.booking_user_id);
          const sessionDate = new Date(session.session_datetime);
          const currentDate = new Date();

          // Exclude bookings with session dates that have passed
          if (sessionDate >= currentDate) {
            return {
              booking_id: booking.booking_id,
              activity,
              session,
              session_date: sessionDate.toLocaleDateString(),
              user,
              created_date: new Date(booking.booking_created_datetime).toLocaleDateString(),
              created_time: new Date(booking.booking_created_datetime)
                .toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  hourCycle: "h11",
                })
                .toUpperCase(),
            };
          } else {
            return null; // Exclude the booking from the result
          }
        })
      );

      // Remove null entries from the bookingsWithExtras array
      const filteredBookingsWithExtras = bookingsWithExtras.filter(
        (bookingWithExtra) => bookingWithExtra !== null
      );

      setBookings(filteredBookingsWithExtras);
    });
  }, [selectedBookingID, user]);

  useEffect(() => {
    getAllSessions(user.user_authenticationkey).then((sessions) => {
      const sessionsWithActivities = sessions.map(async (session) => {
        const activity = await getActivityByID(session.session_activity_id);
        return {
          ...session,
          activity,
        };
      });
  
      Promise.all(sessionsWithActivities).then((sessionsWithActivities) => {
        setSessions(sessionsWithActivities);
      });
    });
  }, [user]);

  useEffect(() => {
    if (selectedBookingID) {
      getBookingByID(selectedBookingID, user.user_authenticationkey).then((booking) => {
        setSelectedBooking(booking);
      });
    } else {
      setSelectedBooking({
        booking_id: "",
        booking_user_id: "",
        booking_session_id: "",
        booking_created_datetime: "",
      });
    }
  }, [selectedBookingID, user.user_authenticationkey]);

  function updateSelectedBooking() {
    // This function updates the selected booking if there is
    // an ID in the ID field, otherwise it does nothing
    if (selectedBookingID) {
      // Update
      updateBooking(selectedBooking).then((updatedBooking) => {
        setSelectedBookingID(null);
        setSelectedBooking({
          booking_id: "",
          booking_user_id: "",
          booking_session_id: "",
          booking_created_datetime: "",
        });
      });
    } else {
      setSelectedBookingID(null);
      setSelectedBooking({
        booking_id: "",
        booking_user_id: "",
        booking_session_id: "",
        booking_created_datetime: "",
      });
    }
  }

  function deleteSelectedBooking() {
    deleteBookingByID(selectedBooking.booking_id).then((result) => {
      console.log("delete debug", selectedBooking);
      setSelectedBookingID(null);
      setSelectedBooking({
        booking_id: "",
        booking_user_id: "",
        booking_session_id: "",
        booking_created_datetime: "",
      });
    });
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2">
        {/* Bookings List */}
        <div className="overflow-x-auto pt-0 pl-0 sm:pt-11 sm:pl-4">
          {bookings.length == null ? (
            <Spinner />
          ) : (
            <table className="table table-compact w-full">
              <thead>
                <tr className="text-cyan-500">
                  <th className="w-1/8">ID</th>
                  <th className="w-1/8">Session</th>
                  <th className="w-1/8">Session Date</th>
                  <th className="w-1/8">Member</th>
                  <th className="w-2/8">Date Booked</th>
                  <th className="w-2/8">Time Booked</th>
                  <th className="w-1/8">Select</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.booking_id}>
                    <td>{booking.booking_id}</td>
                    <td>{booking.activity.activity_name}</td>
                    <td>{new Date(booking.session.session_datetime).toLocaleDateString()}</td>
                    <td>
                      {booking.user.user_firstname} {booking.user.user_lastname}
                    </td>
                    <td>{booking.created_date}</td>
                    <td>{booking.created_time}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-info btn-xs"
                        onClick={() => setSelectedBookingID(booking.booking_id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Edit Form */}
        <div className="pl-10 text-lg">
          <div className="form-control">
            <label className="label" htmlFor="booking_id">
              ID
            </label>
            <input
              type="text"
              readOnly
              className="input input-bordered input-info w-full max-w-xs"
              id="booking_id"
              value={selectedBookingID || ""}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="user_id">
              User ID
            </label>
            <input
              type="text"
              readOnly
              className="input input-bordered input-info w-full max-w-xs"
              id="user_id"
              value={selectedBooking.booking_user_id}
              onChange={(e) =>
                setSelectedBooking({ ...selectedBooking, booking_user_id: e.target.value })
              }
            />
          </div>
          <div className="form-control mb-3">
            <label className="label" htmlFor="booking_session_id">
              Session
            </label>
            <select
              className="select select-bordered select-info w-full max-w-xs mb-4"
              id="booking_session_id"
              name="booking_session_id"
              value={selectedBooking.booking_session_id || ""}
              onChange={(e) =>
                setSelectedBooking({
                  ...selectedBooking,
                  booking_session_id: e.target.value !== "" ? e.target.value : null,
                })
              }
            >
              <option value="">Select a session</option>
              {sessions.map((session) => (
                <option key={session.session_id} value={session.session_id}>
                  {session.session_datetime.slice(8, 10)}/{session.session_datetime.slice(5, 7)}/
                  {session.session_datetime.slice(0, 4)} -{" "}
                  {new Date(session.session_datetime)
                    .toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      hourCycle: "h11",
                    })
                    .toUpperCase()}{" "}
                  - {session.activity.activity_name}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-2 flex gap-2">
            <button
              className="btn btn-outline btn-info"
              onClick={() => {
                setSelectedBookingID(null);
                setSelectedBooking({
                  booking_user_id: "",
                  booking_session_id: "",
                  booking_created_datetime: "",
                });
              }}
            >
              Clear
            </button>
            <button className="btn btn-outline btn-info" onClick={() => updateSelectedBooking()}>
              Update
            </button>
            <button className="btn btn-outline btn-info" onClick={() => deleteSelectedBooking()}>
              Delete
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
