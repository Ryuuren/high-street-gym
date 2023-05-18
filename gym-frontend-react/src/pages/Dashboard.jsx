import { useState } from "react";
import { useAuthentication } from "../hooks/authentication";
import { useNavigate } from "react-router-dom";
import UserBookings from "../components/UserBookings";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [user] = useAuthentication();

  const navigate = useNavigate();

  const [refreshTrigger, setRefreshTrigger] = useState();
  return (
    <>
      <Nav />
      {user ? (
        <div className="container p-2 mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="md:col-span-2 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="overflow-x-auto pr-10">
                <UserBookings userID={user.user_id} refreshDependency={refreshTrigger} />
              </div>
              <div className="flex flex-col align-middle justify-center">
                <div className="card w-80 bg-base-200 text-cyan-500 border-2 border-cyan-500 shadow-2xl ml-6 mt-4 sm:ml-40">
                  <div className="card-body items-center text-center">
                    <h2 className="card-title uppercase font-bold">
                      Welcome back, {user.user_firstname}!
                    </h2>
                    <p className="font-semibold">Your member ID is: {user.user_id}</p>
                    <div className="card-actions flex gap-4 mt-4">
                      <button
                        className="btn btn-info"
                        onClick={() => {
                          navigate("/blogs");
                        }}
                      >
                        Blogs
                      </button>
                      <button
                        className="btn btn-info"
                        onClick={() => {
                          navigate("/sessions");
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
      <Footer />
    </>
  );
}
