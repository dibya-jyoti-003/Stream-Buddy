import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Menu from './Components/Menu';
import Navbar from './Components/Navbar';
import { darkTheme, lightTheme } from './Utils/Theme';
import {
  BrowserRouter as Router,
  Route,
  Link,
  BrowserRouter,
  Routes
} from "react-router-dom";
import Home from './Pages/Home.jsx';
import Video from './Pages/Video.jsx'
import Auth from './Pages/Auth.jsx'

const Container = styled.div`
  display: flex;
`
const Main = styled.div`
  flex : 7;
  background-color: ${({theme})=>theme.bg};
  color: ${({theme})=>theme.text};
`

const Wrapper = styled.div`
  padding: 22px 96px;
  

`
export const url = 'http://localhost:8800/api/'

export default function App() {

  const [darkMode, setDarkMode] = useState(true)

  return (
    <ThemeProvider theme={darkMode? darkTheme:lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode}/>
          <Main>
            <Navbar/>
            <Wrapper>
              <Routes>
                <Route path='/'>
                  <Route index element={<Home type='random'/>} />
                  <Route path='trend' element={<Home type='trend' />} />
                  <Route path='subscription' element={<Home type='sub' />} />
                  <Route path='videos'>
                    <Route path = ":id" element = {<Video/>} />
                  </Route>
                  <Route path='auth' element = {<Auth/>}/>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}