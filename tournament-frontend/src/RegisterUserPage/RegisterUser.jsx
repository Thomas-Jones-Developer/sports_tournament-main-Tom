import React, { useState } from 'react';
import styles from './RegisterUser.css';  // Assuming you want CSS modules or just import CSS

const CreateAccountPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'ROLE_ADMIN',  // Fixed role, same as your Register component
    confirmation: false
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (!formData.confirmation) {
      setMessage('You must confirm the information is correct');
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
      // Optionally reset form here if you want:
      // setFormData({ username: '', password: '', confirmPassword: '', firstName: '', lastName: '', email: '', role: 'ROLE_ADMIN', confirmation: false });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <>
      {/* <header>
        <div className="header-container">
          <div id="main-heading">
            <h1>Create Account</h1>
          </div>
          <nav id="main-nav">
            <button id="menu-button" aria-label="Menu">
              <span className="icon-placeholder">Menu</span>
            </button>
          </nav>
          <div className="auth-wrapper">
            <div id="log-in">Log In</div>
            <div id="home-page">Home</div>
          </div>
        </div>
      </header> */}

      <main>
        <section className="container1">
          <nav id="credentials-nav">
            <h1>User Info</h1>

            <form onSubmit={handleSubmit}>

              <div>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm-password">Confirm Password:</label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="first-name">First Name:</label>
                <input
                  type="text"
                  id="first-name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="last-name">Last Name:</label>
                <input
                  type="text"
                  id="last-name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmation">I confirm the information is correct:</label>
                <input
                  id="confirmation"
                  name="confirmation"
                  type="checkbox"
                  checked={formData.confirmation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <button type="submit">Submit</button>
              </div>

              {message && <p>{message}</p>}
            </form>
          </nav>
        </section>
      </main>

      <footer>
        <div className="footer-container">
          <div className="footer-about">
            <h4>About</h4>
            <p>
            Welcome to TE SPORTS, where passion meets professionalism.
Safety first – Every player competes in a well-regulated environment with top-tier safety standards, ensuring the focus stays on performance and fun.
True competition – Our format is designed to challenge your skills, sharpen your strategy, and bring out your best, whether you’re a beginner or a seasoned professional.
Professional quality – 
            </p>
            <p>
            From our certified officials to our well-maintained facilities, everything we do reflects the highest standards of the sport.
What makes us truly unique is the balance between competitive spirit and community spirit. Here, players aren’t just rivals  they’re part of a supportive network where sportsmanship comes first and lifelong friendships are formed.
There’s nothing else like it.
 No other sport blends this level of intensity, integrity, and innovation while ensuring every player feels safe, valued, and motivated to excel. 
            </p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Find a Team</a></li>
              <li><a href="#">Find a Tournament</a></li>
              <li><a href="#">Host a Tournament</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 OurSiteName. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default CreateAccountPage;