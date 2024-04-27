import React, { useState } from "react";
import "../assets/Css/Auth.css";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import Login from "./Login";

const Register = () => {
  const [hide, setHide] = useState(false);
  const [message, setMessage] = useState("");
  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) || "Invalid email";
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const api = "http://localhost:5000/user/register";
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      setMessage(responseData.message);
      if (responseData.status == "200") {
        reset();
        return <Navigate to="/login" />;
      }
    } catch (error) {
      console.log(error);
    } finally {
      const toastTrigger = document.getElementById("submit");
      const toastLiveExample = document.getElementById("liveToast");
      if (toastTrigger) {
        const toastBootstrap =
          bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastTrigger.addEventListener("click", () => {
          toastBootstrap.show();
        });
      }
    }
  };
  return (
    <>
      <div className="center-container">
        <div className="box">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("username", {
                required: {
                  value: true,
                  message: "Please enter your userName.",
                },
                minLength: {
                  value: 6,
                  message: "Username must be at least of 6 characters.",
                },
                maxLength: {
                  value: 20,
                  message: "Username must be at least 20 characters.",
                },
              })}
              className="auth__box"
              autoComplete="off"
              placeholder="Enter your Username"
            />
            {errors.username && (
              <div className="errors">
                <span>{errors.username.message}</span>
              </div>
            )}

            <input
              {...register("fullName", {
                required: {
                  value: true,
                  message: "Please enter your full name.",
                },
                minLength: {
                  value: 6,
                  message: "Name must be at least of 6 characters.",
                },
                maxLength: {
                  value: 20,
                  message: "Name must be at least 20 characters.",
                },
              })}
              className="auth__box"
              autoComplete="off"
              placeholder="Enter your fullName"
            />
            {errors.fullName && (
              <div className="errors">
                <span>{errors.fullName.message}</span>
              </div>
            )}

            <input
              {...register("email", {
                validate: validateEmail,
                required: { value: true, message: "Enter your email." },
              })}
              className="auth__box"
              autoComplete="off"
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="errors">
                <span>{errors.email.message}</span>
              </div>
            )}

            <input
              {...register("password", {
                required: {
                  value: true,
                  message: "Please enter a strong password.",
                },
                minLength: {
                  value: 8,
                  message: "Password must be at least of 8 characters.",
                },
                maxLength: {
                  value: 15,
                  message: "Password must be at most of 15 characters.",
                },
              })}
              type={!hide ? "password" : "text"}
              className="auth__box"
              autoComplete="off"
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="errors">
                <span>{errors.password.message}</span>
              </div>
            )}
            <button type="submit" disabled={isSubmitting} id="submit">
              Submit
            </button>
          </form>
          <p className="text-center">
            Already have an account.<Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          id="liveToast"
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <i className="fa-solid fa-circle"></i>
            <h4 className="me-auto">Success</h4>
            <p>Just Now</p>
          </div>
          <div className="toast-body">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
