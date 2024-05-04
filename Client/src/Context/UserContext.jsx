import { createContext, useContext, useEffect, useState } from "react";

const userContext = createContext();

export const useUserContext = () => {
  return useContext(userContext);
};

export const UserProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUserInfo = async () => {
      const api = "http://localhost:3000/user/userInfo";
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(api, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resData = await response.json();
        setUser(resData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInfo();
  }, []);
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
  const value = { isLogIn, setIsLogIn, isAdmin, setIsAdmin, user };
  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
