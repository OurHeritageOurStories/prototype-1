import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom'
import Home from './Home'
import Search from './Search'
import Result from './Result'
import Page_404 from './Page_404'

export default function App () {
  return (
    <Router basename='/'>
      <Routes>
        <Route
          path='*'
          element={<Page_404 />}
        />
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/search'
          element={<Search />}
        />
        <Route
          path='/entity/:id'
          element={<Result />}
        />
      </Routes>
    </Router>
  )
}
