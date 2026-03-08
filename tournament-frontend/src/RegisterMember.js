import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'ROLE_ADMIN', 
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:9000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
  
      setMessage('Registration successful! Please log in.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  return (
<form onSubmit={handleSubmit}>
  <input
    name="username"
    placeholder="Username"
    value={formData.username}
    onChange={handleChange}
    required
  />
  <input
    type="password"
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
  />
  <input
    type="password"
    name="confirmPassword"
    placeholder="Confirm Password"
    value={formData.confirmPassword}
    onChange={handleChange}
    required
  />

  {/* Role is fixed */}
  <input
    type="text"
    name="role"
    value={formData.role}
    readOnly
  />

  <input
    type="text"
    name="firstName"
    placeholder="First Name"
    value={formData.firstName}
    onChange={handleChange}
    required
  />

  <input
    type="text"
    name="lastName"
    placeholder="Last Name"
    value={formData.lastName}
    onChange={handleChange}
    required
  />

  <input
    type="email"
    name="email"
    placeholder="Email"
    value={formData.email}
    onChange={handleChange}
    required
  />

  <button type="submit">Register</button>
  <p>{message}</p>
</form>
  );
}

export default Register;