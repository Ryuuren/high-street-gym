import { Router } from "express";
import { validate } from "../middleware/validator.js";
import {
  createSession,
  getAllSessions,
  getTopSessions,
  getSessionByID,
  updateSession,
  deleteSessionByID,
} from "../models/session.js";

const sessionController = Router();

// Start - Create Session Endpoint
const createSessionSchema = {
  type: "object",
  required: [
    "session_datetime",
    "session_room_id",
    "session_activity_id",
    "session_trainer_user_id",
  ],
  properties: {
    session_datetime: {
      type: "string",
    },
    session_room_id: {
      type: "string",
    },
    session_activity_id: {
      type: "string",
    },
    session_trainer_user_id: {
      type: "string",
    },
  },
};

sessionController.post("/sessions", validate({ body: createSessionSchema }), (req, res) => {
  // Get the session data out of the request
  const session = req.body;

  // Use the create session model function to insert this session into the DB
  createSession(session)
    .then((session) => {
      res.status(200).json({
        status: 200,
        message: "Created session",
        session: session,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to create session " + error.message,
      });
    });
});
// End - Create Session Endpoint
//
// Start - Get All Sessions Endpoint
const getSessionListSchema = {
  type: "object",
  properties: {},
};

sessionController.get("/sessions", validate({ body: getSessionListSchema }), (req, res) => {
  // Use the get all sessions model function to retrieve all sessions
  getAllSessions()
    .then((sessions) => {
      res.status(200).json({
        status: 200,
        message: "Got all sessions",
        sessions: sessions,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get all sessions",
      });
    });
});
// End - Get All Sessions Endpoint
//
// Start - Get Top Sessions Endpoint
const getTopSessionsListSchema = {
  type: "object",
  required: ["amount"],
  properties: {
    amount: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

sessionController.get(
  "/top-sessions/:amount",
  validate({ params: getTopSessionsListSchema }),
  async (req, res) => {
    const amount = parseInt(req.params.amount);

    const sessions = await getTopSessions(amount);

    res.status(200).json({
      status: 200,
      message: "Get top sessions",
      sessions: sessions,
    });
  }
);
// End - Get Top Sessions Endpoint
//
// Start - Get Session By ID Endpoint
const getSessionByIDSchema = {
  type: "object",
  properties: {
    session_id: {
      type: "string",
    },
  },
};

sessionController.get(
  "/sessions/:session_id",
  validate({ params: getSessionByIDSchema }),
  (req, res) => {
    const sessionID = req.params.session_id;

    // Use the get by ID model function to retrieve the single session
    getSessionByID(sessionID)
      .then((session) => {
        res.status(200).json({
          status: 200,
          message: "Got session by ID",
          session: session,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to get session by ID - ID invalid or doesn't exist",
        });
      });
  }
);
// End - Get Session By ID Endpoint
//
// Start - Update Session By ID Endpoint
const updateSessionSchema = {
  type: "object",
  required: ["session_id"],
  properties: {
    session_id: {
      type: "number",
    },
    session_datetime: {
      type: "string",
    },
    session_room_id: {
      type: "number",
    },
    session_activity_id: {
      type: "number",
    },
    session_trainer_user_id: {
      type: "number",
    },
  },
};

sessionController.patch("/sessions", validate({ body: updateSessionSchema }), async (req, res) => {
  const session = req.body;

  console.log(session);

  // Check that the session has an ID
  if (!session.session_id) {
    res.status(404).json({
      status: 404,
      message: "Cannot find session to update without ID",
    });
    return;
  }

  // Use the update model function to update the existing row/document
  // in the database for this session
  updateSession(session)
    .then((updatedSession) => {
      res.status(200).json({
        status: 200,
        message: "Session updated",
        session: updatedSession,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to update session - ID invalid or doesn't exist " + error,
      });
    });
});
// End - Update Session By ID Endpoint
//
// Start - Delete Session By ID Endpoint
const deleteSessionSchema = {
  type: "object",
  required: ["session_id"],
  properties: {
    session_id: {
      type: "string",
    },
  },
};

sessionController.delete("/sessions", validate({ body: deleteSessionSchema }), (req, res) => {
  const sessionID = req.body.session_id;

  deleteSessionByID(sessionID)
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "Deleted session by ID",
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to delete session by ID - ID invalid or doesn't exist",
      });
    });
});
// End - Delete Session By ID Endpoint

export default sessionController;
