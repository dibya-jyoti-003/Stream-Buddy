import React from 'react'
import styled from 'styled-components'
import Streambuddy from '../images/logo.png'
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SettingsIcon from '@mui/icons-material/Settings';
import FlagIcon from '@mui/icons-material/Flag';
import HelpIcon from '@mui/icons-material/Help';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { dark } from '@mui/material/styles/createPalette';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Container = styled.div`
    flex : 1;
    background-color: ${({theme}) => theme.bgLighter};
    height: 100vh;
    color: ${({theme}) => theme.text};
    font-size: 14px;
    position: sticky;
    top: 0;
`
const Wrapper = styled.div`
    padding: 28px 26px;
`
const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: bold;
    margin-bottom: 25px;
    font-size: 12px;
`
const Img = styled.img`
    height: 25px;
    border-radius: 50%;
`
const Item = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    cursor: pointer;
    &:hover{
        background-color: ${({theme}) => theme.soft};
    }
`
const Hr = styled.hr`
    margin: 15px 0px ;
    border: 0cap.5px solid ${({theme}) => theme.soft};
`

const Login = styled.div`
    
`

const Button =  styled.button`
    padding: 5px 15px;
    background-color: transparent;
    border: 1px solid #3ea6ff;
    border-radius: 3px;
    font-weight: 500;
    color: #3ea6ff;
    margin-top: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
`
const Title = styled.h2`
    font-size: 10px;
    font-weight: 500;
    color: ${({theme})=>theme.textSoft};
    //margin-bottom: 20px;
`



const Menu = ({darkMode, setDarkMode}) => {
    const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <Container>
      <Wrapper>
        <Link to="/" style={{textDecoration:"none",color:"inherit"}}>

            <Logo>
                <Img src={Streambuddy} />
                STREAM    BUDDY
            </Logo>
        </Link>
        <Link to='/' style={{textDecoration:"none", color:"inherit"}}>
            <Item>
                <HomeIcon/>
                Home
            </Item>
        </Link>
        <Link to='/trend' style={{textDecoration:"none", color:"inherit"}}>
            <Item>
                <ExploreIcon/>
                Explore
            </Item>
        </Link>
        <Link to='/sub' style={{textDecoration:"none", color:"inherit"}}>
            <Item>
                <SubscriptionsIcon/>
                Subscriptions
            </Item>
        </Link>
        <Hr/>
        <Item>
            <PhotoLibraryIcon/>
            Library
        </Item>
        <Item>
            <HistoryIcon/>
            History
        </Item>
        <Hr/>
        {!currentUser &&
        <>
            <Login>
                Sign in to Like videos ,comments and Subscribe
                <Link to='/auth' style={{textDecoration: "none"}}>
                    <Button>
                        <AccountCircleIcon/>
                        Sign In
                    </Button>
                </Link>
            </Login>
            <Hr/>
        </>
        }
        <Title>Best of STREAM BUDDY</Title>
        <Item>
            <LibraryMusicIcon/>
            Music
        </Item>
        <Item>
            <SportsCricketIcon/>
            Sports
        </Item>
        <Item>
            <SportsEsportsIcon/>
            Gaming
        </Item>
        <Item>
            <MovieCreationIcon/>
            Movies
        </Item>
        <Item>
            <NewspaperIcon/>
            News
        </Item>
        <Hr/>
        <Item>
            <SettingsIcon/>
            Settings
        </Item>
        <Item>
            <FlagIcon/>
            Report
        </Item>
        <Item>
            <HelpIcon/>
            Help
        </Item>
        <Item onClick={()=>setDarkMode(!darkMode)}>
            <LightModeIcon/>
            {darkMode?"Light":"Dark"} Mode
        </Item>
      </Wrapper>
    </Container>
  )
}

export default Menu
