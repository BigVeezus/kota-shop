import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        const expiration = decodedToken.exp * 1000;

        if (new Date().getTime() > expiration) {
          handleLogout();
        } else {
          setUser((prevUser) => prevUser || decodedToken);
          setTimeout(handleLogout, expiration - new Date().getTime());
        }
      } catch (error) {
        handleLogout();
      }
    } else {
      handleLogout();
    }
  }, [authToken]);

  const signin = (token, userData, callback) => {
    const decodedToken = jwtDecode(token);
    const expiration = decodedToken.exp * 1000;
  
    const userWithDetails = {
      ...decodedToken,
      ...userData,
    };
  
    setAuthToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userWithDetails));
    setUser(userWithDetails);
    setTimeout(handleLogout, expiration - new Date().getTime());
    callback();
  };
  
  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ authToken, user, signin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
