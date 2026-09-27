import React from "react";
import "./Login.css";
import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-h1">Login here</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button className="submit" type="submit ">
            Login
          </button>
        </form>
        {error && <p className="login-error">{error}</p>}
        <p className="p">
          Don't have an account?<Link to="/Signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
