import React, { useEffect, useState } from "react";
import "../assets/Css/Profile.css";
import userImg from "../assets/Images/user.jpeg";
import coverImage from "../assets/Images/cover.jpeg";
import { useForm } from "react-hook-form";

const Profile = () => {
  const [user, setUser] = useState([]);
  const [dataUpdated, setIsDataUpdated] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
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
  }, [dataUpdated]);

  const convertToDatabase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = () => {
        reject(fileReader.error);
      };
    });
  };

  const onSubmit = async (data) => {
    try {
      if (!data) {
        return console.log("No new data");
      }
      if (data.avatar.length > 0) {
        data.avatar = await convertToDatabase64(data.avatar[0]);
      }
      if (data.coverImage.length > 0) {
        data.coverImage = await convertToDatabase64(data.coverImage[0]);
      }
      const api = "http://localhost:3000/user/userUpdate";
      const token = localStorage.getItem("token");
      const response = await fetch(api, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }
      const resData = await response.json();
      console.log(resData);
      reset();
      setIsDataUpdated(!dataUpdated);
      setShowBox(false);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) || "Invalid email";
  };

  return (
    <div className="profile">
      <div className="container">
        {showBox && (
          <div className="edit__box">
            <h4 className="my-4 text-center">Edit Profile</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                {...register("username", {
                  maxLength: {
                    value: 20,
                    message: "Username must be less of 20 characters.",
                  },
                  minLength: {
                    value: 6,
                    message: "Username must be more of 6 characters.",
                  },
                })}
                placeholder={user.username}
                autoComplete="off"
              />
              {errors.username && (
                <div className="errors">
                  <p>{errors.username.message}</p>
                </div>
              )}
              <input
                type="text"
                {...register("fullName", {
                  maxLength: {
                    value: 20,
                    message: "FullName must be less of 20 characters.",
                  },
                  minLength: {
                    value: 6,
                    message: "FullName must be more of 6 characters.",
                  },
                })}
                placeholder={user.profile.fullName}
                autoComplete="off"
              />
              {errors.fullName && (
                <div className="errors">
                  <p>{errors.fullName.message}</p>
                </div>
              )}
              <input
                {...register("email")}
                placeholder={user.email}
                autoComplete="off"
              />
              {errors.email && (
                <div className="errors">
                  <p>{errors.email.message}</p>
                </div>
              )}
              <textarea
                {...register("bio", {
                  minLength: {
                    value: 10,
                    message: "Bio must be more than 10 characters.",
                  },
                  maxLength: {
                    value: 40,
                    message: "Bio must be less than 40 characters.",
                  },
                })}
                placeholder={user.profile.bio}
                autoComplete="off"
              />
              {errors.bio && (
                <div className="errors">
                  <p>{errors.bio.message}</p>
                </div>
              )}
              <label htmlFor="image">Select your profile Avatar</label>
              <input
                type="file"
                {...register("avatar")}
                accept="image/jpeg, image/jpg, image/png"
              />
              <label htmlFor="image">Select your profile coverImage</label>
              <input
                type="file"
                {...register("coverImage")}
                accept="image/jpeg, image/jpg, image/png"
              />
              <div className="submit__button">
                <button
                  className="button-36 ms-1"
                  role="button"
                  disabled={isSubmitting}
                >
                  Change
                </button>
                <button
                  className="button-36 ms-1"
                  role="button"
                  onClick={() => setShowBox(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="row m-b-r m-t-3">
          <div className="col-sm-12">
            <div
              className="coverImage"
              style={{
                backgroundImage: `url(${
                  user.profile?.coverImage
                    ? user.profile.coverImage
                    : coverImage
                })`,
              }}
            ></div>
          </div>
          <div className="col-md-2">
            {user.profile?.avatar ? (
              <img src={user.profile?.avatar} alt="" className="img-circle" />
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
            <button
              className="button-36 ms-5"
              role="button"
              onClick={() => setShowBox(true)}
            >
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
