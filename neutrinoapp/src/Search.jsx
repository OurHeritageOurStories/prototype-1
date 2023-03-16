import React, { useState } from 'react'
import './App.css'
import Parser from 'html-react-parser'
import { Pagination } from '@material-ui/lab'
import {
  useSearchParams,
  Link
} from 'react-router-dom'

// const WBK = require('wikibase-sdk')

export default function Search () {
  // var testvar = 'testtt'
  const [query, setQuery] = useState('')
  const [displayTNA, setDisplayTNA] = useState([{ title: '' }])
  const [displayOther, setDisplayOther] = useState([{ title: '' }])
  // const [displayWiki, setDisplayWiki] = useState([{ s: '', p: '', o: '' }])
  const [displayWiki, setDisplayWiki] = useState([{ title: { type: '', value: '' }, topics: { type: '', value: '' } }])
  // const [displayNumber, setDisplayNumber] = useState({ value: '??' })
  const [displayNumber, setDisplayNumber] = useState(0)
  const [ohosActive, setOhosActive] = useState(false)
  const [discoveryActive, setDiscoveryActive] = useState(false)
  const [initQuery, setInitQuery] = useState(false)
  const [searchParams] = useSearchParams()
  const [pageCount, setPageCount] = useState(1)

  var pages = searchParams.get('page')
  var keyword = searchParams.get('keyword')
  keyword = keyword.replace(' ', '|')
  if (isNaN(pages)) {
    pages = 1
  }

  const [page, setPage] = useState(1)
  // const PER_PAGE = 10

  // var count = Math.ceil(10 / PER_PAGE)
  // let count = 289

  const handleChange = (e, p) => {
    window.location = '/?keyword=' + keyword + '&page=' + p
  }

  const onInputChange = (event) => {
    setQuery(event.target.value)
  }

  /*
  function updateCount (newCount) {
    return new Promise((resolve, reject) => {
      // count = newCount
      count = 1212
      console.log('dkjkkkkk')
      resolve('yay')
    })
  }

function getData() {
  var getDataPromise = new Promise(function (resolve, reject) {
    setInitQuery(true)
    const pageNumber = Math.max(1, pages)
    try {
      fetch('http://ec2-13-40-156-226.eu-west-2.compute.amazonaws.com:5000/api/movingImages?page=' + pages + '&keyword=' + keyword)
        .then(testvar = 'yyyyy')
        .then(response => response.json())
        .then(response => {
          setDisplayWiki(response.results.bindings)
        })
        .then(response => setOhosActive(true))
        .then(response => setPage(pageNumber))
    } catch (err) {
      console.log(err)
    }
    count = 69
    resolve(999)
    return pr
  })
  return getDataPromise
} */
  const getData = async () => {
    // let countNew = 9999
    // count = 99999
    // console.log("alsdkjflaskdjf")
    // count = Math.ceil(displayNumber.count/PER_PAGE)
    setInitQuery(true)
    const pageNumber = Math.max(1, pages)
    try {
      fetch('http://ec2-13-40-156-226.eu-west-2.compute.amazonaws.com:5000/api/movingImages?page=' + pages + '&keyword=' + keyword)
        // .then(testvar = 'yyyyy')
        .then(response => response.json())
        .then(response => {
          setPageCount(Math.ceil((parseInt(response.count.results.bindings[0].count.value))/10))
          // setDisplayNumber(parseInt(response.count.results.bindings[0].count))
          setDisplayWiki(response.results.bindings)
          // countNew = parseInt(response.count.results.bindings[0].count)
          // setPageCount(88)
        })
        .then(response => setOhosActive(true))
        .then(response => setPage(pageNumber))
        // .then(testvar == "ha")
        // .then(updateCount(parseInt(response.count.results.bindings[0].count)))
        // .then(testvar = "kdkdkdk")
        // .then(updateCount(parseInt(response.count.results.bindings[0].count.value)))
        // .then(response => {
        //  //count = Math.ceil(parseInt(response.count.bindings[0].count.value)/ PER_PAGE)
        //  count = 712
        // })
    } catch (err) {
      console.log(err)
    }
    // testvar = 'ldkaj'
    // count = countNew
    // count = 76
    // setDisplayNumber(987)
    //  .then(setPageCount(displayNumber))
    // count = Math.ceil(displayNumber/PER_PAGE)
    // setPageCount(Math.ceil(displayNumber/PER_PAGE))
    // setPageCount(displayNumber)
    // setPageCount(7)
  }

  const search = () => {
    setDisplayNumber({ value: '??' })
    getData()
    // let promise = this.getData();
    // promise.then(
    //  (result)=>{
    //    count = result
    //  }
    // )

    // getData().then(
    //  function (result) {
    //    count = 8764
    //    testvar = 'bum'
    //  }
    // )
    // testvar = 'silly'
    // setDisplayNumber = 42069

    fetch('http://ec2-13-40-156-226.eu-west-2.compute.amazonaws.com:5000/api/discovery?source=OTH&keyword=' + keyword)
      .then(response => response.json())
      .then(response => setDisplayTNA(response.records))
    fetch('http://ec2-13-40-156-226.eu-west-2.compute.amazonaws.com:5000/api/discovery?source=TNA&keyword=' + keyword)
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
          <button className='button' type='button' onClick={searchRedirect}> Seaaarch
          </button>
        </form>
      </div>
      <div id='OHOS' style={{ visibility: ohosActive ? 'visible' : 'hidden' }}>
        <h1>dafdsfsdfuuuuuu</h1> {pageCount}
        <table className='table'>
          <tbody>
            {
              displayWiki.map((item, index) =>
                <tr key={index}>
                  <td>
                    <Link to={{
                      pathname: `/entity/${item.title.value}/`
                    }}
                    >
                      {item.title.value}
                    </Link>{}
                  </td>
                </tr>
              )
            }
            <Pagination
              count={pageCount}
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
        <h1>Discoveasdfry</h1>
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
