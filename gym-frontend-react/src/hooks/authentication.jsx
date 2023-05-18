import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, logout as apiLogout, getByAuthenticationKey } from "../api/user";

export const AuthenticationContext = createContext(null);

export function AuthenticationProvider({ router, children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // Handle case where the user is logged in and the page
  // is reloaded. Check localStorage to see if the authenticationKey
  // has been saved there, then attempt to load user by authenticationKey
  // to resume client side session. Redirect to root page if failed.
  useEffect(() => {
    if (authenticatedUser == null) {
      const authenticationKey = localStorage.getItem("authenticationKey");
      if (authenticationKey) {
        getByAuthenticationKey(authenticationKey)
          .then((user) => {
            setAuthenticatedUser(user);
          })
          .catch((error) => {
            router.navigate("/");
          });
      } else {
        router.navigate("/");
      }
    }
  }, []);

  return (
    <AuthenticationContext.Provider value={[authenticatedUser, setAuthenticatedUser]}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthentication() {
  const navigate = useNavigate();

  const [authenticatedUser, setAuthenticatedUser] = useContext(AuthenticationContext);

  async function login(email, password) {
    // Clear existing client side user state
    setAuthenticatedUser(null);
    // Attempt to login; retrieve user if successful
    return apiLogin(email, password)
      .then((result) => {
        if (result.status == 200) {
          // Stores the authenticationKey in localStorage, so
          // if the page is reloaded it resumes the session
          localStorage.setItem("authenticationKey", result.authenticationKey);
          // After logging in, get the user's details from the backend
          return getByAuthenticationKey(result.authenticationKey)
            .then((user) => {
              setAuthenticatedUser(user);
              return Promise.resolve(result.message);
            })
            .catch((error) => {
              return Promise.reject("Failed to load user");
            });
        } else {
          // Failed login returns the resulting error message from the backend
          return Promise.reject(result.message);
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  async function logout() {
    // Clears the localStorage of any cached authenticationKey
    localStorage.removeItem("authenticationKey");
    // Checks if an authenticated User exists
    if (authenticatedUser) {
      return apiLogout(authenticatedUser.authenticationKey).then((result) => {
        // Forgets the user and navigates to the home page
        setAuthenticatedUser(null);
        navigate("/");
        return Promise.resolve(result.message);
      });
    }
  }

  return [authenticatedUser, login, logout];
}
