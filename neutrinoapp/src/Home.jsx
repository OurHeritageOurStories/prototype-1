import React, { useState } from 'react'
import './App.css'
import { Pagination } from '@material-ui/lab'
import {
  useSearchParams,
  Link
} from 'react-router-dom'

const WBK = require('wikibase-sdk')

export default function Search () {
  const [query, setQuery] = useState('')
  const [displayWiki, setDisplayWiki] = useState([{ s: '', p: '', o: '' }])
  const [displayNumber, setDisplayNumber] = useState([{ count: '??' }])
  const [setOhosActive] = useState(false)
  const [initQuery, setInitQuery] = useState(false)
  const [searchParams] = useSearchParams()

  var pages = searchParams.get('page')
  if (isNaN(pages)) {
    pages = 1
  }
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  var count = Math.ceil(displayNumber[0].count / PER_PAGE)

  const handleChange = (e, p) => {
    window.location = '/?page=' + p
  }

  const onInputChange = (event) => {
    setQuery(event.target.value)
  }

  const getData = async () => {
    count = Math.ceil(displayNumber[0].count / PER_PAGE)
    setInitQuery(true)
    const pageNumber = Math.max(1, pages)
    try {
      fetch('http://localhost:8000/entities?page=' + pages)
        .then(response => response.json())
        .then(response => {
          setDisplayNumber(WBK.simplify.sparqlResults(response.count))
          setDisplayWiki(WBK.simplify.sparqlResults(response))
        })
        .then(response => setOhosActive(true))
        .then(response => setPage(pageNumber))
    } catch (err) {
      console.log(err)
    }
    console.log(displayWiki)
  }

  const search = () => {
    window.location = '/search?page=1&keyword=' + query
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
      <div id='OHOS'>
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
    </div>
  )
}
