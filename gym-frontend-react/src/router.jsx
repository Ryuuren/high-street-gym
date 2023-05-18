import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ActivityCRUD from "./pages/ActivityCRUD";
import BlogCRUD from "./pages/BlogCRUD";
import BookingCRUD from "./pages/BookingCRUD";
import RoomCRUD from "./pages/RoomCRUD";
import SessionCRUD from "./pages/SessionCRUD";
import UserCRUD from "./pages/UserCRUD";
import About from "./pages/About";
import MyBlogs from "./pages/MyBlogs";
import Blogs from "./pages/Blogs";
import BlogInfo from "./pages/BlogInfo";
import Sessions from "./pages/Sessions";
import { RestrictedRoute } from "./components/RestrictedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <RestrictedRoute allowedRoles={["Admin", "Trainer", "Member"]}>
        <Dashboard />
      </RestrictedRoute>
    ),
  },
  {
    path: "/my-blogs",
    element: (
      <RestrictedRoute allowedRoles={["Admin", "Trainer", "Member"]}>
        <MyBlogs />
      </RestrictedRoute>
    ),
  },
  {
    path: "/blogs",
    element: (
      <RestrictedRoute allowedRoles={["Admin", "Trainer", "Member"]}>
        <Blogs />
      </RestrictedRoute>
    ),
  },
  {
    path: "/blogs/:blogID",
    element: (
      <RestrictedRoute allowedRoles={["Admin", "Trainer", "Member"]}>
        <BlogInfo />
      </RestrictedRoute>
    ),
  },
  {
    path: "/sessions",
    element: (
      <RestrictedRoute allowedRoles={["Admin", "Trainer", "Member"]}>
        <Sessions />
      </RestrictedRoute>
    ),
  },
  {
    path: "/admin-activities",
    element: (
      <RestrictedRoute allowedRoles={["Admin", "Trainer"]}>
        <ActivityCRUD />
      </RestrictedRoute>
    ),
  },
  {
    path: "/admin-blogs",
    element: (
      <RestrictedRoute allowedRoles={["Admin"]}>
        <BlogCRUD />
      </RestrictedRoute>
    ),
  },
  {
    path: "/admin-bookings",
    element: (
      <RestrictedRoute allowedRoles={["Admin"]}>
        <BookingCRUD />
      </RestrictedRoute>
    ),
  },
  {
    path: "/admin-rooms",
    element: (
      <RestrictedRoute allowedRoles={["Admin", "Trainer"]}>
        <RoomCRUD />
      </RestrictedRoute>
    ),
  },
  {
    path: "/admin-sessions",
    element: (
      <RestrictedRoute allowedRoles={["Admin", "Trainer"]}>
        <SessionCRUD />
      </RestrictedRoute>
    ),
  },
  {
    path: "/admin-users",
    element: (
      <RestrictedRoute allowedRoles={["Admin"]}>
        <UserCRUD />
      </RestrictedRoute>
    ),
  },
  {
    path: "/about-us",
    element: (
      <RestrictedRoute allowedRoles={["Admin", "Trainer", "Member"]}>
        <About />
      </RestrictedRoute>
    ),
  },
]);

export default router;
