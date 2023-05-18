import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication";
import { registerUser } from "../api/user";

export default function Register() {
  const navigate = useNavigate();

  const [user, login, logout] = useAuthentication();

  const [statusMessage, setStatusMessage] = useState("");

  const [formData, setFormData] = useState({
    user_email: "",
    user_password: "",
    user_firstname: "",
    user_lastname: "",
    user_phone: "",
    user_address: "",
  });

  function onRegisterSubmit(e) {
    e.preventDefault();
    setStatusMessage("Registering...");

    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/.test(formData.user_email)) {
      setStatusMessage("Invalid email address");
      return;
    }

    // TODO: Add validation for other fields

    // Register then attempt login
    registerUser(formData).then((result) => {
      setStatusMessage(result.message);
      login(formData.user_email, formData.user_password)
        .then((result) => {
          setStatusMessage(result.message);
          navigate("/dashboard");
        })
        .catch((error) => {
          setStatusMessage("Login failed: " + error);
        });
    });
  }

  return (
    <>
      <div className="flex justify-evenly items-center w-full">
        <form className="flex-grow m-4 max-w-lg" onSubmit={onRegisterSubmit}>
          <h2 className="text-2xl text-center uppercase font-bold mb-4 text-cyan-500">
            Register Account
          </h2>
          <div className="form-control">
            <label htmlFor="user_email" className="label">
              Email:
            </label>
            <input
              id="user_email"
              type="email"
              placeholder="Best contact email"
              className="input input-bordered input-info w-full"
              value={formData.user_email}
              onChange={(e) =>
                setFormData((existing) => {
                  return { ...existing, user_email: e.target.value };
                })
              }
            />
          </div>
          <div className="form-control">
            <label htmlFor="user_password" className="label">
              Password:
            </label>
            <input
              id="user_password"
              type="password"
              placeholder="Your password"
              className="input input-bordered input-info w-full"
              value={formData.user_password}
              onChange={(e) =>
                setFormData((existing) => {
                  return { ...existing, user_password: e.target.value };
                })
              }
            />
          </div>
          <div className="form-control">
            <label htmlFor="user_firstname" className="label">
              First Name:
            </label>
            <input
              id="user_firstname"
              type="text"
              placeholder="Your first name"
              className="input input-bordered input-info w-full"
              value={formData.user_firstname}
              onChange={(e) =>
                setFormData((existing) => {
                  return { ...existing, user_firstname: e.target.value };
                })
              }
            />
          </div>
          <div className="form-control">
            <label htmlFor="user_lastname" className="label">
              Last Name:
            </label>
            <input
              id="user_lastname"
              type="text"
              placeholder="Your last name"
              className="input input-bordered input-info w-full"
              value={formData.user_lastname}
              onChange={(e) =>
                setFormData((existing) => {
                  return { ...existing, user_lastname: e.target.value };
                })
              }
            />
          </div>
          <div className="form-control">
            <label htmlFor="user_phone" className="label">
              Phone:
            </label>
            <input
              id="user_phone"
              type="tel"
              placeholder="Best contact number"
              className="input input-bordered input-info w-full"
              value={formData.user_phone}
              onChange={(e) =>
                setFormData((existing) => {
                  return { ...existing, user_phone: e.target.value };
                })
              }
            />
          </div>
          <div className="form-control">
            <label htmlFor="user_address" className="label">
              Address:
            </label>
            <input
              id="user_address"
              type="text"
              placeholder="House number & street name"
              className="input input-bordered input-info w-full mb-2"
              value={formData.user_address}
              onChange={(e) =>
                setFormData((existing) => {
                  return { ...existing, user_address: e.target.value };
                })
              }
            />
          </div>
          <div className="my-2">
            <button className="btn btn-outline btn-info mr-2">Register</button>
            <button className="btn btn-outline btn-info" onClick={() => navigate("/")}>
              Back
            </button>
            <label className="label">{statusMessage}</label>
          </div>
        </form>
      </div>
    </>
  );
}
