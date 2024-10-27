import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Logo from './Logo';
import Navigation from './Navigation';
import LoginRegister from './LoginRegister';

const HeaderContainer = styled.header`

  margin-top:-20px;
  // background-color: white;
  // border-bottom: 1px solid var(--border-color);
  border-radius: 0px;
  position: static;
  min-width: 100%;
  padding: 10px;
  box-sizing: border-box;
  // shrink
  z-index: 500;
  
`;

const HeaderTop = styled.div`
  min-height:30px;
  max-height:30px;
  display: flex;
  flex-direction:row;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  min-width: 100%;
`;





function Header () {

  return (
    <HeaderContainer>
      <HeaderTop>
        <Logo/>
        <Navigation/> 
        <LoginRegister isAuthenticated={false} username={'Admin'}/>
      </HeaderTop>
    </HeaderContainer>
  );
}

export default Header;