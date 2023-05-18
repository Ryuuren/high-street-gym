import { API_URL, getAuthenticationKeyFromLocalStorage } from "./api";

// REGISTER
export async function registerUser(user) {
  const response = await fetch(API_URL + "/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}

// LOGIN
export async function login(user_email, user_password) {
  const response = await fetch(API_URL + "/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_email,
      user_password,
    }),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}

// LOGOUT
export async function logout(user_authenticationkey) {
  const response = await fetch(API_URL + "/users/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_authenticationkey,
    }),
  });

  const APIResponseObject = response.json();

  return APIResponseObject;
}

// CREATE
export async function createUser(user) {
  const authenticationKey = getAuthenticationKeyFromLocalStorage();
  const response = await fetch(API_URL + "/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authentication-key": authenticationKey,
    },
    body: JSON.stringify(user),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.user;
}

// READ
export async function getAllUsers() {
  const authenticationKey = getAuthenticationKeyFromLocalStorage();
  // GET from the API /users
  const response = await fetch(API_URL + "/users?authenticationKey=" + authenticationKey, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "authentication-key": authenticationKey,
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.users;
}

// READ BY ID
export async function getUserByID(userID, authenticationKey) {
  // GET from the API /users/:id
  const response = await fetch(API_URL + "/users/" + userID + "?authKey=" + authenticationKey, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.user;
}

// READ BY AUTHENTICATIONKEY
export async function getByAuthenticationKey(user_authenticationkey) {
  const response = await fetch(API_URL + "/users/by-key/" + user_authenticationkey, {
    method: "GET",
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.user;
}

// UPDATE
export async function updateUser(user) {
  const authenticationKey = getAuthenticationKeyFromLocalStorage();
  const response = await fetch(API_URL + "/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "authentication-key": authenticationKey,
    },
    body: JSON.stringify({ user }),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.user;
}

// DELETE
export async function deleteUserByID(userID) {
  // userID = JSON.stringify(userID)
  const response = await fetch(API_URL + "/users", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userID }),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}
