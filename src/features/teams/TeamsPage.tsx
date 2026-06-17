import { useTeams } from "../../hooks/useTeams";
import styles from "./TeamsPage.module.css";

// The API returns 45 teams, including 15 defunct franchises (and a legacy
// duplicate "Denver Nuggets") that have a blank conference/division. We show the
// 30 active NBA teams, grouped by conference and division.
const CONFERENCES = ["East", "West"] as const;

export function TeamsPage() {
  const state = useTeams();

  if (state.status === "idle") return null; // useTeams is always enabled
  if (state.status === "loading") return <p className={styles.hint}>Loading teams…</p>;
  if (state.status === "error") {
    return <p role="alert">Couldn’t load teams: {state.error.message}</p>;
  }

  const active = state.data.filter((team) => team.conference !== "");

  return (
    <div>
      <h2>Teams</h2>
      {CONFERENCES.map((conference) => {
        const conferenceTeams = active.filter((t) => t.conference === conference);
        const divisions = [...new Set(conferenceTeams.map((t) => t.division))].sort();

        return (
          <section key={conference} className={styles.conference}>
            <h3>{conference === "East" ? "Eastern" : "Western"} Conference</h3>
            {divisions.map((division) => (
              <div key={division}>
                <h4>{division}</h4>
                <ul className={styles.teams}>
                  {conferenceTeams
                    .filter((t) => t.division === division)
                    .map((team) => (
                      <li key={team.id} className={styles.team}>
                        {team.full_name} ({team.abbreviation})
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
