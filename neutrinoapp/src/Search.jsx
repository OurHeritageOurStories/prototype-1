import React, { useState } from 'react'
import './App.css'
import Parser from 'html-react-parser'
import { Pagination } from '@material-ui/lab'
import {
  useSearchParams,
  useParams,
  Link
} from 'react-router-dom'

const WBK = require('wikibase-sdk')

export default function Search () {
  const [query, setQuery] = useState('')
  const [displayTNA, setDisplayTNA] = useState([{ title: '' }])
  const [displayOther, setDisplayOther] = useState([{ title: '' }])
  const [displayWiki, setDisplayWiki] = useState([{ s: '', p: '', o: '' }])
  const [displayNumber, setDisplayNumber] = useState([{ count: '??' }])
  const [ohosActive, setOhosActive] = useState(false)
  const [discoveryActive, setDiscoveryActive] = useState(false)
  const [initQuery, setInitQuery] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  
  var pages = searchParams.get('page')
  var keyword = searchParams.get('keyword')
  keyword = keyword.replace(' ','|')
  if (isNaN(pages)) {
    pages = 1
  }

  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  var count = Math.ceil(10 / PER_PAGE)

  const handleChange = (e, p) => {
    window.location = '/?keyword=' + keyword + '&page=' + p
  }

  const onInputChange = (event) => {
    setQuery(event.target.value)
  }

  const getData = async () => {
    count = Math.ceil(displayNumber[0].count / PER_PAGE)
    setInitQuery(true)
    const pageNumber = Math.max(1, pages)
    try {
      fetch('http://localhost:8000/entities?page='+pages+"&keyword="+keyword)
        .then(response => response.json())
        .then(response => {setDisplayNumber(WBK.simplify.sparqlResults(response['count'])), setDisplayWiki(WBK.simplify.sparqlResults(response))})
        .then(response => setOhosActive(true))
        .then(response => setPage(pageNumber))
    } catch (err) {
      console.log(err)
    }
  }

  const search = () => {
    setDisplayNumber([{ count: '??' }])
    getData()

    fetch('http://localhost:8000/discovery?source=OTH&keyword=' + keyword)
      .then(response => response.json())
      .then(response => setDisplayTNA(response.records))
    fetch('http://localhost:8000/discovery?source=TNA&keyword=' + keyword)
      .then(response => response.json())
      .then(response => setDisplayOther(response.records))
    setDiscoveryActive(true)
  }

  const searchRedirect = () => {
    window.location = '/search?page=1&keyword=' + query
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
      searchRedirect()
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
  }

  if (initQuery === false) {
    search()
  }

  return (
    <div className='App'>
      <div className='Search'>
        <form onSubmit={submitHandler}>
          <label>
            <input id='searchInput' type='text' onChange={onInputChange} onKeyDown={handleKeyPress} />
          </label>
          <button className='button' type='button' onClick={searchRedirect}> Search
          </button>
        </form>
      </div>
      <div id='OHOS' style={{ visibility: ohosActive ? 'visible' : 'hidden' }}>
        <h1>OHOS</h1>
        <table className='table'>
          <tbody>
            {
              displayWiki.map((item, index) =>
                <tr key={index}>
                  <td>
                    <Link to={{
                      pathname: `/entity/${item.o.split('/').pop()}/`
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
        <h2 id='more'>{Parser('More from Discovery'.link('https://discovery.nationalarchives.gov.uk/results/r?_q=' + keyword.replaceAll(' ', '+')))}</h2>
      </div>
      <div className='navbar'>
        <a onClick={() => window.location = '/'}>HOME</a><br />
        <a onClick={() => handleClick(0)}>OHOS</a><br />
        <a onClick={() => handleClick(1)}>TNA</a><br />
        <a onClick={() => handleClick(2)}>Other</a><br />
        <a onClick={() => handleClick(3)}>More</a>
      </div>
    </div>
  )
}
