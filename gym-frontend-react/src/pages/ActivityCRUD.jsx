import { useEffect, useState } from "react";
import {
  createActivity,
  deleteActivityByID,
  getAllActivities,
  getActivityByID,
  updateActivity,
} from "../api/activity";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import { XMLUpload } from "../components/XMLUpload";
import Footer from "../components/Footer";
import { useAuthentication } from "../hooks/authentication";

export default function ActivityCRUD() {
  const [user] = useAuthentication();
  // Creates an empty space to store the activities list and selected activities
  const [activities, setActivities] = useState([]);
  const [selectedActivityID, setSelectedActivityID] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState({
    activity_id: "",
    activity_name: "",
    activity_description: "",
    activity_duration: "",
  });

  useEffect(() => {
    getAllActivities(user.user_authenticationkey).then((activities) => {
      setActivities(activities);
    });
  }, [selectedActivityID, user]);

  useEffect(() => {
    if (selectedActivityID) {
      getActivityByID(selectedActivityID, user.user_authenticationkey).then((activity) => {
        setSelectedActivity(activity);
      });
    } else {
      setSelectedActivity({
        activity_id: "",
        activity_name: "",
        activity_description: "",
        activity_duration: "",
      });
    }
  }, [selectedActivityID, user.user_authenticationkey]);

  // Create/Update function for the Save button
  function createOrUpdateSelectedActivity() {
    // This function updates the selected activity if there is
    // an ID in the ID field, otherwise if the ID field is blank
    // it will create a new activity
    if (selectedActivityID) {
      // Update
      updateActivity(selectedActivity).then((updatedActivity) => {
        setSelectedActivityID(null);
        setSelectedActivity({
          activity_id: "",
          activity_name: "",
          activity_description: "",
          activity_duration: "",
        });
      });
    } else {
      // Create
      createActivity(selectedActivity).then((createdActivity) => {
        setSelectedActivityID(createActivity.activity_id);
      });
    }
  }

  function deleteSelectedActivity() {
    deleteActivityByID(selectedActivity.activity_id).then((result) => {
      console.log("delete debug", selectedActivity);
      setSelectedActivityID(null);
      setSelectedActivity({
        activity_id: "",
        activity_name: "",
        activity_description: "",
        activity_duration: "",
      });
    });
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap 2">
        {/* Activities List */}
        <div className="overflow-x-auto pt-0 pl-0 sm:pt-11 sm:pl-4">
          {activities.length == null ? (
            <Spinner />
          ) : (
            <table className="table table-compact w-full">
              <thead>
                <tr className="text-cyan-500">
                  <th className="w-1/5">ID</th>
                  <th className="w-1/5">Name</th>
                  <th className="w-1/5">Description</th>
                  <th className="w-1/5">Duration</th>
                  <th className="w-1/5">Select</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.activity_id}>
                    <td>{activity.activity_id}</td>
                    <td>{activity.activity_name}</td>
                    <td className="overflow-hidden text-ellipsis">
                      {activity.activity_description.substring(
                        10,
                        activity.activity_id.length / 2
                      ) + "..."}
                    </td>
                    <td>{activity.activity_duration}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-info btn-xs"
                        onClick={() => setSelectedActivityID(activity.activity_id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Edit Form */}
        <div className="pl-10 text-lg">
          <div className="form-control">
            <label className="label" htmlFor="activity_id">
              ID
            </label>
            <input
              type="text"
              readOnly
              className="input input-bordered input-info w-full max-w-xs"
              id="activity_id"
              value={parseInt(selectedActivityID) || ""}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="activity_name">
              Name
            </label>
            <input
              type="text"
              className="input input-bordered input-info w-full max-w-xs"
              id="activity_name"
              value={selectedActivity.activity_name}
              onChange={(e) =>
                setSelectedActivity({ ...selectedActivity, activity_name: e.target.value })
              }
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="activity_description">
              Description
            </label>
            <input
              type="text"
              className="input input-bordered input-info w-full max-w-xs"
              id="activity_description"
              value={selectedActivity.activity_description}
              onChange={(e) =>
                setSelectedActivity({ ...selectedActivity, activity_description: e.target.value })
              }
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="activity_duration">
              Duration
            </label>
            <input
              type="text"
              className="input input-bordered input-info w-full max-w-xs mb-3"
              id="activity_duration"
              value={selectedActivity.activity_duration}
              onChange={(e) =>
                setSelectedActivity({ ...selectedActivity, activity_duration: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="pt-2 flex gap-2">
            <button
              className="btn btn-outline btn-info"
              onClick={() => {
                setSelectedActivityID(null);
                setSelectedActivity({
                  activity_name: "",
                  activity_description: "",
                  activity_duration: "",
                });
              }}
            >
              Clear
            </button>
            <button
              className="btn btn-outline btn-info"
              onClick={() => createOrUpdateSelectedActivity()}
            >
              Save
            </button>
            <button className="btn btn-outline btn-info" onClick={() => deleteSelectedActivity()}>
              Delete
            </button>
          </div>
          {/* XML File Upload */}
          <div>
            <XMLUpload
              onUploadSuccess={() => {
                getAllActivities().then((activities) => setActivities(activities));
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
