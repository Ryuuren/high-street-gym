import { useEffect, useState } from "react";
import { useAuthentication } from "../hooks/authentication";
import { useNavigate } from "react-router-dom";
import { getAllSessions } from "../api/session";
import { getRoomByID } from "../api/room";
import { getActivityByID } from "../api/activity";
import { getUserByID } from "../api/user";
import { createBooking } from "../api/booking";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";

export default function Sessions() {
  // Gets the currently logged in user, so their ID can be used to create a booking
  const [user] = useAuthentication();

  const navigate = useNavigate();
  // Creates an empty space to store the sessions list and selected sessions
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getAllSessions().then(async (sessions) => {
      // fetch rooms, activities and trainers for each session
      const sessionsWithExtras = await Promise.all(
        sessions.map(async (session) => {
          const room = await getRoomByID(session.session_room_id);
          const activity = await getActivityByID(session.session_activity_id);
          const trainer = await getUserByID(session.session_trainer_user_id);

          return Promise.resolve({
            session_id: session.session_id,
            session_date: new Date(session.session_datetime).toLocaleDateString(),
            session_time: new Date(session.session_datetime)
              .toLocaleTimeString([], {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                hourCycle: "h11",
              })
              .toUpperCase(),
            room,
            activity,
            trainer,
          });
        })
      );

      setSessions(sessionsWithExtras);
    });
  }, []);

  return (
    <>
      <Nav />
      <div className="container sm:p-2 mx-auto">
        {/* Sessions List */}
        <div className="overflow-x-auto w-full pt-9 sm:pl-2 sm:pr-4">
          {sessions.length == null ? (
            <Spinner />
          ) : (
            <table className="table table-compact w-full">
              <thead>
                <tr className="text-cyan-500">
                  <th className="w-1/8">Activity</th>
                  <th className="w-1/8">Duration</th>
                  <th className="w-1/8">Trainer</th>
                  <th className="w-1/8">Location</th>
                  <th className="w-1/8">Room</th>
                  <th className="w-1/8">Date</th>
                  <th className="w-1/8">Time</th>
                  <th className="w-1/8">Book</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.session_id}>
                    <td>{session.activity.activity_name}</td>
                    <td>{session.activity.activity_duration}</td>
                    <td>{session.trainer.user_firstname}</td>
                    <td>{session.room.room_location}</td>
                    <td>{session.room.room_number}</td>
                    <td>{session.session_date}</td>
                    <td>{session.session_time}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-info btn-xs"
                        onClick={() => {
                          // Create a booking for the logged in user and this session
                          createBooking({
                            booking_user_id: user.user_id,
                            booking_session_id: session.session_id,
                          })
                            .then((booking) => {
                              console.log("Booking created successfully: ", booking);
                              navigate("/dashboard");
                              // Handle the successful booking creation here, e.g. show a success message
                            })
                            .catch((error) => {
                              console.error("Failed to create booking: ", error);
                              // Handle the failed booking creation here, e.g. show an error message
                            });
                        }}
                      >
                        Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
