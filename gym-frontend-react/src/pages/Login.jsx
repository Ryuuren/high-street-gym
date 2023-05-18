import { useState, useEffect } from "react";
import { useAuthentication } from "../hooks/authentication";
import { useNavigate } from "react-router-dom";
import { getTopSessions } from "../api/session";
import { getRoomByID } from "../api/room";
import { getActivityByID } from "../api/activity";
import { getUserByID } from "../api/user";
import Spinner from "../components/Spinner";

export default function Login() {
  const navigate = useNavigate();

  const [user, login, logout] = useAuthentication();

  const [statusMessage, setStatusMessage] = useState("");

  const [formData, setFormData] = useState({
    user_email: "",
    user_password: "",
  });

  function onLoginSubmit(e) {
    e.preventDefault();

    setStatusMessage("Logging you in...");
    // Basic regex validation for checking the email address format
    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/.test(formData.user_email)) {
      setStatusMessage("Invalid email address");
      return;
    }

    // Attempt to login
    login(formData.user_email, formData.user_password)
      .then((result) => {
        setStatusMessage("Login Successful");
        // Redirects the user to a new page
        navigate("/dashboard");
      })
      .catch((error) => {
        setStatusMessage("Login failed " + error);
      });
  }

  // Load sessions list
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getTopSessions(5).then(async (sessions) => {
      // fetch rooms and activities for each session
      const sessionsWithExtras = await Promise.all(
        sessions.map(async (session) => {
          const room = await getRoomByID(session.session_room_id);
          const activity = await getActivityByID(session.session_activity_id);
          const user = await getUserByID(session.session_trainer_user_id);

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
            user,
          });
        })
      );

      setSessions(sessionsWithExtras);
    });
  }, []);

  return (
    <>
      {/* Container Div */}
      <div className="flex justify-evenly items-center w-full ">
        {/* Example Data Table Half Of Page */}
        <div className="flex-grow-[3] max-w-3xl hidden md:block">
          {sessions.length == 0 ? (
            <Spinner />
          ) : (
            <table className="table w-full">
              <thead>
                <tr className="text-cyan-500">
                  <th className="w-1/6">Session</th>
                  <th className="w-1/6">Duration</th>
                  <th className="w-1/6">Trainer</th>
                  <th className="w-1/6">Location</th>
                  <th className="w-1/6">Room</th>
                  <th className="w-1/6">Date</th>
                  <th className="w-1/6">Time</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.session_id}>
                    <td>{session.activity.activity_name}</td>
                    <td>{session.activity.activity_duration}</td>
                    <td>{session.user.user_firstname}</td>
                    <td>{session.room.room_location}</td>
                    <td>{session.room.room_number}</td>
                    <td>{session.session_date}</td>
                    <td>{session.session_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Login Half of Page */}
        <div className="divider divider-horizontal h-screen mx-0 invisible"></div>
        <form className="flex-grow m-4 max-w-sm" onSubmit={onLoginSubmit}>
          <h2 className="text-2xl text-center lg:text-left uppercase font-bold mb-4 text-cyan-500">
            High Street Gym
          </h2>
          {/* Email */}
          <div className="form-control">
            <label className="label" htmlFor="user_email">
              Email:
            </label>
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              className="input input-bordered input-info w-full max-w-xs"
              id="user_email"
              value={formData.user_email}
              onChange={(e) => {
                setFormData((existing) => {
                  return { ...existing, user_email: e.target.value };
                });
              }}
            />
          </div>
          {/* Password */}
          <div className="form-control">
            <label className="label" htmlFor="user_password">
              Password:
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered input-info w-full max-w-xs mb-4"
              id="user_password"
              value={formData.user_password}
              onChange={(e) => {
                setFormData((existing) => {
                  return { ...existing, user_password: e.target.value };
                });
              }}
            />
          </div>
          {/* Login / Register */}
          <div>
            <button className="btn btn-outline btn-info mr-3">Login</button>
            <button className="btn btn-outline btn-info" onClick={() => navigate("/register")}>
              Register
            </button>
            <label className="label">
              <span className="label-text-alt">{statusMessage}</span>
            </label>
          </div>
        </form>
      </div>
    </>
  );
}
