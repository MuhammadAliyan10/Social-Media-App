import React, { useEffect, useState } from "react";
import "../assets/Css/Home.css";
import { Link } from "react-router-dom";
import userImg from "../assets/Images/user.jpeg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Home = () => {
  const [post, setPosts] = useState([]);
  const [fetchPost, setFetchPost] = useState(false);
  const [commentBox, setCommentBox] = useState({});
  const [postComments, setPostComments] = useState({});
  const [comment, setComment] = useState({ content: "" });
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
    return postCreator.user._id === user._id;
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
      if (!response.ok) {
        const errData = await response.json();
        return target(errData.message);
      }
      const resData = await response.json();
      toast(resData.message);
      setFetchPost(!fetchPost);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async (postId) => {
    const api = `http://localhost:3000/post/postComment/${postId}`;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(api, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const dataRes = await response.json();
        console.log(dataRes.message);
        return;
      }
      const dataRes = await response.json();
      setPostComments((prevComments) => ({
        ...prevComments,
        [postId]: dataRes.comments,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const handleComment = async (id, comment) => {
    const api = `http://localhost:3000/post/comment/${id}`;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(comment),
      });
      if (!response.ok) {
        const dataRes = await response.json();
        return console.log(dataRes.message);
      }
      fetchComments(id);
      setFetchPost(!fetchPost);
      setComment({ content: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCommentBox = (postId) => {
    setCommentBox((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const handleCommentDelete = async (postId, commentId) => {
    const api = `http://localhost:3000/post/deleteComment/${postId}/${commentId}`;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(api, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errData = await response.json();
        return toast(errData.message);
      }
      const resData = await response.json();
      fetchComments(postId);
      toast(resData.message);
      setFetchPost(!fetchPost);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home">
      <ToastContainer />
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
                      <li className="comment__icon">
                        {p?.comments.length > 0 && (
                          <div className="comment__len">
                            <span>{p?.comments.length}</span>
                          </div>
                        )}
                        <a
                          onClick={() => {
                            fetchComments(p._id);
                            toggleCommentBox(p._id);
                          }}
                        >
                          <i className="fa-regular fa-comment"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  {commentBox[p._id] && (
                    <div className="comment__box">
                      {postComments[p._id] ? (
                        postComments[p._id].map((comment) => {
                          return (
                            <div className="comment" key={comment._id}>
                              <div className="single__comment">
                                <div className="comment__admin__img">
                                  <Link
                                    to={`/singleUserProfile/${comment?.user?._id}`}
                                  >
                                    <img src={comment?.user?.avatar} alt="" />
                                  </Link>{" "}
                                </div>
                                <div className="comment__info">
                                  <Link
                                    to={`/singleUserProfile/${comment?.user?._id}`}
                                  >
                                    <h5>{comment?.user?.username}</h5>
                                  </Link>
                                  <p>{comment?.content}</p>
                                </div>
                                {comment?.user?._id === user._id && (
                                  <div className="remove__comment">
                                    <i
                                      onClick={() =>
                                        handleCommentDelete(p?._id, comment._id)
                                      }
                                      className="fa-solid fa-trash"
                                    ></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center my-4">
                          No comment, You are the first one to comment.
                        </p>
                      )}
                      <input
                        type="text"
                        name="content"
                        autoComplete="off"
                        value={comment[p._id]?.content || ""}
                        onChange={(e) =>
                          setComment({
                            ...comment,
                            [p._id]: {
                              ...comment[p._id],
                              [e.target.name]: e.target.value,
                            },
                          })
                        }
                      />
                      <div className="comment__btn">
                        <button
                          onClick={() =>
                            handleComment(p._id, comment[p._id] || {})
                          }
                        >
                          Submit
                        </button>
                        <button
                          onClick={() =>
                            setCommentBox({ ...commentBox, [p._id]: false })
                          }
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
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
