import React from 'react'
import './App.css'
import Parser from 'html-react-parser'
import {
  useParams,
  Link
} from 'react-router-dom'

const { useState } = React
const WBK = require('wikibase-sdk')
const superagent = require('superagent')
const wdk = WBK({
  instance: 'http://localhost:8080/http://localhost:80',
  sparqlEndpoint: 'http://localhost:8080/http://localhost:9999/bigdata/namespace/undefined/sparql'
})

export default function Result () {
  const [displayWiki, setDisplayWiki] = useState([{ text: '', m: '' }])
  const [displayNumber, setDisplayNumber] = useState([{ count: '??' }])
  var { id } = useParams()
  id = id.replaceAll('+€$', '/').replaceAll('+$£', '.')
  const [isActive, setIsActive] = useState(false)
  const [isNumber, setIsNumber] = useState(false)

  const getData = async () => {
    setIsActive(true)
    const sparql = 'SELECT DISTINCT ?text (group_concat(?mentioned;separator=" ") as ?m)  WHERE { ?s <http://tanc.manchester.ac.uk/mentions> ?mentioned. ?s <http://tanc.manchester.ac.uk/text> ?text. ?s <http://tanc.manchester.ac.uk/mentions> <' + id + '>.} GROUP BY ?text'
    const url = wdk.sparqlQuery(sparql)
    try {
      const response = await superagent.get(url)
      var simplifiedResults = WBK.simplify.sparqlResults(response.text)
      for (var i of simplifiedResults) {
        var words = i.m.split(' ')
        for (var j = 0; j < words.length; j++) {
          words[j] =
            <Link to={{
              pathname: `/${words[j].replaceAll('/', '+€$').replaceAll('.', '+$£')}`
            }}
            >
              {words[j].split('/').pop().replaceAll('_', ' ')}<br />
            </Link>
        }
        i.m = words
      }
      setDisplayWiki(simplifiedResults)
    } catch (err) {
      console.log(err)
    }
  }

  const getNumber = async () => {
    setIsNumber(true)
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

  return (
    <div className='App'>
      <div id='OHOS'>
        <div>
          {displayNumber.map(item =>
            <h1 key={item.id}>
              {Parser(id.split('/').pop().replaceAll('_', ' ').link(id))} ({item.count} results)
            </h1>)}
        </div>
        <table className='table'>
          <tbody>
            {
              displayWiki.map(item =>
                <tr key={item.id}>
                  <div className='preview'>
                    <td>{item.text}</td>
                    <td>{item.m}</td>
                  </div>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <div className='navbar'>
        <Link to={{
          pathname: '/'
        }}
        >Back to Search
        </Link>
      </div>
    </div>
  )
}
