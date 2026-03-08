import CreateTournament from '../CreateTournamentPage/CreateTournament';
import styles from './SoccerPage.module.css';
import { useState } from "react";

export default function CreateTournamentPage() {

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

  const handleSubmit = async () => {
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
 
                <main>
                    <div className={styles.headerContainer}>
                        <div className={styles.mainHeading}>
                            
                            <img className={styles.logo} src="src/RenderedImage.jpg"/>
                            
                        </div>
                        <nav id="main-nav">
                            <button id="menu-button" aria-label="Menu">
                                <span class="icon-placeholder">Menu</span>
                            </button>
                        </nav>
                        <div className={styles.authWrapper}>
                            <div className={styles.logIn}>Log In</div>
                            <div className={styles.signUp}>Sign up</div>
                        </div>
                    </div>
                </main>



                <div class="topic1">
                    <h2>Sports schedule maker</h2>
                    <p class="description">Save time with our free sports league scheduler</p>
                </div>
            



            <header>
                <p className={styles.scheduler}>Sport</p>
                <select name="" className={styles.dropDownScheduler}>
                    <option value="Select Sport" default>Select your sport.....</option>
                    <option value="Soccer">Soccer</option>
                    <option value="volleyBall">Volley Ball</option>
                    <option value="basketball">Basketball</option>
                    <option value="pickleBall">Pickle Ball</option>
                    <option value="chess">Chess</option>
                    <option value="marioKart">Mario Kart</option>

                    {/* <div class="dropDownScheduler">Select your sport...</div> */}

                </select>



                <p className={styles.scheduler}>Number of Teams</p>
                <select name="" className={styles.dropDownScheduler}>
                    <option value="select number" defaultValue>Select number of teams....</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                </select>

                <p className={styles.scheduler}>Season</p>
                <select name="" className={styles.dropDownScheduler}>
                    <option value="selectSeason" defaultValue>Select season....</option>
                    <option value="fall">Fall</option>
                    <option value="summer">Summer</option>
                    <option value="spring">Spring</option>
                    <option value="winter">Winter</option>
                </select>

                <p className={styles.scheduler}>Start date</p>
                <input className={styles.dropDownScheduler} type="date" />

                <p className={styles.scheduler}>End date</p>
                <input className={styles.dropDownScheduler} type="date" />

                <p className={styles.scheduler}>Rounds</p>
                <select name="" className={styles.dropDownScheduler}>
                    <option value="select number" defaultValue>Select number of rounds....</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select>

                <p className={styles.scheduler}>Entry Fee</p>
                <select name="" className={styles.dropDownScheduler}>
                    <option value="select number" defaultValue>Select amount....</option>
                    <option value="1">$100</option>
                    <option value="2">$200</option>
                    <option value="3">$300</option>
                    <option value="4">$400</option>
                    <option value="5">$500</option>
                    <option value="6">$600</option>
                    <option value="7">$700</option>
                    <option value="8">$800</option>
                    <option value="9">$900</option>
                    <option value="10">$1000</option>

                </select>

                <p className={styles.scheduler}>Prize description</p>
                <select name="" className={styles.dropDownScheduler}>
                    <option value="select number" defaultValue>Select winners price....</option>
                    <option value="1">Gold medal</option>
                    <option value="2">Silva medal</option>
                    <option value="3">Bronze medal</option>
                    <option value="4">Cash price</option>
                    
                </select>

                <p className={styles.scheduler}>Location</p>
                <select name="" className={styles.dropDownScheduler}>
                    <option value="select number" defaultValue>Select location...</option>
                    <option value="1">Columbus</option>
                    <option value="2">Cincinnati</option>
                    <option value="3">Cleveland</option>
                    <option value="4">Dayton</option>
                </select>
            </header>

            <div class="topic2">
                    <p>Click this button to submit!</p>
                    <button type="submit">Create</button>
                </div>
      
            

        {/* <div className={styles.middleBody}>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus vitae minima ea tenetur qui recusandae laboriosam odio vero facere beatae in, voluptate deleniti suscipit culpa harum dolor saepe dignissimos quam!</p>

        </div> */}

            

        </>

            )

}

        //    {/* <header>
        //         <div class="PageTop">
        //             <a href="https://playpass.com/sports-software/league-scheduler" className="topText">Home</a>
        //             <span>
        //                 <a href="https://playpass.com/sports-software/league-scheduler" className="topText">Login</a>
        //                 <a href="https://playpass.com/sports-software/league-scheduler" className="topText">SignUp</a>
        //             </span>
        //         </div>
        //     <div class="topic1">
        //         <h1>Sports schedule maker</h1>
        //         <p class="description">Save time with our free sports league scheduler</p>
        //     </div>
        //     </header> */}

