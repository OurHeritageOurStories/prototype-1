import React from 'react'
import './App.css'

const { useState } = React

export default function App () {
  const [query, setQuery] = useState('')
  const [displayData, setDisplayData] = useState([{ 'title': '' }])

  const onInputChange = (event) => {
    setQuery(event.target.value)
  }

  function search () {
    fetch('https://discovery.nationalarchives.gov.uk/API/search/v1/records?sps.searchQuery=' + query)
      .then(response => response.json())
      .then(response => setDisplayData(response.records))
  }

  return (
    <div className='App'>
      <div className='Search'>
        <form>
          <label>
            Query:
            <input type='text' name='query' value={query} onChange={onInputChange} />
          </label>
          <button className='button' type='button' onClick={search}> Search </button>
        </form>
      </div>
      <div className='Discovery'>
        <table className='table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Context</th>
            </tr>
          </thead>
          <tbody>
            {
              displayData.map(item =>
                <tr key=''>
                  <td>{item.title}</td>
                  <td>{item.context}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
