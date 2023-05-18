import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

// Create express application
const port = 8080;
const app = express();

// Enable cross-origin resource sharing (CORS)
//
// CORS allows us to set what front-end URLs are allowed
// to access this API.
app.use(
  cors({
    // Allow all origins
    origin: true,
  })
);

// Enables uploading of XML file types
app.use(
  fileUpload({
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
  })
);

// Enable JSON request parsing middleware.
//
// Must be done before endpoints are defined.
//
// If a request with 'Content-Type: application/json' header is made
// to an endpoint, this middleware will treat the request body
// as a JSON string. It will attempt to parse it with
// 'JSON.parse()' and set the resulting object (or array)
// on the body property of the request object, which you can
// access in your endpoints or other middleware.
app.use(express.json());

// Import and use controllers
import activityController from "./controllers/activities.js";
app.use(activityController);
import blogController from "./controllers/blogs.js";
app.use(blogController);
import bookingController from "./controllers/bookings.js";
app.use(bookingController);
import roomController from "./controllers/rooms.js";
app.use(roomController);
import sessionController from "./controllers/sessions.js";
app.use(sessionController);
import userController from "./controllers/users.js";
app.use(userController);

// Import and use validation error handling middleware
import { validateErrorMiddleware } from "./middleware/validator.js";
app.use(validateErrorMiddleware);

// Start listening for API requests
app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}`);
});
