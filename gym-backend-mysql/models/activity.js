import { db } from "../database/mysql.js";

// CREATE
export async function createActivity(activity) {
  // New activity should not have an existing ID, delete just to be sure.
  delete activity.activity_id;
  // Insert the activity and return the resulting promise
  return db
    .query(
      "INSERT INTO activities (activity_name, activity_description, activity_duration) VALUES (?, ?, ?)",
      [activity.activity_name, activity.activity_description, activity.activity_duration]
    )
    .then(([result]) => {
      // Inject the inserted ID into the activity object and return
      return { ...activity, activity_id: result.insertId };
    });
}

// READ
export async function getAllActivities() {
  // Get the collection of all activities
  const [allActivitiesResults] = await db.query("SELECT * FROM activities");
  // If there are no activities in the database, return an error
  if (allActivitiesResults.length === 0) {
    return Promise.reject("No activities available");
  }
  // Convert the collection of results into a list of activity objects
  return await allActivitiesResults.map((activityResult) => {
    return { ...activityResult };
  });
}

// READ BY ID
export async function getActivityByID(activityID) {
  // Find the first activity document with a matching ID
  const [activitiesResults] = await db.query(
    "SELECT * FROM activities WHERE activity_id = ?",
    activityID
  );
  // If there is more than one activity in the database, return the first one matching the ID
  if (activitiesResults.length > 0) {
    const activityResult = activitiesResults[0];
    // Return the resulting document
    return Promise.resolve(activityResult);
  } else {
    return Promise.reject("No activity found");
  }
}

// UPDATE
export async function updateActivity(activity) {
  // Runs the update on all columns for the row with the provided ID
  //
  // Useful for editing the details of an activity in case of errors
  const [result] = await db.query(
    "UPDATE activities SET activity_name = ?, activity_description = ?, activity_duration = ? WHERE activity_id = ?",
    [
      activity.activity_name,
      activity.activity_description,
      activity.activity_duration,
      activity.activity_id,
    ]
  );

  // If an activity is updated, show the result
  if (result.affectedRows > 0) {
    return result;
  } else {
    return Promise.reject("Activity not found");
  }
}

// DELETE
export async function deleteActivityByID(activityID) {
  const [result] = await db.query("DELETE FROM activities WHERE activity_id = ?", activityID);
  if (result.affectedRows === 0) {
    return Promise.reject("Activity not found");
  }
  return result;
}
