import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from '../Components/Card.jsx'
import axios from 'axios'
import {url} from '../App.jsx'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

function Home({type}) {

  const [videos,setVideos] = useState([])

  useEffect( () => {
      const randomVideos = async ()=> {
        const vid = await axios.get(`${url}videos/${type}`)
        setVideos(vid.data)
        
      }
      randomVideos()      
  },[type])

  return (
    <Container>
      {videos.map ((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  )
}

export default Home
