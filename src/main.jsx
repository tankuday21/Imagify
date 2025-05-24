import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'

// Enable React's Strict Mode only in development to highlight potential problems
const StrictModeWrapper = import.meta.env.DEV
  ? React.StrictMode
  : React.Fragment;

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictModeWrapper>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictModeWrapper>
)