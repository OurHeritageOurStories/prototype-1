import React, { useState } from 'react'
import {
  useSearchParams,
  Link
} from 'react-router-dom'
import './App.css'

export default function Search () {
  const [searchParams] = useSearchParams()
  var error = searchParams.get('error')
  var text = searchParams.get('text')
  var message = searchParams.get('message')
 
  return (
    <div className='App'>
      <div id='error'>
        <h1>{error}</h1>
        <h2>{text}</h2>
        <p>
            {message}
        </p>
      </div>
    </div>
  )
}
