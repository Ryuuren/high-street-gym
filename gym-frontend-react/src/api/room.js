import { API_URL } from "./api.js";

// CREATE
export async function createRoom(room) {
  const response = await fetch(API_URL + "/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(room),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.room;
}

// READ
export async function getAllRooms() {
  const response = await fetch(API_URL + "/rooms", {
    method: "GET",
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.rooms;
}

// READ BY ID
export async function getRoomByID(roomID) {
  const response = await fetch(API_URL + "/rooms/" + roomID, {
    method: "GET",
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.room;
}

// UPDATE
export async function updateRoom(room) {
  const response = await fetch(API_URL + "/rooms", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(room),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.room;
}

// DELETE
export async function deleteRoomByID(roomID) {
  roomID = JSON.stringify(roomID);
  const response = await fetch(API_URL + "/rooms", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ room_id: roomID }),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}
