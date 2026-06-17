import { useState } from 'react'
import './App.css'
import { BrowsePage } from './features/browse/BrowsePage'
import { ComparePage } from './features/compare/ComparePage'

type View = 'browse' | 'compare'

function App() {
  const [view, setView] = useState<View>('browse')

  return (
    <main>
      <h1>NBA Stats</h1>

      <nav>
        <button
          type="button"
          onClick={() => setView('browse')}
          aria-current={view === 'browse' ? 'page' : undefined}
        >
          Browse
        </button>
        <button
          type="button"
          onClick={() => setView('compare')}
          aria-current={view === 'compare' ? 'page' : undefined}
        >
          Compare
        </button>
      </nav>

      {/* Both stay mounted; we only hide the inactive one. This preserves their
          state and, crucially, stops Browse from re-fetching every tab switch —
          it fetches once on load instead of on every remount. */}
      <div hidden={view !== 'browse'}>
        <BrowsePage />
      </div>
      <div hidden={view !== 'compare'}>
        <ComparePage />
      </div>
    </main>
  )
}

export default App
