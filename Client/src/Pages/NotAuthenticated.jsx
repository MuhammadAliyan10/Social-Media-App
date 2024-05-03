import React from "react";
import { Link } from "react-router-dom";

const NotAuthenticated = () => {
  return (
    <div className="auth">
      <div className="not__auth">
        <h2>401</h2>
        <p>Login to get access to these pages.</p>
        <Link to={"/login"}>Login</Link>
      </div>
    </div>
  );
};

export default NotAuthenticated;
