import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './assets/LanguageContext.jsx';   // ← Правильний імпорт
import { ToastProvider } from './context/ToastContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </LanguageProvider>
    

    {/* <Test/> */}
  </StrictMode>,
)
