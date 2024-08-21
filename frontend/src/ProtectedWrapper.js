import AuthContext from "./AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

function ProtectedWrapper({ children }) {
  const auth = useContext(AuthContext);
console.log("auth", auth);
  if (!auth.user || !auth.authToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedWrapper;
