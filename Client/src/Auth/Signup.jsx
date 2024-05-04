import React from "react";
import "../assets/Css/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    const api = "http://localhost:3000/user/register";
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (!response.ok) {
        return console.log(resData);
      }
      reset();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) || "Invalid email";
  };
  return (
    <div className="auth">
      <div className="container-fluid">
        <div className="row d-flex justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="box p-5">
              <h3>Sign Up</h3>
              <h4>New here?</h4>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  {...register("username", {
                    required: { value: true, message: "Username is required." },
                    maxLength: {
                      value: 20,
                      message: "Username must be less then 20 characters.",
                    },
                    minLength: {
                      value: 6,
                      message: "Username must at least be 6 characters.",
                    },
                  })}
                  placeholder="Username"
                  autoComplete="off"
                />
                {errors.username && (
                  <div className="errors">
                    <p>{errors.username.message}</p>
                  </div>
                )}
                <input
                  {...register("fullName", {
                    required: {
                      value: true,
                      message: "Full name is required.",
                    },
                  })}
                  placeholder="Full Name"
                  autoComplete="off"
                />
                {errors.fullName && (
                  <div className="errors">
                    <p>{errors.fullName.message}</p>
                  </div>
                )}
                <input
                  {...register("email", {
                    required: true,
                    validate: validateEmail,
                  })}
                  placeholder="Email"
                  autoComplete="off"
                />
                {errors.email && (
                  <div className="errors">
                    <p>{errors.email.message}</p>
                  </div>
                )}
                <input
                  {...register("password", {
                    required: { value: true, message: "Password is required." },
                    maxLength: {
                      value: 20,
                      message: "Password must be less then 20 characters.",
                    },
                    minLength: {
                      value: 8,
                      message: "Password must at least be 8 characters.",
                    },
                  })}
                  placeholder="Password"
                  autoComplete="off"
                />
                {errors.password && (
                  <div className="errors">
                    <p>{errors.password.message}</p>
                  </div>
                )}
                <button className="btn btn-primary" disabled={isSubmitting}>
                  Sign Up
                </button>
              </form>

              <div className="go__to">
                <p>
                  Already have any account. <Link to={"/login"}>Log In</Link>{" "}
                  here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
