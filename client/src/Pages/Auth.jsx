import React, { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import {url} from '../App.jsx'
import { useDispatch } from 'react-redux'
import { loginFailure, loginStart, loginSuccess } from '../Redux/userSlice.js'
import {auth , provider} from '../firebase.js'
import {signInWithPopup} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh-56px);
    color: ${({theme}) => theme.text};
`
const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: ${({theme}) => theme.bgLighter};
    border: 1px solid ${({theme}) => theme.soft};
    padding: 20px 50px;
    gap: 5px;
`
const Title = styled.h1`
  font-size: 24px;
`

const Subtitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;


function Auth() {

  const [userName,setUserName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const dispatch = useDispatch()
  const axiosInstance = axios.create({
    baseURL: `${url}`, // Base URL for your backend API
    withCredentials: true, // Enable cookies
})

  const navigate = useNavigate()

  const handleLogin = async (e) => {
      e.preventDefault()
      dispatch(loginStart())
      try {
        const res = await axiosInstance.post(`users/login` ,{userName,password})
        //console.log('axios response: ',res.data)
        dispatch(loginSuccess(res.data.loggedInUser))
        navigate(`/`)
      } catch (error) {
        console.log(error.response.data)
        dispatch(loginFailure())
      }
  }

  const signInWithGoogle = async ()=>{
    signInWithPopup(auth,provider)
    .then((result) => {
      axiosInstance.post(`users/google`, {
        name : result.user.displayName,
        email : result.user.email,
        img : result.user.photoURL,
      }).then(res => {
        // console.log(res)
        dispatch(loginSuccess(res.data))
        navigate(`/`)
      })
    })
    .catch((error) => {dispatch(loginFailure())})
  }

    const handleRegister = async()=>{
      dispatch(loginStart())
      try {
        const res = await axiosInstance.post(`users/signup`,{
          userName,
          email,
          password
        })
        dispatch(loginSuccess(res.data.savedUser))
        navigate(`/`)
      } catch (error) {
        console.log(`signup failure ${error}`)
        dispatch(loginFailure())
      }
    }

  return (
    <Container>
      <Wrapper>
        <Title>Sign In</Title>
        <Subtitle>Enter your details to sign in</Subtitle>
        <Input type="text" placeholder="username" onChange={e => setUserName(e.target.value)}/>
        <Input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
        <Button onClick={handleLogin} >Sign In</Button>

        <Subtitle>Or</Subtitle>
        <Button onClick={signInWithGoogle} >Sign In with Google</Button>
        <Subtitle>Or</Subtitle>
        <Input type="text" placeholder="username" onChange={e => setUserName(e.target.value)}/>
        <Input type="text" placeholder="email" onChange={e => setEmail(e.target.value)}/>
        <Input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}/>
        <Button onClick={handleRegister} >Sign Up</Button>
      </Wrapper>
    </Container>
  )
}

export default Auth
