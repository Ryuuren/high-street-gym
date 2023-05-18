import { Router } from "express";
import { validate } from "../middleware/validator.js";
import xml2js from "xml2js";
import {
  createRoom,
  getAllRooms,
  getRoomByID,
  updateRoom,
  deleteRoomByID,
} from "../models/room.js";

const roomController = Router();

// Start - Upload XML Room Endpoint
roomController.post("/upload-xml-rooms", (req, res) => {
  if (req.files && req.files["xml-file"]) {
    // Access the XML file as a string
    const XMLFile = req.files["xml-file"];
    const file_text = XMLFile.data.toString();

    // Set up XML parser
    const parser = new xml2js.Parser();
    parser
      .parseStringPromise(file_text)
      .then((data) => {
        const roomUpload = data["room-upload"];
        const roomUploadAttributes = roomUpload["$"];
        const operation = roomUploadAttributes["operation"];
        // Slightly painful indexing to reach nested children
        const roomsData = roomUpload["rooms"][0].room;

        if (operation == "insert") {
          Promise.all(
            roomsData.map((roomData) => {
              // Convert the xml object into a model object
              const roomModel = {
                room_location: roomData.room_location.toString(),
                room_number: roomData.room_number.toString(),
              };
              // Return the promise of each creation query
              return createRoom(roomModel);
            })
          )
            .then((results) => {
              res.status(200).json({
                status: 200,
                message: "XML Upload insert successful",
              });
            })
            .catch((error) => {
              res.status(500).json({
                status: 500,
                message: "XML upload failed on database operation - " + error,
              });
            });
        } else if (operation == "update") {
          Promise.all(
            roomsData.map((roomData) => {
              // Convert the xml object into a model object
              const roomModel = {
                room_id: roomData.room_id.toString(),
                room_location: roomData.room_location.toString(),
                room_number: roomData.room_number.toString(),
              };
              // Return the promise of each creation query
              return updateRoom(roomModel);
            })
          )
            .then((results) => {
              res.status(200).json({
                status: 200,
                message: "XML Upload update successful",
              });
            })
            .catch((error) => {
              res.status(500).json({
                status: 500,
                message: "XML upload failed on database operation - " + error,
              });
            });
        } else {
          res.status(400).json({
            status: 400,
            message: "XML Contains invalid operation element value",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Error parsing XML - " + error,
        });
      });
  } else {
    res.status(400).json({
      status: 400,
      message: "No file selected",
    });
  }
});
// End - Upload XML Room Endpoint
//
// Start - Create Room Endpoint
const createRoomSchema = {
  type: "object",
  required: ["room_location", "room_number"],
  properties: {
    room_location: {
      type: "string",
    },
    room_number: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

roomController.post("/rooms", validate({ body: createRoomSchema }), async (req, res) => {
  // Get the room data out of the request
  const room = req.body;

  // Use the create room model function to insert this room into the DB
  createRoom(room)
    .then((room) => {
      res.status(200).json({
        status: 200,
        message: "Created room",
        room: room,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to create room, " + error.message,
      });
    });
});
// End - Create Room Endpoint
//
// Start - Get All Rooms Endpoint
const getRoomListSchema = {
  type: "object",
  properties: {},
};

roomController.get("/rooms", validate({ body: getRoomListSchema }), async (req, res) => {
  // Use the get all rooms model function to retrieve all rooms
  getAllRooms()
    .then((rooms) => {
      res.status(200).json({
        status: 200,
        message: "Got all rooms",
        rooms: rooms,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get all rooms",
      });
    });
});
// End - Get All Rooms Endpoint
//
// Start - Get Room By ID Endpoint
const getRoomByIDSchema = {
  type: "object",
  properties: {
    room_id: {
      type: "string",
    },
  },
};

roomController.get("/rooms/:room_id", validate({ params: getRoomByIDSchema }), async (req, res) => {
  const roomID = req.params.room_id;

  // Use the get by ID model function to retrieve the single room
  getRoomByID(roomID)
    .then((room) => {
      res.status(200).json({
        status: 200,
        message: "Got room by ID",
        room: room,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get room by ID - ID invalid or doesn't exist",
      });
    });
});
// End - Get Room By ID Endpoint
//
// Start - Update Room By ID Endpoint
const updateRoomSchema = {
  type: "object",
  required: ["room_id"],
  properties: {
    room_id: {
      type: "number",
    },
    room_location: {
      type: "string",
    },
    room_number: {
      type: "number",
    },
  },
};

roomController.patch("/rooms", validate({ body: updateRoomSchema }), async (req, res) => {
  const room = req.body;

  // Check that the room has an ID
  if (!room.room_id) {
    res.status(404).json({
      status: 404,
      message: "Cannot find room to update without ID",
    });
    return;
  }

  // Use the update model function to update the existing row/document
  // in the database for this room
  updateRoom(room)
    .then((updatedRoom) => {
      res.status(200).json({
        status: 200,
        message: "Room updated",
        room: updatedRoom,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to update room - ID invalid or doesn't exist",
      });
    });
});
// End - Update Room By ID Endpoint
//
// Start - Delete Room By ID Endpoint
const deleteRoomSchema = {
  type: "object",
  required: ["room_id"],
  properties: {
    room_id: {
      type: "string",
      minLength: 1,
    },
  },
};

roomController.delete("/rooms", validate({ body: deleteRoomSchema }), async (req, res) => {
  const roomID = req.body.room_id;

  deleteRoomByID(roomID)
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "Deleted room by ID",
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to delete room by ID - ID invalid or doesn't exist",
      });
    });
});
// End - Delete Room By ID Endpoint

export default roomController;
