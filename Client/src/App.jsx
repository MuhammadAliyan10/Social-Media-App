import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import NotAuthenticated from "./Pages/NotAuthenticated";
import NotFound from "./Pages/NotFound";
import "./App.css";
import Home from "./Pages/Home";
import Posts from "./Pages/Posts";
import { useUserContext } from "./Context/UserContext";
import Sidebar from "./Component/Sidebar";

function App() {
  const { isLogIn } = useUserContext();

  return (
    <BrowserRouter>
      {isLogIn ? <Sidebar /> : null}
      <Routes>
        {!isLogIn ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotAuthenticated />} />
          </>
        ) : (
          <>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
