import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ActingAsProvider } from './providers/ActingAsProvider.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ActingAsProvider>
        <App />
      </ActingAsProvider>
    </QueryProvider>
  </StrictMode>,
)
