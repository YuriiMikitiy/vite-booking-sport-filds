import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './assets/LanguageContext.jsx';   // ← Правильний імпорт


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
    

    {/* <Test/> */}
  </StrictMode>,
)
