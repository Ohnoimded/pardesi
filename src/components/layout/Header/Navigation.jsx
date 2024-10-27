import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Nav = styled.nav`
font-family:  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;  
font-weight: normal;
font-size: 18px;
font-weight: bold;

  flex-basis: 50%;
  display: flex;
  justify-content: flex-start;
  align-items:center;
  box-sizing: border-box;
  margin-left:30px;;


  a {
    // padding: 1px;
    width: fit-content;
    // font-size: 15px;
    // font-weight: 600;
    padding: 15px;
    text-decoration: none;
    // background-color: var(--fr-blue);
    // border-radius: 5px;
    // text-align: flex-start;

    
  }



`;

function Navigation(){
    const [selectedLink, setSelectedLink] = useState('home');
    function handleSelection(linkName) {
      setSelectedLink(linkName);
    }
    return (<Nav>
        <Link 
            to="/"
            className={selectedLink === 'home' ? 'selected' : ''}
            onClick={() => handleSelection('home')}
            >
              <div className="NavLinks">
            Home
              </div>
          </Link>

          <Link
            to="/newsletter"
            // to="#"
            className={selectedLink === 'newsletter' ? 'selected' : ''}
            onClick={() => handleSelection('newsletter')}
            >
              <div className="NavLinks">
            Newsletter
              </div>
          </Link>

          <Link
            to="/analytics"
            className={selectedLink === 'analytics' ? 'selected' : ''}
            onClick={() => handleSelection('analytics')}
            >
              <div className="NavLinks">
              Analytics
              </div>
            
            </Link>

          {/* <Link
            to="#"
            className={selectedLink === 'summaries' ? 'selected' : ''}
            onClick={() => handleSelection('summaries')}
            >
              <div className="NavLinks">
            Summaries
              </div>
          </Link> */}
          
          
        </Nav>
    )
}

export default Navigation;