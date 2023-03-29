import React, { useState } from 'react'
import './App.css'
import Parser from 'html-react-parser'
import { Pagination } from '@material-ui/lab'
import {
  useSearchParams,
  useParams,
  Link
} from 'react-router-dom'

export default function Result () {
  const [displayWiki, setDisplayWiki] = useState([{ Identifier: { type: '', value: '' }, Title: { type: '', value: '' }, Topics: { type: '', value: '' }, Description: { type: '', value: '' }, URL: { type: '', datatype: '', value: '' } }])
  const [searchParams] = useSearchParams()
  var { id } = useParams()
  const idParam = id
  const [isActive, setIsActive] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const getData = async () => {
    setIsActive(true)
    try {
      fetch('http://ec2-13-40-156-226.eu-west-2.compute.amazonaws.com:5000/api/movingImagesEnt/entity/' + id)
        .then(response => response.json())
        .then(response => {
          setDisplayWiki(response.items)
        })
        .then(response => setIsReady(true))
    } catch (err) {
      console.log(err)
    }
  }

  if (isActive === false) {
    getData()
  }

  const newPage = () => {
    setIsReady(false)
    setIsActive(false)
  }

  const changeClass = event => {
    event.currentTarget.classList.toggle('rightDivOpen')
  }

  return (
    <div className='App'>
      <div id='OHOS'>
        <div>
            <h1 key={1}>
            {Parser(displayWiki[0].Title.value.replaceAll('(', '').replaceAll(')', ''))}
            </h1>
        </div>
        <table className='table' style={{ visibility: isReady ? 'visible' : 'hidden' }}>
          {
            displayWiki.map(item =>
              <tr key={item.id}>
                <div>
                  <td className='left'>{item.Description.value}<br /><b>Source</b>: <a href={item.URL.value}>{item.URL.value}</a></td>
                  <td className='right'>Topics:<br /><div className='rightDiv'>{
                    item.Topics.value.split("|||").map(itemTopic =>
                      <p>{itemTopic}</p>
                    )
                  }</div></td>
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
