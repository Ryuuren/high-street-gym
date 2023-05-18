import { useEffect, useState } from "react";
import {
  createSession,
  deleteSessionByID,
  getAllSessions,
  getSessionByID,
  updateSession,
} from "../api/session";
import { getAllRooms, getRoomByID } from "../api/room";
import { getActivityByID, getAllActivities } from "../api/activity";
import { getAllUsers, getUserByID } from "../api/user";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import { useAuthentication } from "../hooks/authentication";

export default function SessionCRUD() {
  const [user] = useAuthentication();
  // Creates an empty space to store the sessions list and selected sessions
  const [sessions, setSessions] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSessionID, setSelectedSessionID] = useState(null);
  const [selectedSession, setSelectedSession] = useState({
    session_id: "",
    session_datetime: "",
    session_room_id: "",
    session_activity_id: "",
    session_trainer_user_id: "",
  });

  useEffect(() => {
    getAllSessions(user.user_authenticationkey).then(async (sessions) => {
      // fetch rooms, activities and trainers for each session
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
  }, [selectedSessionID, user]);

  useEffect(() => {
    getAllRooms(user.user_authenticationkey).then((rooms) => {
      setRooms(rooms);
    });
  }, []);

  useEffect(() => {
    getAllActivities(user.user_authenticationkey).then((activities) => {
      setActivities(activities);
    });
  }, []);

  useEffect(() => {
    getAllUsers(user.user_authenticationkey).then((users) => {
      setUsers(users);
    });
  }, []);

  useEffect(() => {
    if (selectedSessionID) {
      getSessionByID(selectedSessionID, user.user_authenticationkey).then(async (session) => {
        const room = await getRoomByID(session.session_room_id);
        const activity = await getActivityByID(session.session_activity_id);
        const user = await getUserByID(session.session_trainer_user_id);

        setSelectedSession({
          session_id: session.session_id,
          session_datetime: session.session_datetime,
          session_room_id: room.room_id,
          session_activity_id: activity.activity_id,
          session_trainer_user_id: user.user_id,
        });
      });
    } else {
      setSelectedSession({
        session_id: "",
        session_datetime: "",
        session_room_id: "",
        session_activity_id: "",
        session_trainer_user_id: "",
      });
    }
  }, [selectedSessionID, user.user_authenticationkey]);

  function createOrUpdateSelectedSession() {
    if (selectedSessionID) {
      // Update
      updateSession(selectedSession).then((updatedSession) => {
        setSelectedSessionID(null);
        setSelectedSession({
          session_id: "",
          session_datetime: "",
          session_room_id: "",
          session_activity_id: "",
          session_trainer_user_id: "",
        });
      });
    } else {
      createSession(selectedSession).then((createdSession) => {
        setSelectedSessionID(createSession.session_id);
      });
    }
  }

  function deleteSelectedSession() {
    deleteSessionByID(selectedSession.session_id).then((result) => {
      setSelectedSessionID(null);
      setSelectedSession({
        session_id: "",
        session_datetime: "",
        session_room_id: "",
        session_activity_id: "",
        session_trainer_user_id: "",
      });
    });
  }
  return (
    <>
      <Nav />
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2">
        {/* Sessions List */}
        <div className="overflow-x-auto pt-0 pl-0 sm:pt-11 sm:pl-4">
          {sessions.length == null ? (
            <Spinner />
          ) : (
            <table className="table table-compact w-full">
              <thead>
                <tr className="text-cyan-500">
                  <th className="w-1/8">ID</th>
                  <th className="w-1/6">Date</th>
                  <th className="w-1/6">Time</th>
                  <th className="w-1/6">Room</th>
                  <th className="w-1/6">No.</th>
                  <th className="w-1/6">Activity</th>
                  <th className="w-1/6">Trainer</th>
                  <th className="w-1/6">Select</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.session_id}>
                    <td>{session.session_id}</td>
                    <td>{session.session_date}</td>
                    <td>{session.session_time}</td>
                    <td>{session.room.room_location}</td>
                    <td>{session.room.room_number}</td>
                    <td>{session.activity.activity_name}</td>
                    <td>{session.user.user_firstname}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-info btn-xs"
                        onClick={() => setSelectedSessionID(session.session_id)}
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
        <div className="pl-10 grid grid-cols-1 md:grid-cols-2 text-lg">
          <div className="form-control">
            <label className="label" htmlFor="session_id">
              ID
            </label>
            <input
              type="text"
              readOnly
              className="input input-bordered input-info w-full max-w-xs"
              id="session_id"
              value={selectedSessionID || ""}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="session_date">
              Date
            </label>
            <input
              type="date"
              className="input input-bordered input-info w-full max-w-xs"
              id="session_date"
              aria-label="Session Date"
              value={selectedSession.session_datetime.split("T")[0]}
              onChange={(e) =>
                setSelectedSession({
                  ...selectedSession,
                  session_datetime:
                    e.target.value + "T" + selectedSession.session_datetime.split("T")[1],
                })
              }
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="session_time">
              Time
            </label>
            <input
              type="time"
              className="input input-bordered input-info w-full max-w-xs"
              id="session_time"
              value={selectedSession.session_datetime.split("T")[1] || ""}
              onChange={(e) =>
                setSelectedSession({
                  ...selectedSession,
                  session_datetime:
                    selectedSession.session_datetime.split("T")[0] + "T" + e.target.value,
                })
              }
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="room_id">
              Room
            </label>
            <select
              className="select select-bordered select-info w-full max-w-xs"
              id="room_id"
              value={selectedSession.session_room_id || ""}
              onChange={(e) =>
                setSelectedSession({
                  ...selectedSession,
                  session_room_id: parseInt(e.target.value),
                })
              }
            >
              {/* Renders an empty option for the default or empty value */}
              <option value="">Select a room</option>

              {rooms.map((room) => (
                <option key={room.room_id} value={room.room_id}>
                  {room.room_location}, Room {room.room_number}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label" htmlFor="activity_id">
              Activity
            </label>
            <select
              className="select select-bordered select-info w-full max-w-xs mb-4"
              id="activity_id"
              value={selectedSession.session_activity_id || ""}
              onChange={(e) =>
                setSelectedSession({
                  ...selectedSession,
                  session_activity_id: parseInt(e.target.value),
                })
              }
            >
              {/* Renders an empty option for the default or empty value */}
              <option value="">Select an activity</option>

              {activities.map((activity) => (
                <option key={activity.activity_id} value={activity.activity_id}>
                  {activity.activity_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label" htmlFor="user_id">
              Trainer
            </label>
            <select
              className="select select-bordered select-info w-full max-w-xs mb-4"
              id="user_id"
              value={selectedSession.session_trainer_user_id || ""}
              onChange={(e) =>
                setSelectedSession({
                  ...selectedSession,
                  session_trainer_user_id: parseInt(e.target.value),
                })
              }
            >
              {/* Renders an empty option for the default or empty value */}
              <option value="">Select a trainer</option>

              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.user_firstname}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-2 flex gap-2">
            <button
              className="btn btn-outline btn-info"
              onClick={() => {
                setSelectedSessionID(null);
                setSelectedSession({
                  session_datetime: "",
                  session_room_id: "",
                  session_activity_id: "",
                  session_trainer_user_id: "",
                });
              }}
            >
              Clear
            </button>
            <button
              className="btn btn-outline btn-info"
              onClick={() => createOrUpdateSelectedSession()}
            >
              Save
            </button>
            <button className="btn btn-outline btn-info" onClick={() => deleteSelectedSession()}>
              Delete
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
