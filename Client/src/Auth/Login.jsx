import React from "react";
import "../assets/Css/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../Context/UserContext";

const Login = () => {
  const { setIsLogIn } = useUserContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    const api = "http://localhost:3000/user/login";
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const resData = await response.json();
      const token = resData.token;

      if (!token) {
        throw new Error("Token not found in response");
      }
      localStorage.setItem("token", token);
      setIsLogIn(true);
      reset();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="auth">
      <div className="container-fluid">
        <div className="row d-flex justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="box p-5">
              <h3>Login</h3>
              <h4>Have an account?</h4>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  {...register("username", {
                    required: { value: true, message: "Username is required." },
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
                  {...register("password", {
                    required: { value: true, message: "Password is required." },
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
                  Log In
                </button>
              </form>
              <div className="additional__info">
                <p>Remember Me</p>
                <p>Forget Password</p>
              </div>
              <div className="go__to">
                <p>
                  Don't have any account. <Link to={"/signup"}>Sign Up</Link>{" "}
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

export default Login;
