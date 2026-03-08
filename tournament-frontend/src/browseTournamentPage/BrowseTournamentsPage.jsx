import React from 'react';
import './browseTournamentPage.css'

const BrowseTournamentsPage = () => {
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


<section class="card">
    <h1>TEsport</h1>
    <hr class="divider" />

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>TEAM</th>
            <th>W</th>
            <th>L</th>
            <th>WIN</th>
            <th>GB</th>
            <th>CONF</th>
          </tr>
        </thead>
        <tbody>
          
          <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        </tbody>
      </table>
    </div>
  </section>
        


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

export default BrowseTournamentsPage;