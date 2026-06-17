import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getPlayers } from './api/players.ts'
import { ApiError } from './api/client.ts'

// --- TEMP (Phase 1): prove the API chain end-to-end. Remove in Phase 2. ---
void (async () => {
  try {
    const { data } = await getPlayers()
    console.log(`Loaded ${data.length} players:`, data)
  } catch (err) {
    if (err instanceof ApiError) {
      console.error(`API error [${err.kind}]:`, err.message)
    } else {
      console.error('Unexpected error:', err)
    }
  }
})()
// --- end TEMP ---

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
