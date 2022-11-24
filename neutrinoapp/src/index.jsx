import React from 'react'
import { createRoot } from 'react-dom/client'
import Search from './Search'

createRoot(
  document.getElementById('root')
)
  .render(
    <React.StrictMode>
      <Search />
    </React.StrictMode>
  )
