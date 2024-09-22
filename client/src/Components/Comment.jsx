import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import commmentImage from '../images/commentImage.jpg'
import {format} from 'timeago.js'
import axios from 'axios'
import {url} from '../App.jsx'

const Container = styled.div`
    display: flex;
    gap: 10px;
    margin : 30px 0px;
`
const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`
const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const Name =styled.span`
    font-size: 13px;
    font-weight: 500;
`
const Date =styled.span`
    font-size: 12px;
    font-weight: 400;
    color : ${({theme})=>theme.textSoft};
    margin-left: 5px;
`
const Text =styled.span`
    font-size: 14px;
`

function Comment({comment}) {

    const [channel,setChannel] = useState({})
    //hello
    useEffect(()=>{
        const fetchChannel = async () => {
            try {
                const res = await axios.get(`${url}users/find/${comment.userId}`)
                setChannel(res.data)
                // console.log(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchChannel()
    },[])

  return (
    <Container>
        <Avatar src={commmentImage} />
        <Details>
            <Name>{channel.userName}</Name>
            <Date>{format(comment.createdAt)}</Date>
            <Text>{comment.description}</Text>
        </Details>
    </Container>
  )
}

export default Comment
