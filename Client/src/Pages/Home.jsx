import React, { useEffect, useState } from "react";
import "../assets/Css/Home.css";
import { Link } from "react-router-dom";
import userImg from "../assets/Images/user.jpeg";
const Home = () => {
  const [post, setPosts] = useState([]);
  const [fetchPost, setFetchPost] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
  useEffect(() => {
    const fetchAllPost = async () => {
      const api = "http://localhost:3000/post/posts";
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(api, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resData = await response.json();
        setPosts(resData.post);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllPost();
  }, [fetchPost]);
  const isAdminForPost = (postId) => {
    const postCreator = post.find((p) => p._id === postId);
    return postCreator === user._id;
  };

  const handleLikePost = async (postId) => {
    const api = `http://localhost:3000/review/${postId}/like`;
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
        console.log(resData);
      }
      setFetchPost(!fetchPost);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislikePost = async (postId) => {
    const api = `http://localhost:3000/review/${postId}/dislike`;
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
        console.log(resData);
      }
      setFetchPost(!fetchPost);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async (postId) => {
    const api = `http://localhost:3000/post/deletePost/${postId}`;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(api, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await response.json();
      if (!response.ok) {
        console.log(resData);
      }
      setFetchPost(!fetchPost);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home">
      <div className="container">
        <h2>Home</h2>
        <div className="all__posts__box">
          {post?.length > 0 ? (
            post.map((p, index) => {
              function getTimeAgo(timestamp) {
                const currentDate = new Date();
                const providedDate = new Date(timestamp);

                const timeDifference =
                  currentDate.getTime() - providedDate.getTime();
                const secondsDifference = Math.floor(timeDifference / 1000);
                const minutesDifference = Math.floor(secondsDifference / 60);
                const hoursDifference = Math.floor(minutesDifference / 60);
                const daysDifference = Math.floor(hoursDifference / 24);

                if (daysDifference > 0) {
                  return daysDifference === 1
                    ? "1 day ago"
                    : `${daysDifference} days ago`;
                } else if (hoursDifference > 0) {
                  return hoursDifference === 1
                    ? "1 hour ago"
                    : `${hoursDifference} hours ago`;
                } else if (minutesDifference > 0) {
                  return minutesDifference === 1
                    ? "1 minute ago"
                    : `${minutesDifference} minutes ago`;
                } else {
                  return "Just now";
                }
              }

              const timestamp = new Date(p.createdAt).getTime();
              const timeAgo = getTimeAgo(timestamp);

              return (
                <div className="single__post__box" key={p._id}>
                  <div className="top__info">
                    <div className="user">
                      <Link
                        to={`/singleUserProfile/${p["user"]._id}`}
                        className="user__image"
                      >
                        <img src={userImg} alt="" />
                      </Link>
                      <div className="user__info">
                        <Link to={`/singleUserProfile/${p["user"]._id}`}>
                          <h3>{p["user"]?.username}</h3>
                        </Link>
                        <p>{timeAgo}</p>
                      </div>
                    </div>
                    {isAdminForPost(p._id) && (
                      <div className="edit__post">
                        <div className="dropdown">
                          <button
                            className="dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="fa-regular fa-pen-to-square"></i>
                                <p>Edit</p>
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                onClick={() => handleDeletePost(p._id)}
                              >
                                <i className="fa-solid fa-trash"></i>
                                <p>Delete</p>
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="fa-solid fa-circle-info"></i>
                                <p>Info</p>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  <hr />
                  <div className="post">
                    <p>{p?.content}</p>
                    {p?.image && (
                      <img src={p?.image} alt="" className="post__image" />
                    )}
                  </div>

                  {p?.likes?.length > 0 ? (
                    <span className="m-0">{p?.likes?.length} Like</span>
                  ) : (
                    ""
                  )}

                  <hr />
                  <div className="reviews">
                    <ul>
                      <li>
                        {!p.likes.includes(user._id) ? (
                          <a onClick={() => handleLikePost(p._id)}>
                            <i className="fa-regular fa-thumbs-up"></i>
                          </a>
                        ) : (
                          <a onClick={() => handleDislikePost(p._id)}>
                            <i className="fa-solid fa-thumbs-up"></i>
                          </a>
                        )}
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-regular fa-comment"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  {index < post?.length - 1 && <div className="line"></div>}
                </div>
              );
            })
          ) : (
            <p>No post here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
