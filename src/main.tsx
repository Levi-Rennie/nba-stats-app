import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FavouritesProvider } from './features/favourites/FavouritesProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavouritesProvider>
      <App />
    </FavouritesProvider>
  </StrictMode>,
)
