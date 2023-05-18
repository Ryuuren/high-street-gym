import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid4 } from "uuid";
import { validate } from "../middleware/validator.js";
import {
  User,
  createUser,
  getAllUsers,
  getUserByID,
  getUserByEmail,
  getUserByAuthenticationKey,
  updateUser,
  deleteUserByID,
} from "../models/user.js";
import auth from "../middleware/auth.js";

const userController = Router();

// Start - Register New User Endpoint
const RegisterUserSchema = {
  type: "object",
  required: [
    "user_email",
    "user_password",
    "user_firstname",
    "user_lastname",
    "user_phone",
    "user_address",
  ],
  properties: {
    user_email: {
      type: "string",
    },
    user_password: {
      type: "string",
    },
    user_firstname: {
      type: "string",
    },
    user_lastname: {
      type: "string",
    },
    user_phone: {
      type: "string",
    },
    user_address: {
      type: "string",
    },
  },
};

userController.post("/users/register", validate({ body: RegisterUserSchema }), async (req, res) => {
  // Get the user data out of the request
  const userData = req.body;

  // hash the password if it isn't already hashed
  if (userData.user_password && !userData.user_password.startsWith("$2a")) {
    const salt = await bcrypt.genSalt(10);
    userData.user_password = await bcrypt.hash(userData.user_password, salt);
  }

  // Convert the user data into an User model object
  const user = User(
    null,
    userData.user_email,
    userData.user_password,
    "Member",
    userData.user_firstname,
    userData.user_lastname,
    userData.user_phone,
    userData.user_address,
    null
  );

  // Use the create model function to insert this user into the DB
  try {
    const createdUser = await createUser(user);
    res.status(200).json({
      status: 200,
      message: "Registration successful",
      user: createdUser,
    });
  } catch (error) {
    if (error.status === 409) {
      res.status(409).json({
        status: 409,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 500,
        message: "Registration failed " + error.message,
      });
    }
  }
});
// End - Register New User Endpoint
//
// Start - Login User Endpoint
const postUserLoginSchema = {
  type: "object",
  required: ["user_email", "user_password"],
  properties: {
    user_email: {
      type: "string",
    },
    user_password: {
      type: "string",
    },
  },
};

userController.post("/users/login", validate({ body: postUserLoginSchema }), (req, res) => {
  // Get the login information from the request body
  let loginData = req.body;

  getUserByEmail(loginData.user_email)
    .then((user) => {
      // Check if the hashed password matches the user password
      if (bcrypt.compareSync(loginData.user_password, user.user_password)) {
        // Assign a unique authenticationKey to the previously null value
        user.user_authenticationkey = uuid4().toString();

        // Run the update function to save this new authenticationKey value
        updateUser(user).then((result) => {
          res.status(200).json({
            status: 200,
            message: "User logged in",
            authenticationKey: user.user_authenticationkey,
          });
        });
      } else {
        // If the login details don't match that in the database
        res.status(400).json({
          status: 400,
          message: "Invalid credentials",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Login failed " + error.message,
      });
    });
});
// End - Login User Endpoint
//
// Start - Logout User Endpoint
const postUserLogoutSchema = {
  type: "object",
  required: ["user_authenticationkey"],
  properties: {
    user_authenticationkey: {
      type: "string",
    },
  },
};

userController.post("/users/logout", validate({ body: postUserLogoutSchema }), (req, res) => {
  // Gets the authenticationkey from the body of the request
  const authenticationKey = req.body.user_authenticationkey;
  // Finds the user matching the provided authenticationkey
  getUserByAuthenticationKey(authenticationKey)
    .then((user) => {
      // Once more sets the authenticationKey to a null value, logging the user out
      user.user_authenticationkey = null;
      updateUser(user).then((user) => {
        res.status(200).json({
          status: 200,
          message: "User logged out",
        });
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to logout user " + error.message,
      });
    });
});
// End - Logout User Endpoint
//
// Start - Create User Endpoint
const createUserSchema = {
  type: "object",
  required: [
    "user_email",
    "user_password",
    "user_role",
    "user_firstname",
    "user_lastname",
    "user_phone",
    "user_address",
  ],
  properties: {
    user: {
      type: "object",
      properties: {
        user_email: {
          type: "string",
        },
        user_password: {
          type: "string",
        },
        user_role: {
          type: "string",
          enum: ["Member", "Trainer", "Admin"],
        },
        user_phone: {
          type: "string",
        },
        user_firstName: {
          type: "string",
        },
        user_lastName: {
          type: "string",
        },
        user_address: {
          type: "string",
        },
      },
    },
  },
};

userController.post(
  "/users",
  [auth(["Admin"]), validate({ body: createUserSchema })],
  async (req, res) => {
    // Get the user data out of the request
    const userData = req.body;

    // hash the password if it isn't already hashed
    if (userData.user_password && !userData.user_password.startsWith("$2a")) {
      const salt = await bcrypt.genSalt(10);
      userData.user_password = await bcrypt.hash(userData.user_password, salt);
    }

    // Convert the user data into an User model object
    const user = User(
      null,
      userData.user_email,
      userData.user_password,
      userData.user_role,
      userData.user_firstname,
      userData.user_lastname,
      userData.user_phone,
      userData.user_address,
      null
    );

    // Use the create model function to insert this user into the DB
    try {
      const createdUser = await createUser(user);
      res.status(200).json({
        status: 200,
        message: "Created new user",
        user: createdUser,
      });
    } catch (error) {
      if (error.status === 409) {
        res.status(409).json({
          status: 409,
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: 500,
          message: "Failed to create new user " + error.message,
        });
      }
    }
  }
);
// End - Create User Endpoint
//
// Start - Get All Users Endpoint
const getUserListSchema = {
  type: "object",
  properties: {},
};

userController.get(
  "/users",
  [auth(["Admin", "Trainer"]), validate({ body: getUserListSchema })],
  (req, res) => {
    // Use the get all users model function to retrieve all users
    getAllUsers()
      .then((users) => {
        res.status(200).json({
          status: 200,
          message: "Got all users",
          users: users,
        });
      })
      .catch((error) => {
        // If the model returns "No users available", show a 404 error
        if (error === "No users available") {
          res.status(404).json({
            status: 404,
            message: "No users available in the collection",
          });
        } else {
          res.status(500).json({
            status: 500,
            message: "Failed to get all users",
          });
        }
      });
  }
);
// End - Get All Users Endpoint
//
// Start - Get User By ID Endpoint
const getUserByIDSchema = {
  type: "object",
  properties: {
    user_id: {
      type: "string",
    },
  },
};

userController.get("/users/:user_id", validate({ params: getUserByIDSchema }), (req, res) => {
  const userID = req.params.user_id;

  // Use the get by ID model function to retrieve the single user
  getUserByID(userID)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Got user by ID",
        user: user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get user by ID",
      });
    });
});
// End - Get User By ID Endpoint
//
// Start - Get User By AuthenticationKey Endpoint
const getUserByAuthenticationKeySchema = {
  type: "object",
  required: ["user_authenticationkey"],
  properties: {
    user_authenticationkey: {
      type: "string",
    },
  },
};

userController.get(
  "/users/by-key/:user_authenticationkey",
  validate({ params: getUserByAuthenticationKeySchema }),
  (req, res) => {
    const userAuthKey = req.params.user_authenticationkey;
    getUserByAuthenticationKey(userAuthKey)
      .then((user) => {
        res.status(200).json({
          status: 200,
          message: "Got user by authentication key",
          user: user,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to get user by authentication key",
        });
      });
  }
);
// End - Get User By AuthenticationKey Endpoint
//
// Start - Update User By ID Endpoint
const updateUserSchema = {
  type: "object",
  properties: {
    user: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
        },
        user_email: {
          type: "string",
        },
        user_password: {
          type: "string",
        },
        user_role: {
          type: "string",
          enum: ["Member", "Trainer", "Admin"],
        },
        user_phone: {
          type: "string",
        },
        user_firstName: {
          type: "string",
        },
        user_lastName: {
          type: "string",
        },
        user_address: {
          type: "string",
        },
      },
    },
  },
};

userController.patch("/users",
[auth(["Admin", "Trainer"]), validate({ body: updateUserSchema })], async (req, res) => {
  // Get the user data out of the request
  const userData = req.body;

  // hash the password if it isn't already hashed
  if (userData.user_password && !userData.user_password.startsWith("$2a")) {
    const salt = await bcrypt.genSalt(10);
    userData.user_password = await bcrypt.hash(userData.user_password, salt);
  }

  // Convert the user data into a User model object
  const user = User(
    userData.user.user_id,
    userData.user.user_email,
    userData.user.user_password,
    userData.user.user_role,
    userData.user.user_firstname,
    userData.user.user_lastname,
    userData.user.user_phone,
    userData.user.user_address
  );

  // Check that the user has an ID
  if (!user.user_id) {
    res.status(404).json({
      status: 404,
      message: "Cannot find user to update without ID",
    });
    return;
  }

  // Use the update model function to update this user in the DB
  try {
    const result = await updateUser(user);
    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: "No user found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Updated user",
      user: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to update user " + error.message,
    });
  }
});
// End - Update User By ID Endpoint
//
// Start - Delete User By ID Endpoint
const deleteUserSchema = {
  type: "object",
  required: ["user_id"],
  properties: {
    user_id: {
      type: "string",
    },
  },
};

userController.delete("/users", validate({ body: deleteUserSchema }), (req, res) => {
  // Pick out the ID from the request body
  const userID = req.body.user_id;

  deleteUserByID(userID)
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "Deleted user by ID",
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to delete user by ID " + error.message,
      });
    });
});
// End - Delete User By ID Endpoint

export default userController;
