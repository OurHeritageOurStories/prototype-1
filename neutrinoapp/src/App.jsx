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
          path='/'
          element={<Search />}
        />
        <Route
          path='/:id'
          element={<Result />}
        />
      </Routes>
    </Router>
  )
}
