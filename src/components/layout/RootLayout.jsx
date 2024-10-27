import React from 'react'
import Header from './Header/Header';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom'; // Import Outlet
import HeaderBottom from './HeaderBottom/HeaderBottom';
import FooterContainer from './Footer'

const Main = styled.main`
  display: flex;
  position:relative;
  flex-direction: column;
  // top: -50px;
  padding: 20px;
`;

const RootLayout = () => {
    return (
      <>
      <div className='main-container'>
        <Header />
        <HeaderBottom />

        <>
        <Outlet /> 
        </>
        {/* <Footer></Footer> */}
      </div>
      <FooterContainer></FooterContainer>
      </>
    );
  };
  
  export default RootLayout;