# TE Sports

A social platform for amateur sports teams. TE Sports lets players find teams, captains recruit talent, and teams challenge each other to matches at real local parks.

🔗 [Live Frontend](https://te-sports.vercel.app) | [Video Demo](https://www.youtube.com/watch?v=X_gPESSQidE)

---

## About

TE Sports was built as a full-stack capstone project. The goal was to create a platform where amateur athletes could organize themselves the way professional teams do — browsing players, building rosters, managing challenges, and scheduling matches.

---

## Features

- **Team Management** — Create and manage teams, set roster sizes, control recruiting status, transfer ownership, or delete teams
- **Player Profiles** — Public profiles for every registered player showing their team, sport, and role
- **Two-Way Recruitment Inbox** — Team captains can invite players directly; players can request to join teams. Both flows land in a persistent inbox with accept/deny/delete controls
- **Match Challenges** — Captains can challenge opposing teams to matches directly from their team page or through the Set Up Match page. Challenged teams respond via inbox
- **Park Selection** — Match challenges include a state → city → park dropdown system backed by a real database of Columbus, Ohio parks, with address auto-fill
- **View Matches** — A confirmed matches page shows all accepted challenges platform-wide, with your matches highlighted

---

## Tech Stack

**Frontend**
- React 18
- React Router
- Axios
- CSS Modules
- Vite

**Backend**
- Java 17
- Spring Boot
- Spring Security with JWT authentication
- PostgreSQL
- JDBC

---

## Architecture

The frontend and backend are fully decoupled. The React app communicates with the Spring Boot REST API via Axios. Authentication uses JWT tokens stored in localStorage and attached to every request via Axios default headers. User context is managed globally using React Context API.

---

## Running Locally

**Backend**
1. Create a PostgreSQL database
2. Run the database creation script in `/database/`
3. Update `src/main/resources/application.properties` with your database credentials
4. Run the Spring Boot application on port 9000

**Frontend**
1. Navigate to the `/react` directory
2. Create a `.env` file with:
```
   VITE_REMOTE_API=http://localhost:9000
```
3. Run `npm install` then `npm run dev`

---

## Author

Built by **Thomas Jones**  
[GitHub](https://github.com/Thomas-Jones-Developer) | [LinkedIn](www.linkedin.com/in/thomas-jones-sws)

---

## Notes

The live frontend is deployed on Vercel. The backend runs locally — a full live demo is available upon request.
