import React, { useState } from 'react'
import './App.css'
import Parser from 'html-react-parser'
import { Pagination } from '@material-ui/lab'
import {
  useSearchParams,
  Link
} from 'react-router-dom'

export default function Search () {
  const [query, setQuery] = useState('')
  const [displayTNA, setDisplayTNA] = useState([{ title: '' }])
  const [displayOther, setDisplayOther] = useState([{ title: '' }])
  const [displayWiki, setDisplayWiki] = useState([{ Identifier: { type: '', value: '' }, Title: { type: '', value: '' }, Topics: { type: '', value: '' }, Description: { type: '', value: '' }, URL: { type: '', datatype: '', value: '' } }])
  const [ohosActive, setOhosActive] = useState(false)
  const [discoveryActive, setDiscoveryActive] = useState(false)
  const [initQuery, setInitQuery] = useState(false)
  const [searchParams] = useSearchParams()
  const [pageCount, setPageCount] = useState(1)

  var pages = searchParams.get('page')
  var keyword = searchParams.get('q')
  if (isNaN(pages)) {
    pages = 1
  }

  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const handleChange = (e, p) => {
    window.location = '/search?q=' + keyword + '&page=' + p
  }

  const onInputChange = (event) => {
    setQuery(event.target.value)
  }

  const getData = async () => {
    setInitQuery(true)
    const pageNumber = Math.max(1, pages)
    try {
      fetch('http://ec2-13-40-156-226.eu-west-2.compute.amazonaws.com:5000/api/movingImages?page=' + pages + '&q=' + keyword)
        .then(response => response.json())
        .then(response => {
          setPageCount(Math.ceil(response.total / PER_PAGE))
          setDisplayWiki(response.items)
        })
        .then(response => setOhosActive(true))
        .then(response => setPage(pageNumber))
    } catch (err) {
      console.log(err)
    }
  }

  const getDiscoveryTNA = async () => {
    fetch('http://ec2-13-40-156-226.eu-west-2.compute.amazonaws.com:5000/api/discovery?source=OTH&q=glasgow')
      .then(response => response.json())
      .then(response => setDisplayTNA(response.records))
  }

  const getDiscoveryOTH = async () => {
    fetch('http://ec2-13-40-156-226.eu-west-2.compute.amazonaws.com:5000/api/discovery?source=TNA&q=glasgow')
      .then(response => response.json())
      .then(response => setDisplayOther(response.records))
  }

  const search = async () => {
    await getData()
    await getDiscoveryTNA()
    await getDiscoveryOTH()
    setDiscoveryActive(true)
  }

  const searchRedirect = () => {
    window.location = '/search?page=1&q=' + query
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
                      pathname: `/entity/${Parser(item.Identifier.value)}/`
                    }}
                    >
                      {Parser(item.Title.value.replaceAll('(', '').replaceAll(')', ''))}
                    </Link>{}
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>

        <Pagination
          count={pageCount}
          size='large'
          page={page}
          variant='outlined'
          shape='rounded'
          onChange={handleChange}
        />
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
        <a onClick={() => handleClick(0)}>OHOS</a><br />
        <a onClick={() => handleClick(1)}>TNA</a><br />
        <a onClick={() => handleClick(2)}>Other</a><br />
        <a onClick={() => handleClick(3)}>More</a>
      </div>
    </div>
  )
}