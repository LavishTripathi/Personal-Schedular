import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

import { Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoggedin, setIsLoggedin] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("https://sutt-front-task2-d09a14a7c50b.herokuapp.com/auth/login", {email, password});
      const token = 'Bearer ' + response?.data?.token;

      alert("Login successful")

      if (localStorage.getItem("token")) {
        localStorage.removeItem("token")
      }

      localStorage.setItem("token", token)

      setIsLoggedin(true)
    } catch (error) {
      alert("Login failed")

      console.log(error);
    }
  };

  return !isLoggedin ? (
    <div className="login-container">
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="email" >Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
  ) : <Navigate to="/home" />

};

export default Login;