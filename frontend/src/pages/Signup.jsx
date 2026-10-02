import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "signup failed");
    }
  };
  return (
      <div className="signup-container">
        <div className="signup-box">
          <h1>Signup</h1>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter your name" onChange={(e)=>setName(e.target.value)}/>
            <input type="text" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)} />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <button type="submit">Signup</button>
          </form>
          {error && <p className="signup-error">{error}</p>}
          <p className="p">
          Already have account? <Link to="/login">Login</Link>
        </p>
      </div>
        </div>

  );
};

export default Signup;
