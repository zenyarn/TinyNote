import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'

const runtimePlatform =
  (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
  navigator.platform ??
  navigator.userAgent

if (/windows/i.test(runtimePlatform)) {
  document.documentElement.classList.add('os-windows')
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
