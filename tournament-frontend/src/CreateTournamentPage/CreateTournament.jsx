import { useState } from "react";
import './CreateTournament.css';


function CreateTournament() {
  const [formData, setFormData] = useState({
    sportId: '',
    name: '',
    season: '',
    startDate: '',
    endDate: '',
    numberOfRounds: '',
    entryFee: '',
    prizeDescription: '',
    location: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      sportId: Number(formData.sportId),
      name: formData.name,
      season: formData.season,
      startDate: formData.startDate,
      endDate: formData.endDate,
      numberOfRounds: Number(formData.numberOfRounds),
      entryFee: Number(formData.entryFee),
      prizeDescription: formData.prizeDescription,
      location: formData.location
    };

    try {
      // ✅ Get token from localStorage
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('You must be logged in as an admin to create a tournament.');
      }

      const response = await fetch('http://localhost:9000/tournament', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // ✅ Add token here
        },
        body: JSON.stringify(dataToSend)
      });
    
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create tournament: ${response.status} ${errorText}`);
      }
    
      const result = await response.json();
      setMessage(`Tournament created with ID: ${result.tournamentId}`);
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  }

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

    <div className="container">
      <h2>Create Tournament</h2>
      <form onSubmit={handleSubmit}>

        <div>
        <input name="sportId" placeholder="Sport ID" value={formData.sportId} onChange={handleChange} required />
        </div>

        <div>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <select name="season" value={formData.season} onChange={handleChange} required>
            <option value="">Select Season</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="autumn">Autumn</option>
            <option value="winter">Winter</option>
         </select>
      </div>

        <div> 
          <input type="date" name="startDate" placeholder="Start Date" value={formData.startDate} onChange={handleChange} required />
        </div>

        <div>
        <input type="date" name="endDate" placeholder="End Date" value={formData.endDate} onChange={handleChange} required />
        </div>


        <div>
          <select name="numberOfRounds" value={formData.numberOfRounds} onChange={handleChange} required>
            <option value="">Select Number of Rounds</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
         </select>
      </div>


      <div>
        <select name="entryFee" value={formData.entryFee} onChange={handleChange} required>
          <option value="">Select amount....</option>
          <option value="100">$100</option>
          <option value="200">$200</option>
          <option value="300">$300</option>
          <option value="400">$400</option>
          <option value="500">$500</option>
          <option value="600">$600</option>
          <option value="700">$700</option>
          <option value="800">$800</option>
          <option value="900">$900</option>
          <option value="1000">$1000</option>
        </select>
      </div>


      <div>
        <select 
          name="prizeDescription" 
          value={formData.prizeDescription} 
          onChange={handleChange} 
          required>
            <option value="">Select winner's prize....</option>
            <option value="Gold medal">Gold medal</option>
            <option value="Silver medal">Silver medal</option>
            <option value="Bronze medal">Bronze medal</option>
            <option value="Cash prize">Cash prize</option>
        </select>
      </div>
  

        <div>
          <select name="location" value={formData.location} onChange={handleChange} required>
          <option value="select number" defaultValue>Select location...</option>
                    <option value="1">Columbus</option>
                    <option value="2">Cincinnati</option>
                    <option value="3">Cleveland</option>
                    <option value="4">Dayton</option>
            </select>
        </div>


        <div>
          <button type="submit">Create</button>
        </div>

      </form>
      {message && <p>{message}</p>}
    </div>

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
}

export default CreateTournament;