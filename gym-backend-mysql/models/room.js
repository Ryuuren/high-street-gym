import { db } from "../database/mysql.js";

// CREATE
export async function createRoom(room) {
  // New room should not have an existing ID, delete just to be sure.
  delete room.room_id;
  // Insert the room and return the resulting promise
  return db
    .query("INSERT INTO rooms (room_location, room_number) VALUES (?, ?)", [
      room.room_location,
      room.room_number,
    ])
    .then(([result]) => {
      // Inject the inserted ID into the room object and return
      return { ...room, room_id: result.insertId };
    });
}

// READ
export async function getAllRooms() {
  // Get the collection of all rooms
  const [allRoomsResults] = await db.query("SELECT * FROM rooms");
  // If there are no rooms in the database, return an error
  if (allRoomsResults.length === 0) {
    return Promise.reject("No rooms available");
  }
  // Convert the collection of results into a list of room objects
  return await allRoomsResults.map((roomResult) => {
    return { ...roomResult };
  });
}

// READ BY ID
export async function getRoomByID(roomID) {
  // Find the first room document with a matching ID
  const [roomsResults] = await db.query("SELECT * FROM rooms WHERE room_id = ?", roomID);
  // If there is more than one room in the database, return the first one matching the ID
  if (roomsResults.length > 0) {
    const roomResult = roomsResults[0];
    // Return the resulting document
    return Promise.resolve(roomResult);
  } else {
    return Promise.reject("No room found");
  }
}

// UPDATE
export async function updateRoom(room) {
  // Runs the update on all columns for the row with the provided ID
  //
  // Useful for editing the details of a room in case of errors
  const [result] = await db.query(
    "UPDATE rooms SET room_location = ?, room_number = ? WHERE room_id = ?",
    [room.room_location, room.room_number, room.room_id]
  );

  // If a room is updated, show the result
  if (result.affectedRows > 0) {
    return result;
  } else {
    return Promise.reject("Room not found");
  }
}

// DELETE
export async function deleteRoomByID(roomID) {
  const [result] = await db.query("DELETE FROM rooms WHERE room_id = ?", roomID);
  if (result.affectedRows === 0) {
    return Promise.reject("Room not found");
  }
  return result;
}
