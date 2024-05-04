import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userImg from "../assets/Images/user.jpeg";
import coverImage from "../assets/Images/cover.jpeg";

const SingleUserProfile = () => {
  const params = useParams();
  const [userData, setUserData] = useState({});
  const [user, setUser] = useState({});
  const [updateData, setUpdateData] = useState(false);
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
  }, [updateData]);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const api = `http://localhost:3000/user/searchedUserInfo/${params.id}`;
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(api, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resData = await response.json();
        setUserData(resData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInfo();
  }, [updateData]);
  const handleFollowUser = async (id) => {
    const api = `http://localhost:3000/user/follow/${id}`;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await response.json();
      if (!response.ok) {
        return console.log(resData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateData(!updateData);
    }
  };
  const handleUnFollowUser = async (id) => {
    const api = `http://localhost:3000/user/unfollow/${id}`;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await response.json();
      if (!response.ok) {
        return console.log(resData);
      }
      console.log(resData);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateData(!updateData);
    }
  };

  return (
    <div className="profile">
      <div className="container">
        <div className="row m-b-r m-t-3">
          <div className="col-sm-12">
            <div className="coverImage">
              {userData?.profile?.coverImage ? (
                ""
              ) : (
                <img src={coverImage} alt="" />
              )}
            </div>
          </div>
          <div className="col-md-2">
            {userData.profile?.avatar ? (
              " "
            ) : (
              <img src={userImg} alt="" className="img-circle img-fluid" />
            )}
          </div>
          <div className="col-md-8 p-t-2">
            <h2 className="h2-responsive">
              {userData.username}
              {userData._id === user._id ? (
                ""
              ) : (
                <>
                  {userData?.followers?.includes(user._id) ? (
                    <button
                      className="button-36 ms-5"
                      role="button"
                      onClick={() => handleUnFollowUser(userData._id)}
                    >
                      UnFollow
                    </button>
                  ) : (
                    <button
                      className="button-36 ms-5"
                      role="button"
                      onClick={() => handleFollowUser(userData._id)}
                    >
                      Follow
                    </button>
                  )}
                </>
              )}
            </h2>
            <p>{userData?.profile?.fullName}</p>
            <p>{userData?.profile?.bio}</p>

            <ul className="flex-menu">
              <li>
                <strong>{userData?.posts?.length}</strong> posts
              </li>
              <li>
                <strong>{userData?.followers?.length}</strong> followers
              </li>
              <li>
                <strong>{userData?.following?.length}</strong> following
              </li>
            </ul>
          </div>
          {userData._id == user._id && (
            <div className="col-sm-1">
              <button className="button-36 ms-5" role="button">
                Edit
              </button>
            </div>
          )}
        </div>
        <div className="additional__info"></div>
      </div>
    </div>
  );
};

export default SingleUserProfile;
