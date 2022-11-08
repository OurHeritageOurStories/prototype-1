// import { hot } from 'react-hot-loader'
import React from 'react'
import './App.css'
import { GraphCanvas } from 'reagraph'

export default function App () {
  return (
    <div className='App'>
      <GraphCanvas
        edgeLabelPosition='above'
        labelType='all'
        layoutType='treeLr3d' // 'radialOut2d' // 'forceDirected2d'
        draggable
        animated
        nodes={[
          {
            id: 'n-1',
            label: '1'
          },
          {
            id: 'n-2',
            label: '2',
            icon: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/941A/production/_127041973_gettyimages-1243648660.jpg.webp'
          },
          {
            id: 'n-3',
            label: '3'
          },
          {
            id: 'n-4',
            label: '4'
          },
          {
            id: 'n-5',
            label: '5'
          },
          {
            id: 'n-6',
            label: '6'
          },
          {
            id: 'n-7',
            label: '7'
          },
          {
            id: 'n-8',
            label: '8'
          }
        ]}
        edges={[
          {
            id: '1->2',
            source: 'n-1',
            target: 'n-2',
            label: 'Edge 1-2'
          },
          {
            id: '1->3',
            source: 'n-1',
            target: 'n-3',
            label: 'Edge 1-3'
          },
          {
            id: '1->4',
            source: 'n-1',
            target: 'n-4',
            label: 'Edge 1-4'
          },
          {
            id: '3->5',
            source: 'n-3',
            target: 'n-5',
            label: 'Edge 3-5'
          },
          {
            id: '2->6',
            source: 'n-2',
            target: 'n-6',
            label: 'Edge 2-6'
          },
          {
            id: '4->7',
            source: 'n-4',
            target: 'n-7',
            label: 'Edge 4-7'
          },
          {
            id: '8->7',
            source: 'n-8',
            target: 'n-7',
            label: 'Edge 8-7'
          }
        ]}
      />
    </div>
  )
}
