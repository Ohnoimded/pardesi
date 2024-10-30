import React from 'react';
import styled from 'styled-components';
import WeatherWidget from './WeatherWidget';
import MarketData from './MarketData';

const HeaderBottomWrapperOuter = styled.header`
  display: flex;
  align-items: center;
  justify-content:center;
    width: 100%;


`;

const HeaderBottomWrapper = styled.div`
  // background-color: var(--darth-dark);
  // color: var(--darth-dark);
  // box-shadow: 0 0 10px var(--shadow-color);
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content:center;
  position: relative;
  padding: 5px;
  min-height: 80px;
  max-height: 80px;
  border-radius: 10px;
  // margin-top: 10px;
//   margin-bottom: 10px;
  box-sizing: border-box;
  width:100%;
`;

const HeaderSnippets = styled.div`
  flex-basis: 33%;

  // p{
  // font-size:16px;}
`;

const HeaderCenter = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 25ch;
  align-items: center;
  flex-basis: 33%;
  box-sizing: border-box;
  // color: var(--fr-blue) !important;

  div{
  font-size:25px;
  font-weight: 500;
  
  }
  .date-div{
  // color: var(--darth-dark);
  margin-top:5px;
  font-size:14px;
  
  }
`;



const Hr = styled.hr`
       display: block;
       position: relative;
       justify-self:center;
       padding: 0;
       margin: 8px auto;
       height: 0;
       width: 100%;
       max-height: 0;
       font-size: 1px;
       line-height: 0;
       clear: both;
       border: none;
       border-top: 1px solid #AAA2;
       border-bottom: 1px solid #AAA2;
`

const HeaderBottom = () => {
  return (<>
    <Hr></Hr>
    <HeaderBottomWrapperOuter>
    <HeaderBottomWrapper>
      <HeaderSnippets>
        <WeatherWidget></WeatherWidget>
      </HeaderSnippets>
      <HeaderCenter>
        <div>LA CARMAGNOLE</div>
        <div className='date-div'>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </HeaderCenter>
      <MarketData/>
    </HeaderBottomWrapper>
    </HeaderBottomWrapperOuter>
    <Hr></Hr>

  </>
  );
};

export default HeaderBottom;