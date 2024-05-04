import React, { useEffect, useState } from "react";
import "../assets/Css/Profile.css";
import userImg from "../assets/Images/user.jpeg";
import coverImage from "../assets/Images/cover.jpeg";
import { useUserContext } from "../Context/UserContext";

const Profile = () => {
  const [user, setUser] = useState([]);
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
        if (!response.ok) {
          return console.log(resData.message);
        }
        setUser(resData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <div className="profile">
      <div className="container">
        <div className="row m-b-r m-t-3">
          <div className="col-sm-12">
            <div className="coverImage">
              {user.profile?.coverImage ? "" : <img src={coverImage} alt="" />}
            </div>
          </div>
          <div className="col-md-2">
            {user.profile?.avatar ? (
              " "
            ) : (
              <img src={userImg} alt="" className="img-circle img-fluid" />
            )}
          </div>
          <div className="col-md-8 p-t-2">
            <h2 className="h2-responsive">{user?.username}</h2>
            <p>{user?.profile?.fullName}</p>
            <p>{user?.profile?.bio}</p>

            <ul className="flex-menu">
              <li>
                <strong>{user?.posts?.length}</strong> posts
              </li>
              <li>
                <strong>{user?.followers?.length}</strong> followers
              </li>
              <li>
                <strong>{user?.following?.length}</strong> following
              </li>
            </ul>
          </div>
          <div className="col-sm-1">
            <button className="button-36 ms-5" role="button">
              Edit
            </button>
          </div>
        </div>
        <div className="additional__info"></div>
      </div>
    </div>
  );
};

export default Profile;
