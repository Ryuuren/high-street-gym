import { db } from "../database/mysql.js";

// USER MODEL CONSTRUCTOR
export function User(
  user_id,
  user_email,
  user_password,
  user_role,
  user_firstname,
  user_lastname,
  user_phone,
  user_address,
  user_authenticationkey
) {
  return {
    user_id,
    user_email,
    user_password,
    user_role,
    user_firstname,
    user_lastname,
    user_phone,
    user_address,
    user_authenticationkey,
  };
}

// CREATE
export async function createUser(user) {
  // New user should not have an existing ID, delete just to be sure.
  delete user.user_id;
  // Insert the user and return the resulting promise
  return db
    .query(
      "INSERT INTO users (user_email, user_password, user_role, user_firstname, user_lastname, user_phone, user_address) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        user.user_email,
        user.user_password,
        user.user_role,
        user.user_firstname,
        user.user_lastname,
        user.user_phone,
        user.user_address,
      ]
    )
    .then(([result]) => {
      // Inject the inserted ID into the user object and return
      return { ...user, user_id: result.insertId };
    });
}

// READ
export async function getAllUsers() {
  // Get the collection of all users
  const [allUserResults] = await db.query("SELECT * FROM users");
  // If there are no users in the database, return an error
  if (allUserResults.length === 0) {
    return Promise.reject("No users available");
  }

  // Convert the collection of results into a list of user objects created by the User constructor
  return await allUserResults.map((userResult) =>
    User(
      userResult.user_id.toString(),
      userResult.user_email,
      userResult.user_password,
      userResult.user_role,
      userResult.user_firstname,
      userResult.user_lastname,
      userResult.user_phone,
      userResult.user_address,
      userResult.user_authenticationkey
    )
  );
}

// READ BY ID
export async function getUserByID(userID) {
  // Find the first user document with a matching ID
  const [userResults] = await db.query("SELECT * FROM users WHERE user_id = ?", userID);
  // If there is more than one user in the database, return the first one matching the ID
  if (userResults.length > 0) {
    const userResult = userResults[0];
    // Return the resulting document
    return Promise.resolve(
      User(
        userResult.user_id.toString(),
        userResult.user_email,
        userResult.user_password,
        userResult.user_role,
        userResult.user_firstname,
        userResult.user_lastname,
        userResult.user_phone,
        userResult.user_address,
        userResult.user_authenticationkey
      )
    );
  } else {
    return Promise.reject("no user found");
  }
}

// READ BY EMAIL
export async function getUserByEmail(email) {
  // Find the first user document with a matching email
  const [userResults] = await db.query("SELECT * FROM users WHERE user_email = ?", email);
  // If there is more than one user in the database, return the first one matching the email
  if (userResults.length > 0) {
    const userResult = userResults[0];
    // Return the resulting document
    return Promise.resolve(
      User(
        userResult.user_id.toString(),
        userResult.user_email,
        userResult.user_password,
        userResult.user_role,
        userResult.user_firstname,
        userResult.user_lastname,
        userResult.user_phone,
        userResult.user_address,
        userResult.user_authenticationkey
      )
    );
  } else {
    return Promise.reject("no results found");
  }
}

// READ BY AUTHENTICATION KEY
export async function getUserByAuthenticationKey(userAuthKey) {
  // Find the first user document with a matching authenticationkey
  const [userResults] = await db.query(
    "SELECT * FROM users WHERE user_authenticationkey = ?",
    userAuthKey
  );
  // If there is more than one user in the database, return the first one matching the authenticationkey

  if (userResults.length > 0) {
    const userResult = userResults[0];
    // Return the resulting document
    return Promise.resolve(
      User(
        userResult.user_id.toString(),
        userResult.user_email,
        userResult.user_password,
        userResult.user_role,
        userResult.user_firstname,
        userResult.user_lastname,
        userResult.user_phone,
        userResult.user_address,
        userResult.user_authenticationkey
      )
    );
  } else {
    return Promise.reject("no results found");
  }
}

// UPDATE
export async function updateUser(user) {
  // Runs the update on all columns for the row with the provided ID
  //
  // Admins can update the details of all users, including upgrading their role
  let query =
    "UPDATE users SET " +
    "user_email = ?, " +
    "user_password = ?, " +
    "user_role = ?, " +
    "user_firstname = ?, " +
    "user_lastname = ?, " +
    "user_phone = ?, " +
    "user_address = ?";

  let params = [
    user.user_email,
    user.user_password,
    user.user_role,
    user.user_firstname,
    user.user_lastname,
    user.user_phone,
    user.user_address,
  ];

  // Since the update doesn't include the authenticationkey,
  // it will be undefined in the request body.
  // This code will query the current authenticationkey and push
  // it onto the params, thus preventing it from being undefined and
  // rendered null.
  //
  // Without this code, a logged in user having their details updated will
  // lose their authenticationkey and be force logged out.
  if (user.user_authenticationkey !== undefined) {
    query += ", user_authenticationkey = ?";
    params.push(user.user_authenticationkey);
  }

  // Also queries the user_id and pushes it back in to prevent it being altered
  query += " WHERE user_id = ?";

  params.push(user.user_id);

  const [result] = await db.query(query, params);
  // If a user is updated, show the result
  if (result.affectedRows > 0) {
    return { ...user };
  } else {
    return Promise.reject("User not found");
  }
}

// DELETE
export async function deleteUserByID(userID) {
  const [result] = await db.query("DELETE FROM users WHERE user_id = ?", userID);
  if (result.affectedRows === 0) {
    return Promise.reject("User not found");
  }
  return result;
}
