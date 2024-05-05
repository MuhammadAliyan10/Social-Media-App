import React, { useEffect, useState } from "react";
import "../assets/Css/Post.css";
import userImage from "../assets/Images/user.jpeg";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [showBox, setShowBox] = useState(false);
  const [data, setData] = useState({ content: "", image: "" });
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
  }, []);

  const fetchPost = async () => {
    const api = `http://localhost:3000/post/userPosts/${user._id}`;
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
        return console.log(resData);
      }
      setPosts(resData);
      console.log(resData);
    } catch (error) {
      console.error(error);
    }
  };
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
  const handleContentChange = (e) => {
    setData({ ...data, content: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToDatabase64(file);
    setData({ ...data, image: base64 });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const api = `http://localhost:3000/post/`;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      console.log(data);

      const resData = await response.json();
      if (!response.ok) {
        return console.log(resData);
      }
      setShowBox(false);
      setData({ content: "", image: "" });
    } catch (error) {
      console.error(error);
    }
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
    <div className="posts">
      <div className="container">
        <h2>Posts</h2>
        <div className="add_post">
          <button className="button-36" onClick={() => setShowBox(true)}>
            Add a posts
          </button>
        </div>
        {showBox && (
          <div className="post__box">
            <h4 className="text-center my-3">New Post</h4>
            <form onSubmit={handlePost}>
              <textarea
                type="text"
                placeholder="Write something"
                value={data.content}
                onChange={handleContentChange}
              />
              <input
                type="file"
                name="image" // Set name attribute for file input
                onChange={handleImageChange}
              />
              <div className="submit__button">
                <button type="submit" className="button-36 ms-1" role="button">
                  Post
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
        <div className="recent__posts">
          <h3>Your recent posts</h3>
          <button className="button-36" onClick={fetchPost}>
            Fetch your recent Posts
          </button>
        </div>
        <div className="all__posts__box">
          <div className="posts__user">
            {posts?.length > 0 &&
              posts.map((p, index) => {
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
                      <a href="" className="user">
                        <div className="user__image">
                          {user?.profile?.avatar ? (
                            <img src={user?.profile?.avatar} alt="" />
                          ) : (
                            <img src={userImage} alt="" />
                          )}
                        </div>
                        <div className="user__info">
                          <h3>{user.username}</h3>
                          <p>{timeAgo}</p>
                        </div>
                      </a>
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
                    </div>
                    <hr />
                    <div className="posts">
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
                    {index < posts?.length - 1 && <div className="line"></div>}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
