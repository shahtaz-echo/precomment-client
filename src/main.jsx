import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Provider } from 'react-redux'
import { store } from './store.js'

import App from './App.jsx'

import '@/assets/styles/index.css'
import '@/assets/styles/layout.css'
import '@/assets/styles/typography.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
