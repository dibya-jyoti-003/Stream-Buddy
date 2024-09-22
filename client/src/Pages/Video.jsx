import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import sampleVideo from '../images/sampleVideo.mp4'
import channelImage from '../images/channelImage.jpeg'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ShareIcon from '@mui/icons-material/Share';
import Comments from '../Components/Comments.jsx'
import Card from '../Components/Card.jsx'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import { url } from '../App.jsx';
import {format} from 'timeago.js'
import { fetchSuccess, like ,dislike, fetchFailure, fetchStart} from '../Redux/videoSlice.js';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { subscription } from '../Redux/userSlice.js';
import Recommendation from '../Components/Recommendation.jsx'


const Container = styled.div`
  display: flex;
  gap: 24px;
`
const Content = styled.div`
    flex: 5;
`


const VideoWrapper = styled.div`

`
const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`

const Buttons = styled.div`
  
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`

const Button = styled.button`
  background : transparent;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  border: none;
`

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`
const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`

const ChannelName = styled.span`
  font-weight: 500;
`

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`



function Video() {

  const axiosInstance = axios.create({
      baseURL: `${url}`, // Base URL for your backend API
      withCredentials: true, // Enable cookies
  })

  const path = useLocation().pathname.split('/')[2]
  const {currentUser} = useSelector(state => state.user)
  const {currentVideo} = useSelector(state => state.video)
  const dispatch = useDispatch()
  const [channel,setChannel] = useState({})
  // console.log(path)

  
  

    useEffect(()=>{
        const fetchData = async ()=>{
          dispatch(fetchStart())
        try {
          const videoRes = await axiosInstance.get(`videos/find/${path}`);
          const channelRes = await axiosInstance.get(`users/find/${videoRes.data.reqVideo.userId}`)
          //console.log(videoRes)
          setChannel(channelRes.data.user)
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
      fetchData()  
    },[path,dispatch])

    const handleLike = async () => {
      try {
        const liked = await axios.put(`${url}users/likeVideo/${path}`,
          {},
          {withCredentials: true}
        )
        dispatch(like(currentUser._id))
        // console.log(channel)
      } catch (error) {
        console.log(error)
      }
    }

    const handleDislike = async () => {
      try {
        await axiosInstance.put(`users/dislikeVideo/${path}`)
        dispatch(dislike(currentUser._id))
      } catch (error) {
        console.log(error)
      }
    }

    const handleSub = async () => {
      currentUser.subscribedUsers?.includes(channel._id)?
      await axiosInstance.put(`users/unsub/${channel._id}`):
      await axiosInstance.put(`users/sub/${channel._id}`)
      dispatch(subscription(channel._id))
    }

  return (
    <>
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo.videoUrl} controls />
        </VideoWrapper>
        <Title>
          {currentVideo.title}
        </Title>
        <Details>
          <Info>{currentVideo.views} views : {format(currentVideo.createdAt)}</Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentUser?(currentVideo.likes?.includes(currentUser._id)?(
                <ThumbUpIcon/>
                ):(
                <ThumbUpOffAltIcon/>
                )):(<ThumbUpOffAltIcon/>)}
                {" "}
                {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentUser?(currentVideo.dislikes?.includes(currentUser._id)?(
                <ThumbDownAltIcon/>
                ):(
                <ThumbDownOffAltIcon/>
                )):(<ThumbDownOffAltIcon/>)}{" "}Dislike
            </Button>
            <Button><ShareIcon/>Share</Button>
            <Button><LibraryAddIcon/>Save</Button>
          </Buttons>
        </Details>
        <Hr/>
        <Channel>
          <ChannelInfo>
            <Image src ={channel.image}/>
            <ChannelDetail>
              <ChannelName>{channel.userName}</ChannelName>
              <ChannelCounter>{channel.subscriberCount} Subscribers</ChannelCounter>
              <Description>{currentVideo.description}</Description>
            </ChannelDetail>
          </ChannelInfo>
          {currentUser?(<Subscribe onClick={handleSub}>
            {currentUser.subscribedUsers?.includes(channel._id)? "Subscibed":"Subscribe"}
          </Subscribe>):(<Subscribe>Subscribe</Subscribe>)}
        </Channel>
        <Hr/>
        <Comments videoId={currentVideo._id} user={currentUser} />
      </Content>
      <Recommendation tags={currentVideo.tags} />
    </Container>
    </>

  )
}

export default Video

{/* <iframe 
          width="100%"
          height="700"
          src={sampleVideo}
          title="YouTube video player"
          frameBorder="0"
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          ></iframe> */}


              {/*<Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo.videoUrl} controls />
        </VideoWrapper>
        <Title>
          {currentVideo.title}
        </Title>
        <Details>
          <Info>{currentVideo.views} views : {format(currentVideo.createdAt)}</Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser._id)?(
                <ThumbUpIcon/>
                ):(
                <ThumbUpOffAltIcon/>
                )}{" "}
                {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser._id)?(
                <ThumbDownAltIcon/>
                ):(
                <ThumbDownOffAltIcon/>
                )}{" "}Dislike
            </Button>
            <Button><ShareIcon/>Share</Button>
            <Button><LibraryAddIcon/>Save</Button>
          </Buttons>
        </Details>
        <Hr/>
        <Channel>
          <ChannelInfo>
            <Image src ={channel.image}/>
            <ChannelDetail>
              <ChannelName>{channel.userName}</ChannelName>
              <ChannelCounter>{channel.subscriberCount} Subscribers</ChannelCounter>
              <Description>{currentVideo.description}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {currentUser.subscribedUsers?.includes(channel._id)? "Subscibed":"Subscribe"}
          </Subscribe>
        </Channel>
        <Hr/>
        <Comments videoId={currentVideo._id} user={currentUser} />
      </Content>
      <Recommendation tags={currentVideo.tags} />
    </Container>*/}