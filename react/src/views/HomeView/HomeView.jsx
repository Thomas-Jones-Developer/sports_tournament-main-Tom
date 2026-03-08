import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./HomeView.module.css";

// Images
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
    history:
      "Modern soccer codified in England in 1863; today the world’s most played sport with global leagues and the FIFA World Cup."
  },
  Pickleball: {
    rules: [
      "Doubles or singles on a badminton-sized court.",
      "Serve underhand cross-court; only the serving team scores.",
      "Double-bounce rule: ball must bounce once per side after the serve.",
      "No-volley zone (kitchen): no volleys inside the 7ft area."
    ],
    history:
      "Invented in Washington state in 1965 by friends who improvised a game with paddles, a perforated ball, and a lowered net."
  },
  "Mario Kart": {
    rules: [
      "Race karts on tracks; finish first over 3+ laps.",
      "Items (shells, bananas, mushrooms) can hinder or boost.",
      "Time trials measure fastest laps; tournaments use points.",
      "Sportsmanship: no griefing outside agreed rulesets."
    ],
    history:
      "First released by Nintendo in 1992; beloved party racer with competitive scenes and time-trial records."
  },
  Basketball: {
    rules: [
      "5 vs 5; dribble to move; 2 or 3 points per field goal.",
      "24s shot clock (pro); 5 fouls (HS) / 6 (NBA) limits physical play.",
      "Traveling/carrying violations for illegal ball movement.",
      "Rebounding and spacing decide possessions."
    ],
    history:
      "Created by James Naismith in 1891; global growth via college ball, NBA, and international competitions."
  },
  Chess: {
    rules: [
      "Checkmate the king; white moves first.",
      "Special moves: castling, en passant, pawn promotion.",
      "Touch-move in formal play: move the piece you touch.",
      "Openings → middlegame tactics → endgame technique."
    ],
    history:
      "Descends from chaturanga (c. 6th-century India); standardized rules evolved through medieval Europe."
  },
  Volleyball: {
    rules: [
      "6 vs 6; rally scoring to 25 (win by 2).",
      "Maximum 3 touches: bump, set, spike.",
      "No touching the net during play; rotates after side-out.",
      "Beach 2s uses smaller court and different strategies."
    ],
    history:
      "Invented by William G. Morgan in 1895 as ‘mintonette’; now an Olympic sport with indoor and beach variants."
  }
};

const CAROUSEL_IMAGES = [image1, image2, image3, image4, image5, image6, image7, image8];

export default function HomeView() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goTo = (sport) => navigate(`/createTournament?sport=${encodeURIComponent(sport)}`);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((i) => (i + 1) % CAROUSEL_IMAGES.length);
    }, 2000); // 2 seconds
    return () => clearInterval(interval);
  }, []);

  const tiles = [
    { label: "Soccer", sport: "Soccer", image: soccerBall },
    { label: "Pickleball", sport: "Pickleball", image: pickleballImage },
    { label: "Esport\nMario Kart", sport: "Mario Kart", image: marioKartImage },
    { label: "Basketball", sport: "Basketball", image: basketballImage },
    { label: "Chess", sport: "Chess", image: chessImage },
    { label: "Volleyball", sport: "Volleyball", image: volleyballImage }
  ];

  return (
    <div className={styles.page}>
      <div
        className={styles.mainContent}
        style={{ backgroundImage: `url(${volleyballImage})` }}
      >

      <main className={styles.main}>
        {/* Decorative animated shapes */}
        <div className={styles.decorBall} aria-hidden="true" />
        <div className={styles.decorCourt} aria-hidden="true" />
        <div className={styles.decorNet} aria-hidden="true" />

        <h1 className={styles.headline}></h1>

        {/* >>> Moved carousel here <<< */}
        <section className={styles.carouselSection} aria-label="Featured images">
          <div className={styles.carouselContainer}>
            <div className={styles.carouselTrack}>
              {CAROUSEL_IMAGES.map((image, index) => (
                <div
                  key={index}
                  className={`${styles.carouselSlide} ${index === currentImageIndex ? styles.active : ""}`}
                >
                  <img src={image} alt={`Featured ${index + 1}`} className={styles.carouselImage} />
                </div>
              ))}
            </div>
          </div>

          {/* dots */}
          <div className={styles.carouselDots}>
            {CAROUSEL_IMAGES.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === currentImageIndex ? styles.activeDot : ""}`}
                onClick={() => setCurrentImageIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        <div className={styles.tagline}>
          <div>Browse upcoming events</div>
          <div>Start your own tournament today!</div>
          <div>Click on the sport or game to see available tournaments</div>
        </div>

        <section className={styles.sportsGrid} aria-label="Choose a sport">
          <div className={styles.row}>
            {tiles.slice(0, 3).map((t, i) => (
              <div
                key={i}
                className={styles.box}
                style={{ backgroundImage: `url(${t.image})` }}
                onClick={() => goTo(t.sport)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goTo(t.sport)}
              >
                <span className={styles.badge} aria-hidden="true">▶</span>
                <h3 className={styles.title}>
                  {t.label.includes("\n") ? (
                    <>
                      {t.label.split("\n")[0]} <br />
                      {t.label.split("\n")[1]}
                    </>
                  ) : (
                    t.label
                  )}
                </h3>
              </div>
            ))}
          </div>

          <div className={styles.row}>
            {tiles.slice(3).map((t, i) => (
              <div
                key={i + 3}
                className={styles.box}
                style={{ backgroundImage: `url(${t.image})` }}
                onClick={() => goTo(t.sport)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goTo(t.sport)}
              >
                <span className={styles.badge} aria-hidden="true">▶</span>
                <h3 className={styles.title}>{t.label}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.learnSection} aria-label="Learn the basics">
          <h2 className={styles.learnHeading}>Learn the Basics</h2>
          <div className={styles.learnGrid}>
            {Object.keys(SPORT_INFO).map((sport) => {
              const isOpen = expanded === sport;
              return (
                <article key={sport} className={styles.learnCard}>
                  <header className={styles.learnHeader}>
                    <h3>{sport}</h3>
                    <button
                      className={styles.learnToggle}
                      aria-expanded={isOpen}
                      aria-controls={`panel-${sport}`}
                      onClick={() => setExpanded(isOpen ? null : sport)}
                    >
                      {isOpen ? "Hide" : "Quick read"}
                    </button>
                  </header>

                  {isOpen && (
                    <div id={`panel-${sport}`} className={styles.learnBody}>
                      <div className={styles.learnRow}>
                        <div>
                          <h4>Rules (overview)</h4>
                          <ul className={styles.rulesList}>
                            {SPORT_INFO[sport].rules.map((r, idx) => (
                              <li key={idx}>{r}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4>History (short)</h4>
                          <p className={styles.historyText}>{SPORT_INFO[sport].history}</p>
                        </div>
                      </div>

                      <div className={styles.actions}>
                        <button className={styles.cta} onClick={() => goTo(sport)}>
                          Create a {sport} tournament
                        </button>
                        <Link className={styles.secondaryCta} to={`/browseTournaments?sport=${encodeURIComponent(sport)}`}>
                          Browse {sport} tournaments
                        </Link>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}
