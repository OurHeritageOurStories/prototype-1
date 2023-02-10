import React, { useState } from 'react' // useEffect
import './App.css'
import Parser from 'html-react-parser'
import {
  useParams,
  Link
} from 'react-router-dom'

const WBK = require('wikibase-sdk')
const superagent = require('superagent')
const wdk = WBK({
  instance: 'http://cgdc-observatory.net/',
  sparqlEndpoint: 'http://cgdc-observatory.net/bigdata/namespace/undefined/sparql/'
})

export default function Result () {
  const [displayWiki, setDisplayWiki] = useState([{ text: '', m: '' }])
  const [displayNumber, setDisplayNumber] = useState([{ count: '??' }])
  var { id } = useParams()
  id = 'https://en.wikipedia.org/wiki/' + id
  const [isActive, setIsActive] = useState(false)
  const [isNumber, setIsNumber] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const getData = async () => {
    const sparql = 'SELECT DISTINCT ?text (group_concat(?mentioned;separator=" ") as ?m)  WHERE { ?s <http://tanc.manchester.ac.uk/mentions> ?mentioned. ?s <http://tanc.manchester.ac.uk/text> ?text. ?s <http://tanc.manchester.ac.uk/mentions> <' + id + '>.} GROUP BY ?text'
    const url = wdk.sparqlQuery(sparql)
    try {
      const response = await superagent.get(url)
      var simplifiedResults = WBK.simplify.sparqlResults(response.text)
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
    } catch (err) {
      console.log(err)
    }
  }

  const getNumber = async () => {
    const sparql = 'SELECT (count(?o) as ?count) WHERE { ?s <http://tanc.manchester.ac.uk/text> ?o. ?s <http://tanc.manchester.ac.uk/mentions> <' + id + '>.}'
    const url = wdk.sparqlQuery(sparql)
    try {
      const response = await superagent.get(url)
      var simplifiedResults = WBK.simplify.sparqlResults(response.text)
      setDisplayNumber(simplifiedResults)
    } catch (err) {
      console.log(err)
    }
  }

  if (isActive === false) {
    getData()
  }

  if (isNumber === false) {
    getNumber()
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
