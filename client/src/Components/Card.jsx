import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import thumbnail from '../images/videoCard.jpg'
import channelImage from '../images/channelImage.jpeg'
import { Link } from 'react-router-dom'
import {format} from 'timeago.js'
import axios from 'axios'
import {url} from '../App.jsx'
import { useDispatch } from 'react-redux'
import { fetchStart , fetchSuccess, fetchFailure} from '../Redux/videoSlice.js'

const Container =  styled.div`
    width: ${(props) => props.type !== "sm" && "360px"};
    margin-bottom: ${(props) => props.type === "sm"?"10px":"45px"};
    cursor: pointer;
    display: ${(props) => props.type === "sm" && "flex"};
    gap: 10px;
`
const Image =  styled.img`
    flex: 1;
    width: 100%;
    height: ${(props) => props.type === "sm" ?"100px":"202px"};
    background-color: #999;
`

const Details=styled.div`
    flex: 1;
    display: flex;
    margin-top: ${(props) => props.type === "sm"? "0px":"16px"};
    gap: 12px;
`
const ChannelImage=styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #999;
    display: ${(props) => props.type === "sm" && "none"};
`
const Texts = styled.div``

const Title = styled.h1`
    font-size: 16px;
    font-weight: 500;
    color: ${({theme}) => theme.text};
`
const ChannelName = styled.h2`
    font-size: 14px;
    color: ${({theme}) => theme.textSoft};
    margin: 9px 0px;
`
const Info = styled.div`
    font-size: 14px;
    color: ${({theme}) => theme.textSoft};
`

function Card({type , video}) {

    const axiosInstance = axios.create({
        baseURL: `${url}`, // Base URL for your backend API
        withCredentials: true, // Enable cookies
    })

    const [channel,setChannel] = useState({})
    const dispatch = useDispatch()
    const path = video._id

    useEffect(()=>{
        const fetchChannel = async () =>{
            const ch = await axios.get(`${url}users/find/${video.userId}`)
            setChannel(ch.data.user)
        }
        fetchChannel()
    },[video])

    const handleClick = async ()=>{
          dispatch(fetchStart())
        try {
          const videoRes = await axiosInstance.get(`videos/find/${path}`);
          const channelRes = await axiosInstance.get(`users/find/${videoRes.data.reqVideo.userId}`)
          //console.log(videoRes)
          //setChannel(channelRes.data.user)
          dispatch(fetchSuccess(videoRes.data.reqVideo))
          //console.log('current video :', currentVideo)
          /*
          console.log(videoRes.data.reqVideo)
          console.log(channel)
          console.log('currentvideo : ',currentVideo)*/

        } catch (error) {
          dispatch(fetchFailure())
        }
        
      }

  return (
    <Link to={`/videos/${video._id}`} style={{textDecoration:"none"}} onClick={handleClick} >
        <Container type ={type}>
        <Image type={type} src={video.thumbnail} />
        <Details type={type} >
            <ChannelImage type={type} src={channel.Image} />
            <Texts>
                <Title>{video.title}</Title>
                <ChannelName>{channel.userName}</ChannelName>
                <Info>{video.views} views : {format(video.createdAt)}</Info>
            </Texts>
        </Details>
        </Container>
    </Link>

  )
}

export default Card
