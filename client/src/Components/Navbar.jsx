import React, { useState } from 'react'
import styled from 'styled-components'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Upload from './Upload.jsx'
import { logout } from '../Redux/userSlice.js';
import {url} from '../App.jsx'
import axios from 'axios'

const Container = styled.div`
    position: sticky;
    top: 0;
    background-color: ${({theme}) => theme.bgLighter};
    height: 56px;

`
const Wrapper=styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    padding: 0px 25px;
    position: relative;
`
const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
`;
const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};

`;

const Button =  styled.button`
    padding: 5px 15px;
    background-color: transparent;
    border: 1px solid #3ea6ff;
    border-radius: 3px;
    font-weight: 500;
    color: #3ea6ff;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
`
const User = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  color: ${({theme}) => theme.text};
  cursor: pointer;
`

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`


const Navbar = () => {

  const axiosInstance = axios.create({
      baseURL: `${url}`, // Base URL for your backend API
      withCredentials: true, // Enable cookies
  })

  const [open, setOpen] = useState(false)

  const currentUser = useSelector(state => state.user.currentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async(e) =>{
    e.preventDefault()
    try {
      dispatch(logout())
      const logoutSuccess = await axiosInstance.post(`users/logout`)
      navigate(`/`)
    } catch (error) {
      console.log(`Error in logout in navbar ${error}`)
    }
  }

  return (
    <>
      <Container>
          <Wrapper>
              <Search>
                  <Input placeholder='Search' />
                  <SearchIcon/>
              </Search>
              {currentUser? (
                <User>
                  <VideoCallIcon onClick={(e) => setOpen(true)} />
                  <Avatar/>
                  {currentUser.userName}
                  <Button onClick={handleLogout} >Logout</Button>
                </User>
              ) : (
                <Link to='/auth' style={{textDecoration: "none"}}>
                  <Button>
                      <AccountCircleIcon/>
                      Sign In
                  </Button>
              </Link>
            )}
          </Wrapper>
      </Container>
      {open && <Upload setOpen = {setOpen} />}
    </>
  )
}

export default Navbar
