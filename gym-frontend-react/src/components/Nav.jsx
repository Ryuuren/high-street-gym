import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication";

export default function Nav() {
  const navigate = useNavigate();

  const [user, login, logout] = useAuthentication();

  // Logout navigates users back to the home/login page
  function onLogoutClick(e) {
    logout();
    navigate("/");
  }

  return (
    <div className="flex flex-col items-center md:flex-row md:items-baseline bg-base-200 text-cyan-500 mb-16">
      <a href="#" className="btn btn-ghost normal-case text-xl m-2">
        High Street Gym
      </a>
      <div className="navbar flex md:justify-start flex-col md:flex-row w-full md:w-auto">
        {user && (user.user_role === "Admin" || user.user_role === "Trainer") && (
          <div class="dropdown">
            <button tabindex="0" class="btn btn-ghost">
              Manage
            </button>
            <ul
              tabindex="0"
              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-cyan-500 transform translate-y-4"
            >
              {user && user.user_role === "Admin" && (
                <>
                  <li>
                    <Link to="/admin-activities">Activities</Link>
                  </li>
                  <li>
                    <Link to="/admin-blogs">Blogs</Link>
                  </li>
                  <li>
                    <Link to="/admin-bookings">Bookings</Link>
                  </li>
                  <li>
                    <Link to="/admin-rooms">Rooms</Link>
                  </li>
                  <li>
                    <Link to="/admin-sessions">Sessions</Link>
                  </li>
                  <li>
                    <Link to="/admin-users">Users</Link>
                  </li>
                </>
              )}
              {user && user.user_role === "Trainer" && (
                <>
                  <li>
                    <Link to="/admin-activities">Activities</Link>
                  </li>
                  <li>
                    <Link to="/admin-rooms">Rooms</Link>
                  </li>
                  <li>
                    <Link to="/admin-sessions">Sessions</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
        {!user && (
          <ul className="menu md:menu-horizontal px-1 w-full">
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        )}
        {user && (
          <>
            {/* Members Pages */}
            <div className="flex flex-col md:flex-row">
              <div class="dropdown">
                <button tabindex="0" class="btn btn-ghost">
                  Members
                </button>
                <ul
                  tabindex="0"
                  class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-cyan-500 transform translate-y-4"
                >
                  <li>
                    <Link to="/blogs">Blogs</Link>
                    <Link to="/sessions">Sessions</Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* Account */}
            <div className="flex flex-col md:flex-row">
              <div class="dropdown">
                <button tabindex="0" class="btn btn-ghost">
                  Account
                </button>
                <ul
                  tabindex="0"
                  class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-cyan-500 transform translate-y-4"
                >
                  <li>
                    <Link to="/my-blogs">My Blogs</Link>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <a onClick={onLogoutClick}>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
