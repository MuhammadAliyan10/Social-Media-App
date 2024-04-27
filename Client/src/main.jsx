import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot from "react-dom/client"
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./Context/AuthContext.jsx";

const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
