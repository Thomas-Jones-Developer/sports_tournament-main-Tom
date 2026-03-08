import React from 'react';
import './HomePageStyles.css';

const HomePage = () => {
    return (
      <div>
        {/* <header>
          <div className="header-container">
            <div id="main-heading">
              <h1>Main Headline</h1>
            </div>
  
            <nav id="main-nav">
              <button id="menu-button" aria-label="Menu">
                <span className="icon-placeholder">Menu</span>
              </button>
            </nav>
  
            <div className="auth-wrapper">
              <div id="log-in">Log In</div>
              <div id="sign-up">Sign Up</div>
            </div>
          </div>
        </header> */}
  
        <main>
          <section className="tagline">
            <h2>Where competition meets community!</h2>
          </section>
  
          <section className="hero-images"></section>
  
          <section className="call-to-action">
            <h2>
              Browse upcoming events or start your own tournament today. Click on the sport or game to see available
              tournaments.
            </h2>
          </section>
  
          <section className="sports-grid">
            <div className="row">
              <div className="box">
              <img src="/images/soccer.png" alt="Soccer" />
                <h3>Soccer</h3>
              </div>
  
              <div className="box">
              <img src="/images/paddles-pickleball-flat-by-Vexels.png" alt="Pickleball Paddles" />
                <h3>Pickleball</h3>
              </div>
  
              <div className="box">
              <img src="/images/83403-toy-kart-mario-circuit-graphics-super.png" alt="Mario Kart" />

                <h3>
                  Esport <br /> Mario Kart
                </h3>
              </div>
            </div>
  
            <div className="row">
              <div className="box">
              <img src="/images/pexels-rdne-7005692.jpg" alt="Some description" />
                <h3>Baseball</h3>
              </div>
  
              <div className="box">
              <img src="/images/checkmate-1511866_1280.jpg" alt="Chess board" />

                <h3>Chess</h3>
              </div>
  
              <div className="box">
              <img src="/images/104562-detective-movie-pikachu-pokemon-free-transparent-image-hd.png" alt="Detective Pikachu" />

                <h3>
                  Esport <br /> Pokemon Unite
                </h3>
              </div>
            </div>
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
      </div>
    );
  };

export default HomePage;