import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Card = styled.div`
  display: flex;
  // flex-direction: column;
  // background-color: var(--bg-light);
  padding: 5px;
  flex-wrap:wrap;
  // box-shadow: 0 0 10px var(--shadow-color);
  // border-radius: 3px 3px 4px 15px;
  font-size: 12px;
  // max-height:50px;
  overflow:hidden;
  // justify-content:flex-begin;
  text-align: justify;
  justify-content: flex-start;
  text-justify: inter-word;
  min-height: 200px;
  gap: 10px;

  .cardOverlay{
  display:none;

  }

  .cardContent{
  display:flex;
        justify-content:justify;
          text-align: justify;


  }

  .cardTitle{
  font-size:20px;
  font-weight: 400;
  }
`;



export const NewsCard = ({ id, title, content, section, publishdate, slug }) => {

  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll('.cta-overlay');

    const handleTouchStart = (event) => {
      elements.forEach((el) => el.classList.remove('opacity-100'));
      event.currentTarget.classList.add('opacity-100');
    };

    elements.forEach((element) => {
      element.addEventListener('touchstart', handleTouchStart,{  passive: false });
    });

    return () => {
      elements.forEach((element) => {
        element.removeEventListener('touchstart', handleTouchStart,{  passive: false });
      });
    };
  }, []);

  // const handleClick = (e) => {
  //   e.preventDefault();
    const date_YYYYMMDD = publishdate.slice(0, 10);
    const year = date_YYYYMMDD.slice(0, 4);
    const month = date_YYYYMMDD.slice(5, 7);
    const day = date_YYYYMMDD.slice(8, 10);
    const url = `/article/${section}/${year}/${month}/${day}/${slug}`; // should have used a component instead of this.
  //   window.open(url, '_blank');
  //   // navigate(`/article/${section}/${year}/${month}/${day}/${slug}`)
  // };

  if (content.length > 400) {
    content = content.slice(0, 350)
    content = content.concat('...') // Add link to new page on more click
  }
  if (title.length > 100) {
    title = title.slice(0, 90)
    title = title.concat('...')
  }
  return (
    <Card className='newsCard relative z-50' key={id}>
      <div className="cta-overlay absolute inset-0 flex p-5 items-end justify-end bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-400 rounded">
        <Link  to={url} className="p-2 bg-gray-500 hover:bg-gray-400  hover:text-gray-700 rounded" >Read More</Link>
        {/* <button className="p-2 bg-red-500 rounded"  onClick={handleClick}>Read More</button> */}

      </div>
      <div className='hover:opacity-70 transition-opacity duration-300'>
        <div className='cardTitle'>{title}</div>
        <div className='cardContent'><p>{content}</p></div>
      </div>
    </Card>

  );
};


export const NewsCardExtended = ({id, title, content, section, publishdate, slug }) => {

  if (content.length > 2000) {
    content = content.slice(0, 1250)
    content = content.concat('...') // Add link to new page on more click
  }
  if (title.length > 100) {
    title = title.slice(0, 90)
    title = title.concat('...')
  }
  const date_YYYYMMDD = publishdate.slice(0, 10);
  const year = date_YYYYMMDD.slice(0, 4);
  const month = date_YYYYMMDD.slice(5, 7);
  const day = date_YYYYMMDD.slice(8, 10);
  const url = `/article/${section}/${year}/${month}/${day}/${slug}`;

  return (
    <Card className='newsCard relative z-50' key={id}>
      <div className="cta-overlay absolute inset-0 flex p-5 items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-400 rounded">
        <Link  to={url} className="p-2 bg-gray-500 hover:bg-gray-400  hover:text-gray-700 rounded" >Read More</Link>
        {/* <button className="p-2 bg-red-500 rounded"  onClick={handleClick}>Read More</button> */}

      </div>
      <div className='hover:opacity-70 transition-opacity duration-300'>
        <div className='cardTitle'>{title}</div>
        <div className='cardContent'><p>{content}</p></div>
      </div>
    </Card>

  );
};

