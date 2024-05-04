import React, { useState } from "react";
import "../assets/Css/FindUser.css";
import userImg from "../assets/Images/user.jpeg";
import { Link } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";

const FindUser = () => {
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUserContext();

  async function searchUser(username) {
    setUserName(username);
    setLoading(true);
    setError(null);

    const api = `http://localhost:3000/user/findUser/${username}`;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(api, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const resData = await response.json();
      setUsers(resData);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="find__user">
      <div className="container">
        <h3>Find Friends</h3>
        <div className="search__box">
          <input
            type="text"
            placeholder="Enter username"
            value={userName}
            onChange={(e) => searchUser(e.target.value)}
          />
          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <ul>
                {users.map((u) => {
                  return (
                    <li className="user__search__info" key={u._id}>
                      {u.profile.avatar ? (
                        <img src={u.profile.avatar} />
                      ) : (
                        <img src={userImg} />
                      )}
                      <div className="user__additional__info">
                        <h4>
                          <Link to={`/singleUserProfile/${u._id}`}>
                            {u.username}
                          </Link>
                        </h4>
                        <p>{u.profile.fullName}</p>
                      </div>
                      <div className="isYou">
                        {u._id === user._id && <p className="isYou">You</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default FindUser;
