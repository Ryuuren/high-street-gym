import { Router } from "express";
import { validate } from "../middleware/validator.js";
import xml2js from "xml2js";
import {
  createActivity,
  getAllActivities,
  getActivityByID,
  updateActivity,
  deleteActivityByID,
} from "../models/activity.js";

const activityController = Router();

// Start - Upload XML Activity Endpoint
activityController.post("/upload-xml-activities", (req, res) => {
  if (req.files && req.files["xml-file"]) {
    // Access the XML file as a string
    const XMLFile = req.files["xml-file"];
    const file_text = XMLFile.data.toString();

    // Set up XML parser
    const parser = new xml2js.Parser();
    parser
      .parseStringPromise(file_text)
      .then((data) => {
        const activityUpload = data["activity-upload"];
        const activityUploadAttributes = activityUpload["$"];
        const operation = activityUploadAttributes["operation"];
        // Slightly painful indexing to reach nested children
        const activitiesData = activityUpload["activities"][0].activity;

        if (operation == "insert") {
          Promise.all(
            activitiesData.map((activityData) => {
              // Convert the xml object into a model object
              const activityModel = {
                activity_name: activityData.activity_name.toString(),
                activity_description: activityData.activity_description.toString(),
                activity_duration: activityData.activity_duration.toString(),
              };
              // Return the promise of each creation query
              return createActivity(activityModel);
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
          console.log("Updating activities from XML")
          Promise.all(
            activitiesData.map((activityData) => {
              console.log("Xml activity data: ", activityData)
              // Convert the xml object into a model object
              const activityModel = {
                activity_id: activityData.activity_id.toString(),
                activity_name: activityData.activity_name.toString(),
                activity_description: activityData.activity_description.toString(),
                activity_duration: activityData.activity_duration.toString(),
              };
              console.log("Activity model: ", activityModel)
              // Return the promise of each creation query
              return updateActivity(activityModel);
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
// End - Upload XML Activity Endpoint
//
// Start - Create Activity Endpoint
const createActivitySchema = {
  type: "object",
  required: ["activity_name", "activity_description", "activity_duration"],
  properties: {
    activity_name: {
      type: "string",
    },
    activity_description: {
      type: "string",
    },
    activity_duration: {
      type: "number",
    },
  },
};

activityController.post(
  "/activities",
  validate({ body: createActivitySchema }),
  async (req, res) => {
    // Get the activity data out of the request
    const activity = req.body;

    // Use the create activity model function to insert this activity into the DB
    createActivity(activity)
      .then((activity) => {
        res.status(200).json({
          status: 200,
          message: "Created activity",
          activity: activity,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to create activity " + error.message,
        });
      });
  }
);
// End - Create Activity Endpoint
//
// Start - Get All Activities Endpoint
const getActivityListSchema = {
  type: "object",
  properties: {},
};

activityController.get(
  "/activities",
  validate({ body: getActivityListSchema }),
  async (req, res) => {
    // Use the get all activities model function to retrieve all activities
    getAllActivities()
      .then((activities) => {
        res.status(200).json({
          status: 200,
          message: "Got all activities",
          activities: activities,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to get all activities",
        });
      });
  }
);
// End - Get All Activities Endpoint
//
// Start - Get Activity By ID Endpoint
const getActivityByIDSchema = {
  type: "object",
  properties: {
    activity_id: {
      type: "string",
    },
  },
};

activityController.get(
  "/activities/:activity_id",
  validate({ params: getActivityByIDSchema }),
  async (req, res) => {
    const activityID = req.params.activity_id;

    // Use the get by ID model function to retrieve the single activity
    getActivityByID(activityID)
      .then((activity) => {
        res.status(200).json({
          status: 200,
          message: "Got activity by ID",
          activity: activity,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to get activity by ID - ID invalid or doesn't exist",
        });
      });
  }
);
// End - Get Activity By ID Endpoint
//
// Start - Update Activity By ID Endpoint
const updateActivitySchema = {
  type: "object",
  required: ["activity_id"],
  properties: {
    activity_id: {
      type: "number",
    },
    activity_name: {
      type: "string",
    },
    activity_description: {
      type: "string",
    },
    activity_duration: {
      type: "number",
    },
  },
};

activityController.patch(
  "/activities",
  validate({ body: updateActivitySchema }),
  async (req, res) => {
    const activity = req.body;

    // Check that the activity has an ID
    if (!activity.activity_id) {
      res.status(404).json({
        status: 404,
        message: "Cannot find activity to update without ID",
      });
      return;
    }

    // Use the update model function to update the existing row/document
    // in the database for this activity
    updateActivity(activity)
      .then((updatedActivity) => {
        res.status(200).json({
          status: 200,
          message: "Activity updated",
          activity: updatedActivity,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to update activity - ID invalid or doesn't exist",
        });
      });
  }
);
// End - Update Activity By ID Endpoint
//
// Start - Delete Activity By ID Endpoint
const deleteActivitySchema = {
  type: "object",
  required: ["activity_id"],
  properties: {
    activity_id: {
      type: "string",
      minLength: 1,
    },
  },
};

activityController.delete("/activities", validate({ body: deleteActivitySchema }), (req, res) => {
  const activityID = req.body.activity_id;

  deleteActivityByID(activityID)
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "Deleted activity by ID",
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to delete activity by ID - ID invalid or doesn't exist",
      });
    });
});
// End - Delete Activity By ID Endpoint

export default activityController;
