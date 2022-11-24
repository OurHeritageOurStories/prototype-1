import React from 'react'
import './App.css'
import Parser from 'html-react-parser'

const { useState } = React
const WBK = require('wikibase-sdk')
const superagent = require('superagent')
const wdk = WBK({
  instance: 'http://localhost:80',
  sparqlEndpoint: 'http://localhost:9999/bigdata/namespace/undefined/sparql'
})

export default function App () {
  const [query, setQuery] = useState('')
  const [displayTNA, setDisplayTNA] = useState([{ title: '' }])
  const [displayOther, setDisplayOther] = useState([{ title: '' }])
  const [displayWiki, setDisplayWiki] = useState([{ s: '', p: '', o: '' }])
  const [isActive, setIsActive] = useState(false)

  const onInputChange = (event) => {
    setQuery(event.target.value)
  }

  const getData = async () => {
    const sparql = 'SELECT ?s ?p ?o  WHERE { ?s ?p ?o .FILTER (regex(str(?s), "' + query + '", "i") || regex(str(?p), "' + query + '", "i") || regex(str(?o), "' + query + '", "i")) .} LIMIT 100'
    const url = wdk.sparqlQuery(sparql)
    try {
      const response = await superagent.get(url)
      var simplifiedResults = WBK.simplify.sparqlResults(response.text)
      for (var i of simplifiedResults) {
        if (i.s.includes('http') && !i.s.includes('localhost')) {
          i.s = <p>{Parser(i.s.split('/').pop().replaceAll('_', ' ').link(i.s))}</p>
        } else {
          i.s = i.s.split('/').pop().replaceAll('_', ' ')
        }
        i.p = i.p.split(':').pop().split('/').pop().replaceAll('_', ' ')
        if (i.o.includes('http') && !i.o.includes('localhost')) {
          i.o = <p>{Parser(i.o.split('/').pop().replaceAll('_', ' ').link(i.o))}</p>
        } else {
          i.o = i.o.split('/').pop().replaceAll('_', ' ')
        }
      }
      setDisplayWiki(simplifiedResults)
    } catch (err) {
      console.log(err)
    }
  }

  function search () {
    getData()
    fetch('https://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode=TNA&sps.searchQuery=' + query)
      .then(response => response.json())
      .then(response => setDisplayTNA(response.records))
    fetch('https://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode=OTH&sps.searchQuery=' + query)
      .then(response => response.json())
      .then(response => setDisplayOther(response.records))
    setIsActive(true)
  }

  return (
    <div className='App'>
      <div className='Search'>
        <form>
          <label>
            <input type='text' name='query' value={query} onChange={onInputChange} />
          </label>
          <button className='button' type='button' onClick={search}> Search </button>
        </form>
      </div>
      <div className='Discovery' style={{ visibility: isActive ? 'visible' : 'hidden' }}>
        <h1>Discovery</h1>
        <h2>TNA</h2>
        <table className='table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Reference</th>
              <th>Dates</th>
            </tr>
          </thead>
          <tbody>
            {
              displayTNA.map(item =>
                <tr key=''>
                  <td>{Parser(item.title.link('https://discovery.nationalarchives.gov.uk/details/r/' + item.id))}</td>
                  <td>{item.reference}</td>
                  <td>{item.coveringDates}</td>
                </tr>
              )
            }
          </tbody>
        </table>
        <h2>Other Archives</h2>
        <table className='table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Reference</th>
              <th>Dates</th>
            </tr>
          </thead>
          <tbody>
            {
              displayOther.map(item =>
                <tr key=''>
                  <td>{Parser(item.title.link('https://discovery.nationalarchives.gov.uk/details/r/' + item.id))}</td>
                  <td>{item.reference}</td>
                  <td>{item.coveringDates}</td>
                </tr>
              )
            }
          </tbody>
        </table>
        <br />
        <h1>OHOS</h1>
        <table className='table'>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Relationship</th>
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
