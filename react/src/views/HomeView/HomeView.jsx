import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./HomeView.module.css";

import soccerBall from "../../assets/soccer/KamalSoccer.png";
import pickleballImage from "../../assets/pickelball/venti-views-UfnsQzOGLu8-unsplash.jpg";
import marioKartImage from "../../assets/mario kart/nintendo-switch-2154437_1920.jpg";
import basketballImage from "../../assets/basketball/womenBasketball.png";
import chessImage from "../../assets/chess/pexels-tkirkgoz-11887251.jpg";
import volleyballImage from "../../assets/volleyball/beach-volleyball-6483905_1920.jpg";

import image1 from "../../assets/carousel/image1.jpg";
import image2 from "../../assets/carousel/image2.jpg";
import image3 from "../../assets/carousel/image3.jpg";
import image4 from "../../assets/carousel/image4.jpg";
import image5 from "../../assets/carousel/image5.jpg";
import image6 from "../../assets/carousel/image6.jpg";
import image7 from "../../assets/carousel/image7.jpg";
import image8 from "../../assets/carousel/image8.jpg";

const SPORT_INFO = {
  Soccer: {
    rules: [
      "11 vs 11; 90 minutes split into two halves.",
      "No hands (except goalkeeper inside box).",
      "Offside: attackers must time runs behind the last defender.",
      "Fouls → free kicks/penalties; yellow/red cards for misconduct."
    ],
    history: "Modern soccer codified in England in 1863; today the world's most played sport with global leagues and the FIFA World Cup."
  },
  Pickleball: {
    rules: [
      "Doubles or singles on a badminton-sized court.",
      "Serve underhand cross-court; only the serving team scores.",
      "Double-bounce rule: ball must bounce once per side after the serve.",
      "No-volley zone (kitchen): no volleys inside the 7ft area."
    ],
    history: "Invented in Washington state in 1965 by friends who improvised a game with paddles, a perforated ball, and a lowered net."
  },
  "Mario Kart": {
    rules: [
      "Race karts on tracks; finish first over 3+ laps.",
      "Items (shells, bananas, mushrooms) can hinder or boost.",
      "Time trials measure fastest laps; tournaments use points.",
      "Sportsmanship: no griefing outside agreed rulesets."
    ],
    history: "First released by Nintendo in 1992; beloved party racer with competitive scenes and time-trial records."
  },
  Basketball: {
    rules: [
      "5 vs 5; dribble to move; 2 or 3 points per field goal.",
      "24s shot clock (pro); 5 fouls (HS) / 6 (NBA) limits physical play.",
      "Traveling/carrying violations for illegal ball movement.",
      "Rebounding and spacing decide possessions."
    ],
    history: "Created by James Naismith in 1891; global growth via college ball, NBA, and international competitions."
  },
  Chess: {
    rules: [
      "Checkmate the king; white moves first.",
      "Special moves: castling, en passant, pawn promotion.",
      "Touch-move in formal play: move the piece you touch.",
      "Openings → middlegame tactics → endgame technique."
    ],
    history: "Descends from chaturanga (c. 6th-century India); standardized rules evolved through medieval Europe."
  },
  Volleyball: {
    rules: [
      "6 vs 6; rally scoring to 25 (win by 2).",
      "Maximum 3 touches: bump, set, spike.",
      "No touching the net during play; rotates after side-out.",
      "Beach 2s uses smaller court and different strategies."
    ],
    history: "Invented by William G. Morgan in 1895 as 'mintonette'; now an Olympic sport with indoor and beach variants."
  }
};

const CAROUSEL_IMAGES = [image1, image2, image3, image4, image5, image6, image7, image8];

const tiles = [
  { label: "Soccer", sport: "Soccer", image: soccerBall },
  { label: "Pickleball", sport: "Pickleball", image: pickleballImage },
  { label: "Mario Kart", sport: "Mario Kart", image: marioKartImage },
  { label: "Basketball", sport: "Basketball", image: basketballImage },
  { label: "Chess", sport: "Chess", image: chessImage },
  { label: "Volleyball", sport: "Volleyball", image: volleyballImage }
];

export default function HomeView() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goTo = (sport) => navigate(`/createTournament?sport=${encodeURIComponent(sport)}`);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((i) => (i + 1) % CAROUSEL_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero} style={{ backgroundImage: `url(${volleyballImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroPill}>🏆 Season Play · Teams · Tournaments</div>
          <h1 className={styles.heroTitle}>
            Compete.<br />Connect.<br />Champion.
          </h1>
          <p className={styles.heroSub}>
            Build your team, join a league, and compete across dozens of sports — all in one place.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/viewTeams" className={styles.ctaPrimary}>Find a Team</Link>
            <Link to="/createTeam" className={styles.ctaSecondary}>Create a Team</Link>
          </div>
        </div>
        <div className={styles.heroScrollHint}>↓</div>
      </section>

      {/* ── STATS BAR ── */}
      <div className={styles.statsBar}>
        <div className={styles.stat}><span className={styles.statNum}>6+</span><span className={styles.statLabel}>Sports</span></div>
        <div className={styles.statDivider} />
        <div className={styles.stat}><span className={styles.statNum}>∞</span><span className={styles.statLabel}>Tournaments</span></div>
        <div className={styles.statDivider} />
        <div className={styles.stat}><span className={styles.statNum}>Open</span><span className={styles.statLabel}>Registration</span></div>
        <div className={styles.statDivider} />
        <div className={styles.stat}><span className={styles.statNum}>Free</span><span className={styles.statLabel}>To Join</span></div>
      </div>

      <main className={styles.main}>

        {/* ── CAROUSEL ── */}
        {/* <section className={styles.carouselSection}>
          <div className={styles.carouselContainer}>
            {CAROUSEL_IMAGES.map((image, index) => (
              <div
                key={index}
                className={`${styles.carouselSlide} ${index === currentImageIndex ? styles.active : ""}`}
              >
                <img src={image} alt={`Featured ${index + 1}`} className={styles.carouselImage} />
              </div>
            ))}
            <button className={`${styles.carouselArrow} ${styles.carouselPrev}`} onClick={() => setCurrentImageIndex((currentImageIndex - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length)}>‹</button>
            <button className={`${styles.carouselArrow} ${styles.carouselNext}`} onClick={() => setCurrentImageIndex((currentImageIndex + 1) % CAROUSEL_IMAGES.length)}>›</button>
          </div>
          <div className={styles.carouselDots}>
            {CAROUSEL_IMAGES.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === currentImageIndex ? styles.activeDot : ""}`}
                onClick={() => setCurrentImageIndex(i)}
              />
            ))}
          </div>
        </section> */}

        {/* ── SPORTS GRID ── */}
        <section className={styles.sportsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Choose Your Sport</h2>
            <p className={styles.sectionSub}>Click any sport to browse or create tournaments</p>
          </div>
          <div className={styles.sportsGrid}>
            {tiles.map((t, i) => (
              <div
                key={i}
                className={styles.sportCard}
                style={{ backgroundImage: `url(${t.image})` }}
                onClick={() => goTo(t.sport)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goTo(t.sport)}
              >
                <div className={styles.sportCardOverlay} />
                <span className={styles.sportLabel}>{t.label}</span>
                <span className={styles.sportArrow}>→</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className={styles.howSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>01</div>
              <h3 className={styles.stepTitle}>Create or Join a Team</h3>
              <p className={styles.stepDesc}>Browse existing teams looking for players, or start your own and recruit members.</p>
              <Link to="/viewTeams" className={styles.stepLink}>Browse Teams →</Link>
            </div>
            <div className={styles.stepConnector} />
            <div className={styles.step}>
              <div className={styles.stepNum}>02</div>
              <h3 className={styles.stepTitle}>Enter a Tournament</h3>
              <p className={styles.stepDesc}>Find open tournaments in your sport, register your team, and get your bracket.</p>
              <Link to="/browseTournaments" className={styles.stepLink}>Browse Tournaments →</Link>
            </div>
            <div className={styles.stepConnector} />
            <div className={styles.step}>
              <div className={styles.stepNum}>03</div>
              <h3 className={styles.stepTitle}>Compete & Win</h3>
              <p className={styles.stepDesc}>Play your matches, track results, and climb the standings over the season.</p>
              <Link to="/createTournament" className={styles.stepLink}>Create a Tournament →</Link>
            </div>
          </div>
        </section>

        {/* ── LEARN THE BASICS ── */}
        {/* <section className={styles.learnSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Learn the Basics</h2>
            <p className={styles.sectionSub}>New to a sport? Get up to speed fast.</p>
          </div>
          <div className={styles.learnGrid}>
            {Object.keys(SPORT_INFO).map((sport) => {
              const isOpen = expanded === sport;
              return (
                <article key={sport} className={`${styles.learnCard} ${isOpen ? styles.learnCardOpen : ""}`}>
                  <header className={styles.learnHeader} onClick={() => setExpanded(isOpen ? null : sport)}>
                    <h3 className={styles.learnSport}>{sport}</h3>
                    <button className={styles.learnToggle} aria-expanded={isOpen}>
                      {isOpen ? "−" : "+"}
                    </button>
                  </header>
                  {isOpen && (
                    <div className={styles.learnBody}>
                      <div className={styles.learnRow}>
                        <div>
                          <h4 className={styles.learnSubhead}>Rules</h4>
                          <ul className={styles.rulesList}>
                            {SPORT_INFO[sport].rules.map((r, idx) => <li key={idx}>{r}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4 className={styles.learnSubhead}>History</h4>
                          <p className={styles.historyText}>{SPORT_INFO[sport].history}</p>
                        </div>
                      </div>
                      <div className={styles.learnActions}>
                        <button className={styles.learnCta} onClick={() => goTo(sport)}>
                          Create a {sport} tournament
                        </button>
                        <Link className={styles.learnCtaSecondary} to={`/browseTournaments?sport=${encodeURIComponent(sport)}`}>
                          Browse {sport} tournaments
                        </Link>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section> */}

      </main>
    </div>
  );
}