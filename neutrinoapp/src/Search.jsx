import React, { useState } from 'react'
import './App.css'
import Parser from 'html-react-parser'
import { Pagination } from '@material-ui/lab'
import {
  useSearchParams,
  Link
} from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
      justifyContent:"center",
      display:'flex'
    }
  }
}));

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
      var resp = ""
      fetch('http://ec2-13-40-34-76.eu-west-2.compute.amazonaws.com:5000/api/moving-images?page=' + pages + '&q=' + keyword)
        .then(response => {
          resp = response
          return response.json()
        })
        .then(response => {
          if (!resp.ok) {
            window.location.href = '/error/?error='+resp.status+'&text='+resp.statusText+'&message='+response.message
          }
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
    var resp = ""
    fetch('http://ec2-13-40-34-76.eu-west-2.compute.amazonaws.com:5000/api/discovery?source=TNA&q=' + keyword)
      .then(response => {
        resp = response
        return response.json()
      })
      .then(response => {
        if (!resp.ok) {
          window.location.href = '/error/?error='+resp.status+'&text='+resp.statusText+'&message='+response.message
        }
        setDisplayTNA(response.records)
      })
  }

  const getDiscoveryOTH = async () => {
    var resp = ""
    fetch('http://ec2-13-40-34-76.eu-west-2.compute.amazonaws.com:5000/api/discovery?source=OTH&q=' + keyword)
      .then(response => {
        resp = response
        return response.json()
      })
      .then(response => {
        if (!resp.ok) {
          window.location.href = '/error/?error='+resp.status+'&text='+resp.statusText+'&message='+response.message
        }
        setDisplayTNA(response.records)
      })
  }

  const search = async () => {
    await getData()
    await getDiscoveryTNA()
    await getDiscoveryOTH()
    setDiscoveryActive(true)
  }

  const searchRedirect = () => {
    window.location = '/search?q=' + query + '&page=1'
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

  const classes = useStyles();

  return (
    <div className='App'>
      <div className='Search'>
        <form onSubmit={submitHandler}>
          <label>
            <input id='searchInput' type='text' onChange={onInputChange} onKeyDown={handleKeyPress} />
          </label>
          <button className='button' id='searchButton' type='button' onClick={searchRedirect}> Search
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
        <div className={classes.root}>
        <Pagination 
          count={pageCount}
          size='large'
          page={page}
          variant='outlined'
          shape='rounded'
          onChange={handleChange}
        />
        </div>
      </div>
      <div id='Discovery' style={{ visibility: discoveryActive ? 'visible' : 'hidden' }}>
        <h1>Discovery</h1>
        <h2 id='TNA'>The National Archives</h2>
        <table className='table Discovery'>
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
        <table className='table Discovery'>
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
    </div>
  )
}
