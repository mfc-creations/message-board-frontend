import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/v1/auth/signup", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("userId", res.data.data._id);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  return (
    <div>
      Signup
      <Link to="/login">Login</Link>
      <br />
      <p style={{ color: "red" }}>{error}</p>
      <input
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Login;
