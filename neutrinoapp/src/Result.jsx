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
  instance: 'http://localhost:80',
  sparqlEndpoint: 'http://localhost:9999/bigdata/namespace/undefined/sparql'
})

export default function Result () {
  const [displayWiki, setDisplayWiki] = useState([{ text: '', m: '' }])
  const [displayNumber, setDisplayNumber] = useState([{ count: '??' }])
  var { id } = useParams()
  var { pages } = useParams()
  const idParam = id
  id = 'https://en.wikipedia.org/wiki/' + id
  const [isActive, setIsActive] = useState(false)
  const [isNumber, setIsNumber] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const count = Math.ceil(displayNumber[0].count / PER_PAGE)
  const dataPagination = usePagination(displayWiki, PER_PAGE)

  const handleChange = (e, p) => {
    window.location = '/Result/' + idParam + '/' + p
  }

  const getData = async () => {
    if (isNumber === false) {
      getNumber()
    }
    console.log(displayNumber)
    if (isNaN(pages)) {
      pages = 1
    }
    const pageNumber = Math.max(1, pages)
    const offset = (pageNumber - 1) * PER_PAGE
    const sparql = 'SELECT DISTINCT ?text (group_concat(?mentioned;separator=" ") as ?m)  WHERE { ?s <http://tanc.manchester.ac.uk/mentions> ?mentioned. ?s <http://tanc.manchester.ac.uk/text> ?text. ?s <http://tanc.manchester.ac.uk/mentions> <' + id + '>.} GROUP BY ?text ORDER BY ?text LIMIT ' + PER_PAGE + ' OFFSET ' + offset
    const url = wdk.sparqlQuery(sparql)
    try {
      fetch('http://localhost:9090/SPARQL/sparql', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
      })
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
                    pathname: `/Result/${words[j].split('/').pop()}/1`
                  }}
                  onClick={newPage}
                >
                  {words[j].split('/').pop().replaceAll('_', ' ')}<br />
                </Link>
            }
            i.m = words
          }
          setDisplayWiki(simplifiedResults)
          setIsReady(true)
      	  setPage(pageNumber)
      	  setIsActive(true)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const getNumber = async () => {
    setIsNumber(true)
    const sparql = 'SELECT (count(?o) as ?count) WHERE { ?s <http://tanc.manchester.ac.uk/text> ?o. ?s <http://tanc.manchester.ac.uk/mentions> <' + id + '>.}'
    const url = wdk.sparqlQuery(sparql)
    try {
      fetch('http://localhost:9090/SPARQL/sparql', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
      })
        .then(response => response.json())
        .then(response => setDisplayNumber(WBK.simplify.sparqlResults(response)))
        .then(response => setIsNumber(true))
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
            dataPagination.currentData().map(item =>
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
