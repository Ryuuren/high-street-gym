import { useEffect, useState } from "react";
import { createRoom, deleteRoomByID, getAllRooms, getRoomByID, updateRoom } from "../api/room";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import { XMLUpload } from "../components/XMLUpload";
import Footer from "../components/Footer";
import { useAuthentication } from "../hooks/authentication";

export default function RoomCRUD() {
  const [user] = useAuthentication();
  // Creates an empty space to store the rooms list and selected rooms
  const [rooms, setRooms] = useState([]);
  const [selectedRoomID, setSelectedRoomID] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState({
    room_id: "",
    room_location: "",
    room_number: "",
  });

  useEffect(() => {
    getAllRooms(user.user_authenticationkey).then((rooms) => {
      setRooms(rooms);
    });
  }, [selectedRoomID, user]);

  useEffect(() => {
    if (selectedRoomID) {
      getRoomByID(selectedRoomID, user.user_authenticationkey).then((room) => {
        setSelectedRoom(room);
      });
    } else {
      setSelectedRoom({
        room_id: "",
        room_location: "",
        room_number: "",
      });
    }
  }, [selectedRoomID, user.user_authenticationkey]);

  // Create/Update function for the Save button
  function createOrUpdateSelectedRoom() {
    // This function updates the selected room if there is
    // an ID in the ID field, otherwise if the ID field is blank
    // it will create a new room
    if (selectedRoomID) {
      // Update
      updateRoom(selectedRoom).then((updatedRoom) => {
        setSelectedRoomID(null);
        setSelectedRoom({
          room_id: "",
          room_location: "",
          room_number: "",
        });
      });
    } else {
      // Create
      createRoom(selectedRoom).then((createdRoom) => {
        setSelectedRoomID(createRoom.room_id);
      });
    }
  }

  function deleteSelectedRoom() {
    deleteRoomByID(selectedRoom.room_id).then((result) => {
      setSelectedRoomID(null);
      setSelectedRoom({
        room_id: "",
        room_location: "",
        room_number: "",
      });
    });
  }

  return (
    <>
      <Nav />
      {/* Parent Container */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap 2">
        {/* Rooms List */}
        <div className="overflow-x-auto pt-0 pl-0 sm:pt-11 sm:pl-4">
          {rooms.length == null ? (
            <Spinner />
          ) : (
            <table className="table table-compact w-full">
              <thead>
                <tr className="text-cyan-500">
                  <th className="w-1/4">ID</th>
                  <th className="w-1/4">Location</th>
                  <th className="w-1/4">Number</th>
                  <th className="w-1/4">Select</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.room_id}>
                    <td>{room.room_id}</td>
                    <td>{room.room_location}</td>
                    <td>{room.room_number}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-info btn-xs"
                        onClick={() => setSelectedRoomID(room.room_id)}
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
            <label className="label" htmlFor="room_id">
              ID
            </label>
            <input
              type="text"
              readOnly
              className="input input-bordered input-info w-full max-w-xs"
              id="room_id"
              value={selectedRoomID || ""}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="room_location">
              Location
            </label>
            <input
              type="text"
              className="input input-bordered input-info w-full max-w-xs"
              id="room_location"
              value={selectedRoom.room_location}
              onChange={(e) => setSelectedRoom({ ...selectedRoom, room_location: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="room_number">
              Number
            </label>
            <input
              type="text"
              className="input input-bordered input-info w-full max-w-xs mb-3"
              id="room_number"
              value={selectedRoom.room_number}
              onChange={(e) => setSelectedRoom({ ...selectedRoom, room_number: e.target.value })}
            />
          </div>
          <div className="pt-2 flex gap-2">
            <button
              className="btn btn-outline btn-info"
              onClick={() => {
                setSelectedRoomID(null);
                setSelectedRoom({
                  room_location: "",
                  room_number: "",
                });
              }}
            >
              Clear
            </button>
            <button
              className="btn btn-outline btn-info"
              onClick={() => createOrUpdateSelectedRoom()}
            >
              Save
            </button>
            <button className="btn btn-outline btn-info" onClick={() => deleteSelectedRoom()}>
              Delete
            </button>
          </div>
          {/* XML File Upload */}
          <div>
            <XMLUpload
              onUploadSuccess={() => {
                getAllRooms().then((rooms) => setRooms(rooms));
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
