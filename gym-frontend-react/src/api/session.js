import { API_URL } from "./api.js";

// CREATE
export async function createSession(session) {
  const response = await fetch(API_URL + "/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(session),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.session;
}

// READ
export async function getAllSessions() {
  const response = await fetch(API_URL + "/sessions", {
    method: "GET",
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.sessions;
}

// READ FROM TOP
export async function getTopSessions(amount) {
  const response = await fetch(API_URL + "/top-sessions/" + amount, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.sessions;
}

// READ BY ID
export async function getSessionByID(sessionID) {
  const response = await fetch(API_URL + "/sessions/" + sessionID, {
    method: "GET",
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.session;
}

// UPDATE
export async function updateSession(session) {
  const response = await fetch(API_URL + "/sessions", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(session),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.session;
}

// DELETE
export async function deleteSessionByID(sessionID) {
  sessionID = JSON.stringify(sessionID);
  const response = await fetch(API_URL + "/sessions", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_id: sessionID }),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}
