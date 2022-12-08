import React from 'react'
import './App.css'
import Parser from 'html-react-parser'
import {
  useParams,
  Link
} from "react-router-dom"

const { useState } = React
const WBK = require('wikibase-sdk')
const superagent = require('superagent')
const wdk = WBK({
  instance: 'http://localhost:8080/http://localhost:80',
  sparqlEndpoint: 'http://localhost:8080/http://localhost:9999/bigdata/namespace/undefined/sparql'
})

export default function Result() {
  const [displayWiki, setDisplayWiki] = useState([{ s: '', p: '', o: '' }])
  var { id } = useParams()
  var id = id.replaceAll('+€$', '/').replaceAll('+$£', '.')
  const [isActive, setIsActive] = useState(false)

  const getData = async () => {
    const sparql = 'SELECT DISTINCT ?o WHERE { ?s <http://tanc.manchester.ac.uk/text> ?o. ?s <http://tanc.manchester.ac.uk/mentions> <' + id + '>.}'
    const url = wdk.sparqlQuery(sparql)
    try {
      const response = await superagent.get(url)
      var simplifiedResults = WBK.simplify.sparqlResults(response.text)
      setDisplayWiki(simplifiedResults)
      setIsActive(true)
    } catch (err) {
      console.log(err)
    }
  }
  if (isActive === false) {
    getData()
  }

  return (
    <div className='App'>
      <div id='OHOS'>
        <h1>{Parser(id.split('/').pop().replaceAll('_', ' ').link(id))}</h1>
        <table className='table'>
          <tbody>
            {
              displayWiki.map(item =>
                <tr>
                  <td>{item.o.substring(0, 300)}<span className="extra">{item.o.substring(301)}</span></td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
