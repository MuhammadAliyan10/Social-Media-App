import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import { useAuthContext } from "./Context/AuthContext";
import Sidebar from "./Components/Sidebar";

const App = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <BrowserRouter>
      {isAuthenticated ? <Sidebar /> : null}
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
