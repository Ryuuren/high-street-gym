import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication";
import Nav from "../components/Nav";

export function RestrictedRoute({ allowedRoles = [], children }) {
  const [user, login, logout] = useAuthentication();
  const navigate = useNavigate();

  const userIsAuthorised = user && allowedRoles.includes(user.user_role);

  return userIsAuthorised ? (
    children
  ) : (
    <>
      <Nav />
      <div className="flex flex-col justify-center items-center gap-4">
        <h2 className="text-3xl text-cyan-500 uppercase font-semibold">Unauthorised Access</h2>
        <span className="text-xl">
          You do not have the correct access permissions to view this page.
        </span>
        <button className="btn btn-info" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </>
  );
}
