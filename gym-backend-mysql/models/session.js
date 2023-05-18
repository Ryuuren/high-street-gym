import { db } from "../database/mysql.js";

// CREATE
export async function createSession(session) {
  // New session should not have an existing ID, delete just to be sure.
  delete session.session_id;
  // Insert the session and return the resulting promise
  return db
    .query(
      "INSERT INTO sessions (session_datetime, session_room_id, session_activity_id, session_trainer_user_id) VALUES (?, ?, ?, ?)",
      [
        session.session_datetime,
        session.session_room_id,
        session.session_activity_id,
        session.session_trainer_user_id,
      ]
    )
    .then(([result]) => {
      // Inject the inserted ID into the session object and return
      return { ...session, session_id: result.insertId };
    });
}

// READ
export async function getAllSessions() {
  // Get the collection of all sessions that haven't happened yet
  const [allSessionsResults] = await db.query(
    "SELECT * FROM sessions WHERE session_datetime > NOW() ORDER BY session_datetime ASC"
  );

  // If there are no upcoming sessions, return an error
  if (allSessionsResults.length === 0) {
    return Promise.reject("No upcoming sessions available");
  }

  // Convert the collection of results into a list of session objects
  return await allSessionsResults.map((sessionResult) => {
    return { ...sessionResult };
  });
}

// READ FROM TOP
export async function getTopSessions(amount) {
  // Get the collection of all sessions
  const [allSessionsResults] = await db.query(
    "SELECT * FROM sessions WHERE session_datetime > NOW() ORDER BY session_datetime ASC LIMIT ?",
    [amount]
  );
  // If there are no sessions in the database, return an error
  if (allSessionsResults.length === 0) {
    return Promise.reject("No sessions available");
  }
  // Convert the collection of results into a list of session objects
  return await allSessionsResults.map((sessionResult) => {
    return { ...sessionResult };
  });
}

// READ BY ID
export async function getSessionByID(sessionID) {
  // Find the first session document with a matching ID
  const [sessionsResults] = await db.query(
    "SELECT * FROM sessions WHERE session_id = ?",
    sessionID
  );
  // If there is more than one session in the database, return the first one matching the ID
  if (sessionsResults.length > 0) {
    const sessionResult = sessionsResults[0];
    // Return the resulting document
    return Promise.resolve(sessionResult);
  } else {
    return Promise.reject("No session found");
  }
}

// UPDATE
export async function updateSession(session) {
  // Runs the update on all columns for the row with the provided ID
  //
  // This is useful for switching a session to another room, activity or trainer
  const [result] = await db.query(
    "UPDATE sessions SET session_datetime = ?, session_room_id = ?, session_activity_id = ?, session_trainer_user_id = ? WHERE session_id = ?",
    [
      session.session_datetime,
      session.session_room_id,
      session.session_activity_id,
      session.session_trainer_user_id,
      session.session_id,
    ]
  );

  // If a session is updated, show the result
  if (result.affectedRows > 0) {
    return result;
  } else {
    return Promise.reject("Session not found");
  }
}

// DELETE
export async function deleteSessionByID(sessionID) {
  const [result] = await db.query("DELETE FROM sessions WHERE session_id = ?", sessionID);
  if (result.affectedRows === 0) {
    return Promise.reject("Activity not found");
  }
  return result;
}
