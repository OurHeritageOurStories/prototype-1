import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom'
import Search from './Search'
import Result from './Result'

export default function App () {
  return (
    <Router basename='/'>
      <Routes>
        <Route
          path='/:page'
          element={<Search />}
        />
        <Route
          path='/'
          element={<Search />}
        />
        <Route
          path='Result/:id/:page'
          element={<Result />}
        />
        <Route
          path='Result/:id'
          element={<Result />}
        />
      </Routes>
    </Router>
  )
}
