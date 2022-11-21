import React from 'react'
import './App.css'

const { useState } = React
const WBK = require('wikibase-sdk')
const superagent = require('superagent')
const wdk = WBK({
  instance: 'http://localhost:80',
  sparqlEndpoint: 'http://localhost:9999/bigdata/namespace/undefined/sparql'
})

export default function App () {
  const [query, setQuery] = useState('')
  const [displayData, setDisplayData] = useState([{ title: '' }])
  const [displayWiki, setDisplayWiki] = useState([{ s: '', p: '', o: '' }])

  const onInputChange = (event) => {
    setQuery(event.target.value)
  }

  const getData = async () => {
    const sparql = 'SELECT ?s ?p ?o  WHERE { ?s ?p ?o .FILTER regex(str(?s), "' + query + '") .} LIMIT 20'
    const url = wdk.sparqlQuery(sparql)
    try {
      const response = await superagent.get(url)
      const simplifiedResults = WBK.simplify.sparqlResults(response.text)
      setDisplayWiki(simplifiedResults)
    } catch (err) {
      console.log(err)
    }
  }

  function search () {
    getData()
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
        <table className='table'>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Predicate</th>
              <th>Object</th>
            </tr>
          </thead>
          <tbody>
            {
              displayWiki.map(item =>
                <tr key=''>
                  <td>{item.s}</td>
                  <td>{item.p}</td>
                  <td>{item.o}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
