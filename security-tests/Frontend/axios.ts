// lib/axios.ts
import axios from "axios";

export const api = axios.create();

// Topic: 3. Token Expiration
// Test Cases: TC-SEC-007
// Purpose: To globally intercept 401 Unauthorized responses, clear the expired token, and redirect the user to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login?reason=session_expired";
    }
    return Promise.reject(error);
  }
);