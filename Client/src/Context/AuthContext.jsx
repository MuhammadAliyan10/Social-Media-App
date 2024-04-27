import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(token !== null);
  }, [isAuthenticated]);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
