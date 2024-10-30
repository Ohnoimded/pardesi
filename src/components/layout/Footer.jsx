import React, { useState } from 'react';
import styled from 'styled-components';

const Footer = styled.header`
font-family:  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;  
font-weight: bold;
font-size: 16px;
margin-top: 10px;

  display:flex;
  justify-content:center;
  align-items:center;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 52px;
  background-color:var(--root-bg-dark2);
  color: var(--darth-dark);
  text-align: center;
  z-index:9999999;
`;





function FooterContainer () {
  return (
    <Footer>
    <footer className='footer'>© La Carmagnole - <span>{new Date().getFullYear()}</span></footer>
    </Footer>
  );
}

export default FooterContainer;