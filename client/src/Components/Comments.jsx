import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import channelImage from '../images/channelImage.jpeg'
import Comment from './Comment.jsx'
import { url } from '../App.jsx'
import axios from 'axios'

const Container = styled.div``

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`

function Comments({videoId}) {

  const [comments,setComments] =useState([])

  useEffect(()=>{
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${url}comments/getComments/${videoId}`)
        setComments(res.data)
        // console.log('comments : ',res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchComments()
  },[])

  return (
    <Container>
        <NewComment>
            <Avatar src={channelImage} />
            <Input placeholder='Add your comment...' />
        </NewComment>
        {comments.map ((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
    </Container>
  )
}

export default Comments
