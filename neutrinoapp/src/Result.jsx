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
const superagent = require('superagent')
const wdk = WBK({
  instance: 'http://cgdc-observatory.net',
  sparqlEndpoint: 'http://cgdc-observatory.net/bigdata/namespace/undefined/sparql'
})

export default function Result () {
  const [displayWiki, setDisplayWiki] = useState([{ text: '', m: '' }])
  const [displayNumber, setDisplayNumber] = useState([{ count: '??' }])
  const [searchParams, setSearchParams] = useSearchParams();
  var { id } = useParams()
  var pages = searchParams.get('page')
  if (isNaN(pages)) {
    pages = 1
  }
  const idParam = id
  id = 'https://en.wikipedia.org/wiki/' + id
  const [isActive, setIsActive] = useState(false)
  const [isNumber, setIsNumber] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const count = Math.ceil(displayNumber[0].count / PER_PAGE)
  
  const handleChange = (e, p) => {
    window.location = '/entity/' + idParam + '/?page=' + p
  }

  const getData = async () => {
    if (isNaN(pages)) {
      pages = 1
    }
    const pageNumber = Math.max(1, pages)
    try {
      fetch('http://localhost:8000/entities/' + idParam + '?page='+pages)
        .then(response => response.json())
        .then(response => {
          setIsActive(true)
          var simplifiedResults = WBK.simplify.sparqlResults(response)
          for (var i of simplifiedResults) {
            var words = i.m.split(' ')
            for (var j = 0; j < words.length; j++) {
              words[j] =
                <Link
                  to={{
                    pathname: `/entity/${words[j].split('/').pop()}/`
                  }}
                  onClick={newPage}
                >
                  {words[j].split('/').pop().replaceAll('_', ' ')}<br />
                </Link>
            }
            i.m = words
          }
          setDisplayWiki(simplifiedResults)
          setDisplayNumber(WBK.simplify.sparqlResults(response['count']))
          setIsReady(true)
          setPage(pageNumber)
          setIsActive(true)
        })
    } catch (err) {
      console.log(err)
    }
  }

  if (isActive === false) {
    getData()
  }

  const newPage = () => {
    setIsReady(false)
    setIsNumber(false)
    setIsActive(false)
  }

  const changeClass = event => {
    event.currentTarget.classList.toggle('rightDivOpen')
  }

  return (
    <div className='App'>
      <div id='OHOS'>
        <div>
          {displayNumber.map(item =>
            <h1 key={item.id}>
              {Parser(id.split('/').pop().replaceAll('_', ' ').link(id))} ({item.count} results)
            </h1>)}
        </div>
        <table className='table' style={{ visibility: isReady ? 'visible' : 'hidden' }}>
          {
            displayWiki.map(item =>
              <tr key={item.id}>
                <div>
                  <td className='left'><details><summary>{item.text.split(' ').slice(0, 150).join(' ')}</summary>{item.text.split(' ').slice(150).join(' ')}</details><br /><b>Source</b>: unknown</td>
                  <td className='right'>Related:<br /><div className='rightDiv' onClick={changeClass}>{item.m}</div></td>
                </div>
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
        </table>
      </div>
      <div className='navbar'>
        <Link to={{
          pathname: '/'
        }}
        >To Search
        </Link>
      </div>
    </div>
  )
}
