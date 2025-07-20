import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { FirebaseProvider } from './context/firebase.jsx'
import { AreaSelectedProvider } from './context/AreaSelected.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FirebaseProvider>
        <AreaSelectedProvider>
          <App />
        </AreaSelectedProvider>
      </FirebaseProvider>
    </BrowserRouter>
  </StrictMode>
)

// Recommendation: Keep StrictMode during development, but you can remove it for production if you prefer.