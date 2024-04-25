import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { withAuthContext } from "context/Auth";
import protectedRoutes from "ProtectedRoute";

const App = ({ Token, CheckToken }) => {
  useEffect(() => {
    CheckToken();
  }, []);

  const routing = useRoutes(protectedRoutes(Token));

  return <>{routing}</>;
};

export default withAuthContext(App);
