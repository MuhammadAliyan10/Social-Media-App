import { createContext, useContext, useEffect, useState } from "react";

const userContext = createContext();

export const useUserContext = () => {
  return useContext(userContext);
};

export const UserProvider = ({ children }) => {
  const [isLogIn, setIsLogIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogIn(true);
      setTimeout(() => {
        localStorage.removeItem("token");
      }, 24 * 60 * 60 * 1000);
    }
  }, [isLogIn]);
  const value = { isLogIn, setIsLogIn };
  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
