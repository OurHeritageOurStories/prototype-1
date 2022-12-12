import React from 'react'
import './App.css'
import Parser from 'html-react-parser'
import {
  Link
} from "react-router-dom"

const { useState } = React
const WBK = require('wikibase-sdk')
const superagent = require('superagent')
const wdk = WBK({
  instance: 'http://localhost:8080/http://localhost:80',
  sparqlEndpoint: 'http://localhost:8080/http://localhost:9999/bigdata/namespace/undefined/sparql'
})

export default function Search() {
  const [query, setQuery] = useState('')
  const [displayTNA, setDisplayTNA] = useState([{ title: '' }])
  const [displayOther, setDisplayOther] = useState([{ title: '' }])
  const [displayWiki, setDisplayWiki] = useState([{ s: '', p: '', o: '' }])
  const [isActive, setIsActive] = useState(false)
  const [initQuery, setInitQuery] = useState(false)

  const onInputChange = (event) => {
    setQuery(event.target.value)
  }

  const getData = async () => {
    setInitQuery(true)
    var sparql_query = query.replaceAll(' ', '_')
    if (sparql_query.includes('_')) {
      var sparql_query1 = sparql_query.split('_')[0]
      var sparql_query2 = sparql_query.split('_')[1]
      var sparql_query3 = sparql_query.split('_')[2]
      var sparql_query4 = sparql_query.split('_')[3]
      if (sparql_query4) {
        var sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT DISTINCT ?o (count(?text) as ?count) WHERE { { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparql_query1 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparql_query2 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparql_query3 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparql_query4 + '", "i"))} } GROUP BY ?o ORDER BY DESC(?count)'
      } else if (sparql_query3) {
        var sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT DISTINCT ?o (count(?text) as ?count) WHERE { { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparql_query1 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparql_query2 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparql_query3 + '", "i"))} } GROUP BY ?o ORDER BY DESC(?count)'
      } else {
        var sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT DISTINCT ?o (count(?text) as ?count) WHERE { { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparql_query1 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparql_query2 + '", "i"))} } GROUP BY ?o ORDER BY DESC(?count)'
      }
    } else {
      var sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT DISTINCT ?o (count(?text) as ?count) WHERE { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparql_query + '", "i"))} GROUP BY ?o ORDER BY DESC(?count)'
    }
    var url = wdk.sparqlQuery(sparql)
    try {
      var response = await superagent.get(url)
      var simplifiedResults = WBK.simplify.sparqlResults(response.text)
      setDisplayWiki(simplifiedResults)
    } catch (err) {
      console.log(err)
    }
  }

  function search() {
    getData()
    fetch('http://localhost:8080/https://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode=TNA&sps.searchQuery=' + query)
      .then(response => response.json())
      .then(response => setDisplayTNA(response.records))
    fetch('http://localhost:8080/https://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode=OTH&sps.searchQuery=' + query)
      .then(response => response.json())
      .then(response => setDisplayOther(response.records))
    setIsActive(true)
  }

  function handleClick(id) {
    const Discovery = document.getElementById("Discovery")
    const OHOS = document.getElementById("OHOS")
    if (id === 1 && isActive === true) {
      Discovery.scrollIntoView({ behavior: "smooth" })
    } else if (id === 0 && isActive === true) {
      OHOS.scrollIntoView({ behavior: "smooth" })
    }
  }

  function handleKeyPress (event) {
    if(event.key === 'Enter'){
      search()
    }
  }

  function submitHandler(e) {
    e.preventDefault()
  }

  if (initQuery === false) {
    getData()
  }

  return (
    <div className='App'>
      <div className='Search'>
        <form onSubmit={submitHandler}>
          <label>
            <input id='searchInput' type='text' onChange={onInputChange} onKeyDown={handleKeyPress} />
          </label>
          <button id='searchButton' className='button' type='button' onClick={search}> Search </button>
        </form>
      </div>
      <div id='OHOS'>
        <h1>OHOS</h1>
        <table className='table'>
          <tbody>
            {
              displayWiki.map(item =>
                <tr key=''>
                  <td><Link to={{
                    pathname: `/${item.o.replaceAll('/', '+€$').replaceAll('.', '+$£')}`
                  }} >{item.o.split('/').pop().replaceAll('_', ' ')}</Link>{ }</td>
                  <td>{item.count} results</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <div id='Discovery' className='Discovery' style={{ visibility: isActive ? 'visible' : 'hidden' }}>
        <h1>Discovery</h1>
        <h2>The National Archives</h2>
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
                  <td>{Parser(item.title.link('https://discovery.nationalarchives.gov.uk/details/r/' + query))}</td>
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
              <th>Held by</th>
            </tr>
          </thead>
          <tbody>
            {
              displayOther.map(item =>
                <tr key=''>
                  <td>{Parser(item.title.link('https://discovery.nationalarchives.gov.uk/details/r/' + item.id))}</td>
                  <td>{item.reference}</td>
                  <td>{item.coveringDates}</td>
                  <td>{item.heldBy}</td>
                </tr>
              )
            }
          </tbody>
        </table>
        <br />
        <h2>{Parser('More from Discovery'.link('https://discovery.nationalarchives.gov.uk/results/r?_q=' + query.replaceAll(' ', '+')))}</h2>
      </div>
      <div className='navbar'>
        <a onClick={() => handleClick(0)} style={{ visibility: isActive ? 'visible' : 'hidden' }}>OHOS</a><br />
        <a onClick={() => handleClick(1)} style={{ visibility: isActive ? 'visible' : 'hidden' }}>Discovery</a>
      </div>
    </div>
  )
}
