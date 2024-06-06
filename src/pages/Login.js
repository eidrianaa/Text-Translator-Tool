import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
          console.log('Login successful:', data);
          localStorage.setItem('token', data.token); // Presupunând că token-ul este trimis sub forma { token: '...' }
          alert('Conectare cu succes'); // Pop-up pentru succes
          navigate('/home'); // Navigate to home page after successful login
      } else {
          console.error('Login failed:', data.error || response.statusText);
          // Handle errors
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }
  

  return (
    <div className="lr-container">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required /><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required /><br />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;