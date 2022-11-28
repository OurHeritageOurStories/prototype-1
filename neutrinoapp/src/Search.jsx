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
  const [displayTexts, setDisplayTexts] = useState([{ s: '', p: '', o: '' }])
  const [isActive, setIsActive] = useState(false)

  const onInputChange = (event) => {
    setQuery(event.target.value)
  }

  const getData = async () => {
    const sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT  ?s ?p ?o WHERE  { ?s  ?p  ?o FILTER ( ( regex(str(?s), "' + query + '", "i") || regex(str(?p), "' + query + '", "i") ) || regex(str(?o), "' + query + '", "i") ) FILTER ( ?p NOT IN (tanc:text) )}'
    const url = wdk.sparqlQuery(sparql)
    try {
      const response = await superagent.get(url)
      var simplifiedResults = WBK.simplify.sparqlResults(response.text)
      for (var i of simplifiedResults) {
        if (i.s.indexOf('/:') !== -1) { // only tanc:mentions should do this for now, if this changes, this bit needs to change
          i.s = i.s.split(':').pop().replaceAll('_', ' ')
          i.s = <p>{Parser(i.s.split('/').pop().link('#' + i.s.split('/').pop()))}</p>
        } else if (i.s.indexOf('tanc.manchester.ac.uk') !== -1 && i.s.indexOf('localhost') === -1) {
          i.s = <p>{Parser(i.s.split('/').pop().link('#' + i.s.split('/').pop()))}</p>
        } else if (i.s.indexOf('http') !== -1 && i.s.indexOf('localhost') === -1) {
          i.s = <p>{Parser(i.s.split('/').pop().link(i.s))}</p>
        } else {
          i.s = i.s.split('/').pop().replaceAll('_', ' ')
        }
        i.p = i.p.split(':').pop().split('/').pop().replaceAll('_', ' ')
        if (i.o.indexOf('http') !== -1 && i.o.indexOf('localhost') === -1) {
          i.o = <p>{Parser(i.o.split('/').pop().replaceAll('_', ' ').link(i.o))}</p>
        } else {
          i.o = i.o.split('/').pop().replaceAll('_', ' ')
        }
      }
      setDisplayWiki(simplifiedResults)
    } catch (err) {
      console.log(err)
    }
    try {
      const sparqlTexts = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT ?s ?o WHERE { ?s tanc:text ?o .}'
      const urlTexts = wdk.sparqlQuery(sparqlTexts)
      const responseTexts = await superagent.get(urlTexts)
      var simplifiedTextsResults = WBK.simplify.sparqlResults(responseTexts.text)
      for (var j of simplifiedTextsResults) {
        if (j.s.indexOf('tanc.manchester.ac.uk') !== -1 && j.s.indexOf('localhost') === -1) {
          j.s = <p id={j.s.split('/').pop()}>{Parser(j.s.split('/').pop())}</p>
        } else {
          j.s = j.s.split('/').pop().replaceAll('_', ' ')
        }
      }
      setDisplayTexts(simplifiedTextsResults)
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
      <div style={{ visibility: isActive ? 'visible' : 'hidden' }}>
        <h2>Texts</h2>
        <table className='table'>
          <tbody>
            {
              displayTexts.map(item =>
                <tr key=''>
                  <td>{item.s}</td>
                  <td>{item.o}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <div className='navbar'>
        <a href='#'>Home</a>
      </div>
    </div>
  )
}
