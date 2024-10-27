import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';


const LogoStyle = styled.div`
  flex-basis: 20%;
  display: flex;
  // padding: 10px;
  box-sizing: border-box;
  justify-content:center;
  align-items:center;

    a {
      text-wrap: nowrap;
      text-decoration: none;
      text-align:center;
      font-size: 20px;
      font-weight: bold;
      color: var(--fr-red) !important;    
      }
      
`;

export default function Logo() {
    return (<LogoStyle>
        <Link to="/">LE CARMAGNOLE</Link>

    </LogoStyle>

    )
};