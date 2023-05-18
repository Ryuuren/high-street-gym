import { API_URL } from "./api.js";

// CREATE
export async function createActivity(activity) {
  const response = await fetch(API_URL + "/activities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.activity;
}

// READ
export async function getAllActivities() {
  const response = await fetch(API_URL + "/activities", {
    method: "GET",
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.activities;
}

// READ BY ID
export async function getActivityByID(activityID) {
  const response = await fetch(API_URL + "/activities/" + activityID, {
    method: "GET",
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.activity;
}

// UPDATE
export async function updateActivity(activity) {
  const response = await fetch(API_URL + "/activities", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.activity;
}

// DELETE
export async function deleteActivityByID(activityID) {
  activityID = JSON.stringify(activityID);
  const response = await fetch(API_URL + "/activities", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ activity_id: activityID }),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}
