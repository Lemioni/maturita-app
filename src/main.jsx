import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (typeof window !== 'undefined') {
  const tinyNotes = [
    'Když nevíš, začni definicí pojmu.',
    '10 minut denně > 2 hodiny jednou týdně.',
    'Maturita je sprint i maraton. Dýchej 🙂',
  ]

  const note = tinyNotes[Math.floor(Math.random() * tinyNotes.length)]
  console.info(`🫶 Maturita-app mini easter egg: ${note}`)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
