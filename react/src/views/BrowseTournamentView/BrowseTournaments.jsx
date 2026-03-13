// Importing React itself and two hooks from React.
// useState → lets this component store and update data (state).
// useEffect → lets the component run code when the component loads or when certain values change.
import React, { useState, useEffect } from "react";

// Importing CSS module styles for this page.
// CSS modules scope class names so they don't conflict with other components.
import styles from "./BrowseTournament.module.css";

// Importing a service responsible for API communication.
// This file likely contains functions that call the backend using axios/fetch.
import TournamentService from "../../services/TournamentService";

// Importing a background image that will be used in the layout.
import tournamentsBackground from "../../assets/pickelball/venti-views-UfnsQzOGLu8-unsplash.jpg";

// Importing React Router's navigation hook.
// This allows us to programmatically move to another page.
import { useNavigate } from "react-router-dom";


// Main functional React component that renders the tournament browsing page.
// The component optionally receives a prop called "isAdmin".
// If not provided, it defaults to false.
const TournamentsView = ({ isAdmin = false }) => {

  // STATE VARIABLES
  // ------------------------------------------------------------

  // tournaments
  // Stores the list of tournaments retrieved from the backend API.
  // Initially an empty array because nothing has been loaded yet.
  const [tournaments, setTournaments] = useState([]);

  // loading
  // Boolean used to track whether the API request is still happening.
  // Starts as true so the UI knows data hasn't loaded yet.
  const [loading, setLoading] = useState(true);

  // sortConfig
  // Tracks how the table is currently sorted.
  // key → which column is sorted
  // direction → ascending or descending
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // navigate
  // Function from React Router used to change pages.
  // Example usage: navigate("/tournament/5")
  const navigate = useNavigate();


  // ------------------------------------------------------------
  // DATA FETCHING EFFECT
  // ------------------------------------------------------------

  // useEffect runs after the component first renders.
  // The empty dependency array [] means this runs ONLY ONCE (like componentDidMount).
  useEffect(() => {

    // Fetch tournaments from the backend using the service.
    // This likely calls an API endpoint like /api/tournaments.
    TournamentService.getTournament()

      // If successful, store the returned tournaments in state.
      // response.data usually contains the actual array from the backend.
      .then((response) => setTournaments(response.data || []))

      // If something fails (server down, network issue, etc),
      // we catch the error and set tournaments to an empty array.
      .catch(() => setTournaments([]))

      // Finally runs regardless of success or failure.
      // This stops the loading state.
      .finally(() => setLoading(false));

  }, []); // empty dependency list = run once when component mounts



  // ------------------------------------------------------------
  // SORTING FUNCTION
  // ------------------------------------------------------------

  // This function sorts the tournaments table when the user clicks a "Sort by" button.
  const sortData = (key) => {

    // Default sort direction is ascending.
    let direction = "asc";

    // If the user clicks the same column again,
    // reverse the direction (ascending → descending).
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";

    // Update the sorting configuration state.
    setSortConfig({ key, direction });

    // Create a copy of tournaments before sorting.
    // This is important because React state should never be mutated directly.
    const sorted = [...tournaments].sort((a, b) => {

      // Compare the two values.
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;

      // If equal, keep original order.
      return 0;
    });

    // Save sorted tournaments back into state so the UI updates.
    setTournaments(sorted);
  };



  // ------------------------------------------------------------
  // STATUS CALCULATION FUNCTION
  // ------------------------------------------------------------

  // Determines whether a tournament is Active, Complete, or Canceled.
  const getStatus = (tournament) => {

    // Get today's date.
    const today = new Date();

    // Convert the tournament end date to a Date object.
    const endDate = new Date(tournament.endDate);

    // If the tournament is explicitly marked canceled, return that.
    if (tournament.status === "Canceled") return "Canceled";

    // Otherwise:
    // If the end date is in the past → Complete
    // If the end date is in the future → Active
    return endDate < today ? "Complete" : "Active";
  };



  // ------------------------------------------------------------
  // STATUS CLICK HANDLER (ADMIN ONLY)
  // ------------------------------------------------------------

  // This function toggles a tournament between Active and Canceled.
  const handleStatusClick = (tournament, e) => {

    // Prevents the click event from bubbling up to the table row.
    // Without this, clicking the status would also navigate to the tournament page.
    e.stopPropagation();

    const today = new Date();
    const endDate = new Date(tournament.endDate);

    // If the user is not an admin OR the tournament already ended,
    // do nothing.
    if (!isAdmin || endDate < today) return;

    // Toggle the tournament status.
    // If canceled → activate it
    // If active → cancel it
    const newStatus = tournament.status === "Canceled" ? "Active" : "Canceled";


    // Call backend API to update the tournament status.
    TournamentService.updateTournamentStatus(tournament.tournamentId, newStatus)

      // If the backend update succeeds,
      // update the local state so the UI immediately reflects the change.
      .then(() => {

        setTournaments((prev) =>
          prev.map((t) =>

            // Find the tournament that was changed.
            t.tournamentId === tournament.tournamentId

              // If it's the same tournament, update its status.
              ? { ...t, status: newStatus }

              // Otherwise keep the tournament unchanged.
              : t
          )
        );

      })

      // Log errors if the update fails.
      .catch((err) => console.error("Error updating status:", err));
  };



  // ------------------------------------------------------------
  // COMPONENT RENDER (JSX)
  // ------------------------------------------------------------

  return (

    // Outer container
    <div className={styles.pageContainer}>

      {/* Main content area with background image */}
      <div
        className={styles.mainContent}
        style={{ backgroundImage: `url(${tournamentsBackground})` }}
      >

        {/* White card container holding the page content */}
        <div className={styles.formContainer}>

          {/* Page title */}
          <h1 className={styles.title}>Our Tournaments</h1>

          {/* Subtitle explaining the page */}
          <div className={styles.tournamentSubtitle}>
            Ready to compete? Find a tournament to join here!
          </div>


          {/* ------------------------------------------------ */}
          {/* SORT BUTTONS */}
          {/* ------------------------------------------------ */}

          <div className={styles.buttonRow}>

            {/* Sort by tournament name */}
            <button className={styles.roundedBtn} onClick={() => sortData("name")}>
              Sort by Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </button>

            {/* Sort by sport */}
            <button className={styles.roundedBtn} onClick={() => sortData("sportName")}>
              Sort by Sport {sortConfig.key === "sportName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </button>

            {/* Sort by start date */}
            <button className={styles.roundedBtn} onClick={() => sortData("startDate")}>
              Sort by Start Date {sortConfig.key === "startDate" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </button>

          </div>



          {/* ------------------------------------------------ */}
          {/* TOURNAMENT TABLE */}
          {/* ------------------------------------------------ */}

          <table className={styles.tournamentsTable}>

            {/* Table header */}
            <thead>
              <tr className={styles.tableHeader}>
                <th>ID</th>
                <th>Name</th>
                <th>Sport ID</th>
                <th>Sport</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Winner</th>
              </tr>
            </thead>


            {/* Table body */}
            <tbody>

              {/* Only render tournaments once loading is complete */}
              {!loading &&
                tournaments.map((tournament) => {

                  // Determine today's date and tournament end date.
                  const today = new Date();
                  const endDate = new Date(tournament.endDate);

                  // Determine tournament status dynamically.
                  //
                  // This block decides what text should appear in the "Status" column for each tournament.
                  //
                  // The code uses a JavaScript pattern called a "ternary operator".
                  // A ternary operator is basically a compact version of an if/else statement.
                  // Format: condition ? valueIfTrue : valueIfFalse
                  //
                  // In this case we actually have TWO ternary checks chained together.
                  //
                  // Step-by-step logic:
                  //
                  // 1️⃣ First check:
                  // Does the tournament already have a status set by the database?
                  //
                  // tournament.status ?
                  //
                  // If tournament.status exists (for example "Canceled"),
                  // then we simply use that value and stop checking anything else.
                  //
                  // 2️⃣ If tournament.status DOES NOT exist:
                  // We determine the status automatically using the tournament end date.
                  //
                  // endDate < today
                  //
                  // If the end date is earlier than today,
                  // the tournament must already be finished.
                  //
                  // So we return "Complete".
                  //
                  // 3️⃣ If the end date is NOT earlier than today,
                  // the tournament must still be ongoing or upcoming.
                  //
                  // So we return "Active".
                  //
                  // Expanded into a traditional if/else it would look like this:
                  //
                  // let status;
                  // if (tournament.status) {
                  //     status = tournament.status;
                  // } else if (endDate < today) {
                  //     status = "Complete";
                  // } else {
                  //     status = "Active";
                  // }
                  //
                  // The ternary version is just a shorter way to write that logic.
                  const status = tournament.status
                    ? tournament.status
                    : endDate < today
                      ? "Complete"
                      : "Active";


                  return (

                    // Each row represents a tournament.
                    // Clicking the row navigates to that tournament's detail page.
                    // Each <tr> (table row) represents ONE tournament in the table.
                    //
                    // React requires every item in a list to have a unique "key".
                    // This helps React efficiently update the UI when data changes.
                    //
                    // We use tournament.tournamentId because it is guaranteed to be unique.
                    <tr
                      key={tournament.tournamentId}

                      // This applies a CSS class to the row.
                      // The class likely contains hover effects such as:
                      // - changing the background color
                      // - showing a pointer cursor
                      // - adding a slight lift animation
                      //
                      // This visually tells the user that the row is clickable.
                      className={styles.clickableRow}

                      // This event handler runs when the user clicks anywhere on the row.
                      //
                      // navigate() is a function provided by React Router.
                      // It allows us to programmatically change pages without reloading the browser.
                      //
                      // `/tournament/${tournament.tournamentId}`
                      // builds a dynamic URL such as:
                      //
                      // /tournament/5
                      // /tournament/12
                      // /tournament/42
                      //
                      // The page at that route would typically display the detailed view
                      // of the selected tournament.
                      //
                      // So clicking a row sends the user to that tournament's page.
                      onClick={() => navigate(`/tournament/${tournament.tournamentId}`)}
                    >

                      {/* Table data cells */}
                      <td>{tournament.tournamentId}</td>
                      <td>{tournament.name}</td>
                      <td>{tournament.sportId}</td>
                      <td>{tournament.sportName}</td>
                      <td>{tournament.startDate}</td>
                      <td>{tournament.endDate}</td>

                      {/* Status cell */}
                      <td>

                        {/* // This <span> element displays the tournament's status */}
                        {/* // inside the "Status" column of the table. */}
                        <span

                          // Assign different CSS styles depending on the status value.
                          //
                          // This uses nested ternary operators to choose a CSS class.
                          //
                          // Logic:
                          //
                          // If the status is "Active"
                          // → apply the green "activeStatus" style
                          //
                          // If the status is "Canceled"
                          // → apply the red "canceledStatus" style
                          //
                          // Otherwise
                          // → apply "inactiveStatus"
                          //
                          // "inactiveStatus" typically represents tournaments that are completed.
                          //
                          // Expanded version:
                          //
                          // if (status === "Active") {
                          //     className = styles.activeStatus;
                          // }
                          // else if (status === "Canceled") {
                          //     className = styles.canceledStatus;
                          // }
                          // else {
                          //     className = styles.inactiveStatus;
                          // }
                          className={
                            status === "Active"
                              ? styles.activeStatus
                              : status === "Canceled"
                                ? styles.canceledStatus
                                : styles.inactiveStatus
                          }

                          // This sets the mouse cursor style dynamically.
                          //
                          // If the tournament has NOT ended yet:
                          // → show a pointer cursor (meaning the status is clickable)
                          //
                          // If the tournament has already ended:
                          // → show a "not-allowed" cursor (🚫 symbol)
                          //
                          // This gives users a visual clue about whether they can interact with it.
                          //
                          // This does NOT prevent the click itself —
                          // the actual protection happens inside handleStatusClick().
                          style={{ cursor: endDate >= today ? "pointer" : "not-allowed" }}

                          // This runs when the status text is clicked.
                          //
                          // The function handleStatusClick():
                          // 1️⃣ Stops the click event from triggering the row navigation
                          // 2️⃣ Checks if the user is an admin
                          // 3️⃣ Checks if the tournament has already ended
                          // 4️⃣ If allowed, toggles the tournament status between:
                          //     Active ↔ Canceled
                          // 5️⃣ Sends the update to the backend database
                          //
                          // The "e" parameter represents the click event itself.
                          // It is used inside handleStatusClick() to call e.stopPropagation().
                          //
                          // stopPropagation() prevents the click from also triggering
                          // the table row's navigation behavior.
                          onClick={(e) => handleStatusClick(tournament, e)}
                        >
                          {/* This simply displays the status text to the user */}
                          {status}
                        </span>

                      </td>


                      {/* Winner cell */}
                      <td>{tournament.winner || "TBD"}</td>

                    </tr>
                  );
                })}
            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
};


// Exporting this component so it can be used in routing or other components.
export default TournamentsView;