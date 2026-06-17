import { useState } from 'react'
import './App.css'
import { BrowsePage } from './features/browse/BrowsePage'
import { ComparePage } from './features/compare/ComparePage'
import { TeamsPage } from './features/teams/TeamsPage'
import { RecentGamesPage } from './features/games/RecentGamesPage'
import { FavouritesPage } from './features/favourites/FavouritesPage'

type View = 'browse' | 'compare' | 'teams' | 'games' | 'favourites'

const TABS: { id: View; label: string }[] = [
  { id: 'browse', label: 'Browse' },
  { id: 'compare', label: 'Compare' },
  { id: 'teams', label: 'Teams' },
  { id: 'games', label: 'Recent Games' },
  { id: 'favourites', label: 'Favourites' },
]

function App() {
  const [view, setView] = useState<View>('browse')
  // Track which tabs have been opened. A view only mounts (and fetches) once
  // first visited, then stays mounted so its state survives later tab switches.
  // This keeps app load to a single request instead of one per tab.
  const [mounted, setMounted] = useState<Set<View>>(() => new Set<View>(['browse']))

  function openTab(id: View) {
    setView(id)
    setMounted((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }

  return (
    <main>
      <h1>NBA Stats</h1>

      <nav>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => openTab(tab.id)}
            aria-current={view === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div hidden={view !== 'browse'}>{mounted.has('browse') && <BrowsePage />}</div>
      <div hidden={view !== 'compare'}>{mounted.has('compare') && <ComparePage />}</div>
      <div hidden={view !== 'teams'}>{mounted.has('teams') && <TeamsPage />}</div>
      <div hidden={view !== 'games'}>{mounted.has('games') && <RecentGamesPage />}</div>
      <div hidden={view !== 'favourites'}>{mounted.has('favourites') && <FavouritesPage />}</div>
    </main>
  )
}

export default App
