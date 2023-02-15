import React, { useState } from 'react'
import './App.css'
import Parser from 'html-react-parser'
import { Pagination } from '@material-ui/lab'
import usePagination from './Pagination'
import {
  useParams,
  Link
} from 'react-router-dom'

const WBK = require('wikibase-sdk')
const superagent = require('superagent')
const wdk = WBK({
  instance: 'http://cgdc-observatory.net',
  sparqlEndpoint: 'http://cgdc-observatory.net/bigdata/namespace/undefined/sparql'
})

export default function Search () {
  const [query, setQuery] = useState('')
  const [displayTNA, setDisplayTNA] = useState([{ title: '' }])
  const [displayOther, setDisplayOther] = useState([{ title: '' }])
  const [displayWiki, setDisplayWiki] = useState([{ s: '', p: '', o: '' }])
  const [displayNumber, setDisplayNumber] = useState([{ count: '??' }])
  const [ohosActive, setOhosActive] = useState(false)
  const [discoveryActive, setDiscoveryActive] = useState(false)
  const [initQuery, setInitQuery] = useState(false)
  const [isNumber, setIsNumber] = useState(false)
  var { pages } = useParams()
  if (isNaN(pages)) {
    pages = 1
  }

  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const count = Math.ceil(displayNumber[0].count / PER_PAGE)
  const dataPagination = usePagination(displayWiki, PER_PAGE)

  const handleChange = (e, p) => {
    window.location = '/' + p
  }

  const onInputChange = (event) => {
    setQuery(event.target.value)
  }

  const getNumber = async () => {
    setIsNumber(true)
    var sparqlQuery = query.replaceAll(' ', '_')
    var sparql = ''
    if (sparqlQuery.includes('_')) {
      var sparqlQuery1 = sparqlQuery.split('_')[0]
      var sparqlQuery2 = sparqlQuery.split('_')[1]
      var sparqlQuery3 = sparqlQuery.split('_')[2]
      var sparqlQuery4 = sparqlQuery.split('_')[3]
      if (sparqlQuery4) {
        sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT (count(*) as ?count) WHERE {SELECT DISTINCT ?o (count(?text) as ?count) WHERE { { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery1 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery2 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery3 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery4 + '", "i"))} } GROUP BY ?o ORDER BY DESC(?count)}'
      } else if (sparqlQuery3) {
        sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT (count(*) as ?count) WHERE {SELECT DISTINCT ?o (count(?text) as ?count) WHERE { { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery1 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery2 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery3 + '", "i"))} } GROUP BY ?o ORDER BY DESC(?count)}'
      } else {
        sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT (count(*) as ?count) WHERE {SELECT DISTINCT ?o (count(?text) as ?count) WHERE { { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery1 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery2 + '", "i"))} } GROUP BY ?o ORDER BY DESC(?count)}'
      }
    } else {
      sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT (count(*) as ?count) WHERE {SELECT DISTINCT ?o (count(?text) as ?count) WHERE { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery + '", "i"))} GROUP BY ?o ORDER BY DESC(?count)}'
    }
    const url = wdk.sparqlQuery(sparql)
    try {
      const response = await superagent.get(url)
      var simplifiedResults = WBK.simplify.sparqlResults(response.text)
      setDisplayNumber(simplifiedResults)
    } catch (err) {
      console.log(err)
    }
  }

  const getData = async () => {
    if (isNumber === false) {
      getNumber()
    }
    setInitQuery(true)
    const pageNumber = Math.max(1, pages)
    const offset = (pageNumber - 1) * PER_PAGE
    var sparqlQuery = query.replaceAll(' ', '_')
    var sparql = ''
    if (sparqlQuery.includes('_')) {
      var sparqlQuery1 = sparqlQuery.split('_')[0]
      var sparqlQuery2 = sparqlQuery.split('_')[1]
      var sparqlQuery3 = sparqlQuery.split('_')[2]
      var sparqlQuery4 = sparqlQuery.split('_')[3]
      if (sparqlQuery4) {
        sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT DISTINCT ?o (count(?text) as ?count) WHERE { { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery1 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery2 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery3 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery4 + '", "i"))} } GROUP BY ?o ORDER BY DESC(?count)'
      } else if (sparqlQuery3) {
        sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT DISTINCT ?o (count(?text) as ?count) WHERE { { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery1 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery2 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery3 + '", "i"))} } GROUP BY ?o ORDER BY DESC(?count)'
      } else {
        sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT DISTINCT ?o (count(?text) as ?count) WHERE { { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery1 + '", "i"))} UNION { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery2 + '", "i"))} } GROUP BY ?o ORDER BY DESC(?count)'
      }
    } else {
      sparql = 'prefix tanc: <http://tanc.manchester.ac.uk/> SELECT DISTINCT ?o (count(?text) as ?count) WHERE { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), "' + sparqlQuery + '", "i"))} GROUP BY ?o ORDER BY DESC(?count)'
    }
    sparql = sparql + ' LIMIT ' + PER_PAGE + ' OFFSET ' + offset
    var url = wdk.sparqlQuery(sparql)
    try {
      fetch('http://localhost:9090/SPARQL/sparql', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
      })
        .then(response => response.json())
        .then(response => setDisplayWiki(WBK.simplify.sparqlResults(response)))
        .then(response => setOhosActive(true))
        .then(response => setPage(pageNumber))
    } catch (err) {
      console.log(err)
    }
  }

  const search = () => {
    setIsNumber(false)
    setDisplayNumber([{ count: '??' }])
    pages = 1
    if (isNumber === false) {
      getNumber()
    }
    getData()

    fetch('http://localhost:9090/TNA/' + query)
      .then(response => response.json())
      .then(response => setDisplayTNA(response.records))
    fetch('http://localhost:9090/OTH/' + query)
      .then(response => response.json())
      .then(response => setDisplayOther(response.records))
    setDiscoveryActive(true)
  }

  function handleClick (id) {
    const OHOS = document.getElementById('OHOS')
    const TNA = document.getElementById('TNA')
    const other = document.getElementById('other')
    const more = document.getElementById('more')
    if (id === 0 && discoveryActive === true) {
      OHOS.scrollIntoView({ behavior: 'smooth' })
    } else if (id === 1 && discoveryActive === true) {
      TNA.scrollIntoView({ behavior: 'smooth' })
    } else if (id === 2 && discoveryActive === true) {
      other.scrollIntoView({ behavior: 'smooth' })
    } else if (id === 3 && discoveryActive === true) {
      more.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      search()
    }
  }

  const submitHandler = (e) => {
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
          <button className='button' type='button' onClick={search}> Search
          </button>
        </form>
      </div>
      <div id='OHOS' style={{ visibility: ohosActive ? 'visible' : 'hidden' }}>
        <h1>OHOS</h1>
        <table className='table'>
          <tbody>
            {
              dataPagination.currentData().map((item, index) =>
                <tr key={index}>
                  <td>
                    <Link to={{
                      pathname: `Result/${item.o.split('/').pop()}/1`
                    }}
                    >
                      {item.o.split('/').pop().replaceAll('_', ' ')}
                    </Link>{}
                  </td>
                  <td>{item.count} results</td>
                </tr>
              )
            }
            <Pagination
              count={count}
              size='large'
              page={page}
              variant='outlined'
              shape='rounded'
              onChange={handleChange}
            />
          </tbody>
        </table>
      </div>
      <div id='Discovery' className='Discovery' style={{ visibility: discoveryActive ? 'visible' : 'hidden' }}>
        <h1>Discovery</h1>
        <h2 id='TNA'>The National Archives</h2>
        <table className='table'>
          <tbody>
            {
              displayTNA.map((item, index) =>
                <tr key={index}>
                  <p className='centre'><details><summary>{Parser(item.title.link('https://discovery.nationalarchives.gov.uk/details/r/' + item.id))}<br /> <b>Reference:</b> {item.reference}<br /><b>Dates:</b> {item.coveringDates}</summary><b>Context:</b> {item.context}<br /><b>Department:</b> {item.department}<br /><b>Taxonomies:</b> {item.taxonomies}<br /><b>Catalogue level:</b> {item.catalogueLevel}<br /> <b>ID:</b> {item.id}<br /><b>Relevance to query:</b> {item.score}</details></p>
                </tr>
              )
            }
          </tbody>
        </table>
        <h2 id='other'>Other Archives</h2>
        <table className='table'>
          <tbody>
            {
              displayOther.map((item, index) =>
                <tr key={index}>
                  <p className='centre'><details><summary>{Parser(item.title.link('https://discovery.nationalarchives.gov.uk/details/r/' + item.id))}<br /> <b>Reference:</b> {item.reference}<br /><b>Dates:</b> {item.coveringDates}<br /><b>Held by:</b> {item.heldBy}</summary><b>Context:</b> {item.context}<br /><b>Catalogue level:</b> {item.catalogueLevel}<br /> <b>ID:</b> {item.id}<br /><b>Relevance to query:</b> {item.score}</details></p>
                </tr>
              )
            }
          </tbody>
        </table>
        <br />
        <h2 id='more'>{Parser('More from Discovery'.link('https://discovery.nationalarchives.gov.uk/results/r?_q=' + query.replaceAll(' ', '+')))}</h2>
      </div>
      <div className='navbar'>
        <a onClick={() => handleClick(0)} style={{ visibility: discoveryActive ? 'visible' : 'hidden' }}>OHOS</a><br />
        <a onClick={() => handleClick(1)} style={{ visibility: discoveryActive ? 'visible' : 'hidden' }}>TNA</a><br />
        <a onClick={() => handleClick(2)} style={{ visibility: discoveryActive ? 'visible' : 'hidden' }}>Other</a><br />
        <a onClick={() => handleClick(3)} style={{ visibility: discoveryActive ? 'visible' : 'hidden' }}>More</a>
      </div>
    </div>
  )
}
