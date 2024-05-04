import React from "react";
import "../assets/Css/Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      <div className="Sidebar">
        <div className="page-wrapper chiller-theme toggled">
          <a id="show-sidebar" className="btn btn-sm btn-dark" href="#">
            <i className="fas fa-bars"></i>
          </a>
          <nav id="sidebar" className="sidebar-wrapper">
            <div className="sidebar-content">
              <div className="sidebar-brand">
                <a href="#">DeBugger</a>
                <div id="close-sidebar">
                  <i className="fas fa-times"></i>
                </div>
              </div>
              {/* <div className="sidebar-header">
                <div className="user-pic">
                  <img
                    className="img-responsive img-rounded"
                    src="https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg"
                    alt="User picture"
                  />
                </div>
                <div className="user-info">
                  <span className="user-name">
                    Jhon
                    <strong>Smith</strong>
                  </span>
                  <span className="user-role">Administrator</span>
                  <span className="user-status">
                    <i className="fa fa-circle"></i>
                    <span>Online</span>
                  </span>
                </div>
              </div> */}

              <div className="sidebar-menu">
                <ul>
                  <li className="header-menu">
                    <span>General</span>
                  </li>
                  <li className="sidebar-dropdown">
                    <Link to="/">
                      <i className="fa-solid fa-house"></i>
                      <span>Home</span>
                      <span className="badge badge-pill badge-warning">
                        New
                      </span>
                    </Link>
                  </li>
                  <li className="sidebar-dropdown">
                    <Link to="/posts">
                      <i className="fa-solid fa-signs-post"></i>
                      <span>Posts</span>
                      <span className="badge badge-pill badge-danger">3</span>
                    </Link>
                  </li>
                  <li className="sidebar-dropdown">
                    <Link to="/findUsers">
                      <i className="fa-solid fa-magnifying-glass"></i>
                      <span>Find Friends</span>
                      <span className="badge badge-pill badge-danger">3</span>
                    </Link>
                  </li>
                  <li className="sidebar-dropdown">
                    <Link to="/profile">
                      <i className="fa-regular fa-user"></i>
                      <span>Profile</span>
                      <span className="badge badge-pill badge-danger">3</span>
                    </Link>
                  </li>

                  <li className="header-menu">
                    <span>Extra</span>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa-solid fa-address-card"></i>
                      <span>About</span>
                      <span className="badge badge-pill badge-primary">
                        Beta
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa-solid fa-address-book"></i>
                      <span>Contact</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa-solid fa-circle-info"></i>
                      <span>Help</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="sidebar-footer">
              <a href="#">
                <i className="fa fa-bell"></i>
                <span className="badge badge-pill badge-warning notification">
                  3
                </span>
              </a>
              <a href="#">
                <i className="fa fa-envelope"></i>
                <span className="badge badge-pill badge-success notification">
                  7
                </span>
              </a>
              <a href="#">
                <i className="fa fa-power-off"></i>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
