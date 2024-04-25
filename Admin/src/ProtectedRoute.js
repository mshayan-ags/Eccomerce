import { Navigate } from "react-router-dom";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";

// Decodes a JWT's payload without verifying its signature - this only
// exists to check the `exp` claim client-side, so a stale/expired token
// doesn't unlock the admin UI just because a string is present in
// localStorage. The backend is still the real authority on every request.
function isTokenValid(token) {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload?.exp) return true;
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
}

const routes = (token) => {
  const isLoggedIn = isTokenValid(token);

  return [
    {
      path: "auth/*",
      element: !isLoggedIn ? <AuthLayout /> : <Navigate to="/admin/default" />,
    },
    {
      path: "admin/*",
      element: isLoggedIn ? <AdminLayout /> : <Navigate to="/auth/sign-in" />,
    },
    {
      path: "*",
      element: isLoggedIn ? <AdminLayout /> : <Navigate to="/auth/sign-in" />,
    },
  ];
};

export default routes;
