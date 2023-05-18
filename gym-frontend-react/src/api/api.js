export const API_URL = "http://localhost:8080";

export function getAuthenticationKeyFromLocalStorage() {
  return localStorage.getItem("authenticationKey");
}
