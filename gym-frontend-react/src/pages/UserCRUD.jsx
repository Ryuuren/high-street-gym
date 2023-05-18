import { useEffect, useState } from "react";
import { createUser, deleteUserByID, getAllUsers, getUserByID, updateUser } from "../api/user";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import { useAuthentication } from "../hooks/authentication";

export default function UserCRUD() {
  const [user] = useAuthentication();
  // Creates an empty space to store the users list and selected users
  const [users, setUsers] = useState([]);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [selectedUser, setSelectedUser] = useState({
    user_id: "",
    user_email: "",
    user_password: "",
    user_role: "",
    user_firstname: "",
    user_lastname: "",
    user_phone: "",
    user_address: "",
    user_authenticationkey: "",
  });

  useEffect(() => {
    getAllUsers().then((users) => {
      setUsers(users);
    });
  }, [selectedUserID, user]);

  useEffect(() => {
    if (selectedUserID) {
      getUserByID(selectedUserID, user.user_authenticationkey).then((user) => {
        setSelectedUser(user);
      });
    } else {
      setSelectedUser({
        user_id: "",
        user_email: "",
        user_password: "",
        user_role: "",
        user_firstname: "",
        user_lastname: "",
        user_phone: "",
        user_address: "",
        user_authenticationkey: "",
      });
    }
  }, [selectedUserID, user.user_authenticationkey]);

  // Create/Update function for the Save button
  function createOrUpdateSelectedUser() {
    if (selectedUserID) {
      updateUser(selectedUser)
        .then((updatedUser) => {
          setSelectedUserID(null);
          setSelectedUser({
            user_id: "",
            user_email: "",
            user_password: "",
            user_role: "",
            user_firstname: "",
            user_lastname: "",
            user_phone: "",
            user_address: "",
            user_authenticationkey: "",
          });
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    } else {
      console.log("Creating user...");
      createUser(selectedUser)
        .then((createdUser) => {
          console.log("createdUser", createdUser);
          setSelectedUserID(createdUser.user_id);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        });
    }
  }
  
  function deleteSelectedUser() {
    deleteUserByID(selectedUser.user_id).then((result) => {
      setSelectedUserID(null);
      setSelectedUser({
        user_id: "",
        user_email: "",
        user_password: "",
        user_role: "",
        user_firstname: "",
        user_lastname: "",
        user_phone: "",
        user_address: "",
        user_authenticationkey: "",
      });
    });
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap 2">
        {/* Users List */}
        <div className="overflow-x-auto pt-0 pl-0 sm:pt-11 sm:pl-4">
          {users && users.length < 0 ? (
            <Spinner />
          ) : (
            <table className="table table-compact w-full">
              <thead>
                <tr className="text-cyan-500">
                  <th className="w-1/5">User ID</th>
                  <th className="w-1/5">Role</th>
                  <th className="w-1/5">First Name</th>
                  <th className="w-1/5">Last Name</th>
                  <th className="w-1/4">Select</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user) => (
                    <tr key={user.user_id}>
                      <td>{user.user_id}</td>
                      <td>{user.user_role}</td>
                      <td>{user.user_firstname}</td>
                      <td>{user.user_lastname}</td>
                      <td>
                        <button
                          className="btn btn-outline btn-info btn-xs"
                          onClick={() => setSelectedUserID(user.user_id)}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Edit Form */}
        <div className="pl-10 grid grid-cols-1 md:grid-cols-2 text-lg">
          <div className="form-control mr-4">
            <label className="label" htmlFor="user_id">
              ID
            </label>
            <input
              type="text"
              readOnly
              className="input input-bordered input-info w-full max-w-xs"
              id="user_id"
              value={selectedUserID || ""}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="user_email">
              Email
            </label>
            <input
              type="text"
              className="input input-bordered input-info w-full max-w-xs"
              id="user_email"
              value={selectedUser.user_email}
              onChange={(e) => setSelectedUser({ ...selectedUser, user_email: e.target.value })}
            />
          </div>
          <div className="form-control mr-4">
            <label className="label" htmlFor="user_role">
              Role
            </label>
            <input
              type="text"
              className="input input-bordered input-info w-full max-w-xs"
              id="user_role"
              value={selectedUser.user_role}
              onChange={(e) => setSelectedUser({ ...selectedUser, user_role: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="user_firstname">
              First Name
            </label>
            <input
              type="text"
              className="input input-bordered input-info w-full max-w-xs"
              id="user_firstname"
              value={selectedUser.user_firstname}
              onChange={(e) => setSelectedUser({ ...selectedUser, user_firstname: e.target.value })}
            />
          </div>
          <div className="form-control mr-4">
            <label className="label" htmlFor="user_lastname">
              Last Name
            </label>
            <input
              type="text"
              className="input input-bordered input-info w-full max-w-xs"
              id="user_lastname"
              value={selectedUser.user_lastname}
              onChange={(e) => setSelectedUser({ ...selectedUser, user_lastname: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="user_phone">
              Phone
            </label>
            <input
              type="text"
              className="input input-bordered input-info w-full max-w-xs"
              id="user_phone"
              value={selectedUser.user_phone}
              onChange={(e) => setSelectedUser({ ...selectedUser, user_phone: e.target.value })}
            />
          </div>
          <div className="form-control mr-4">
            <label className="label" htmlFor="user_address">
              Address
            </label>
            <input
              type="text"
              className="input input-bordered input-info w-full max-w-xs mb-3"
              id="user_address"
              value={selectedUser.user_address}
              onChange={(e) => setSelectedUser({ ...selectedUser, user_address: e.target.value })}
            />
          </div>
          <div className="pt-2 flex gap-2 mt-0 md:mt-9">
            <button
              className="btn btn-outline btn-info"
              onClick={() => {
                setSelectedUserID(null);
                setSelectedUser({
                  user_id: "",
                  user_email: "",
                  user_password: "",
                  user_role: "",
                  user_firstname: "",
                  user_lastname: "",
                  user_phone: "",
                  user_address: "",
                  user_authenticationkey: "",
                });
              }}
            >
              Clear
            </button>
            <button
              className="btn btn-outline btn-info"
              onClick={() => createOrUpdateSelectedUser()}
            >
              Save
            </button>
            <button className="btn btn-outline btn-info" onClick={() => deleteSelectedUser()}>
              Delete
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
