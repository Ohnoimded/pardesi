import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../../services/AuthContext';
import { Link } from 'react-router-dom';
const FeaturedWrapper = styled.div`
  display: flex;
  flex-direction:column;
  padding: 10px;
  gap: 15px;
  // box-shadow: 0 0 10px var(--shadow-color);
  // background-color: var(--bg-light);
  // border-radius: 3px 3px 4px 15px;
  // text-align: center;
  max-height:700px;
  overflow:hidden;
  // min-height:700px;
  justify-content:flex-begin;
  text-align: justify;
  // text-justify: inter-word;


  .img-container{
// margin-top:-5px;
  }
  
  .featuredDefiner{
    display:inline-flex;
    // justify-content:center;
    // align-items:center;
    align-text:center;
    // background-color:var(--root-bg-dark2);
    color:var(--fr-red);
    width:100%;

  }
  img {
    width: 100%;
    // max-width: 848px;
    border-radius: 0px;
    height: auto;
    max-height:320px;
    min-height:320px;
    object-fit: cover;
    }

    p{
    font-size:12px;
    overflow:hidden;}

     .featuredTitle{
    font-size:20px;
    font-weight: 400;
    }
`;

const FeaturedArticle = () => {
  const { apiToken, getApiToken, isInitialized } = useAuth();
  const [featuredNews, setfeaturedNews] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getFeaturedNews = async (apiToken) => {
    try {
      setIsLoading(true);
      const url = `https://carmagnole.ohnoimded.com/api/news/featured_article/`;
      const response = await axios.get(url, {
        headers: {
          //     // "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`

        }
      });
      const news = response.data.featured_article_data;
      setfeaturedNews(news);

      setIsLoading(false);
      return news

    } catch (err) {
      // console.error('Error fetching news:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadNews = async () => {
      if (isInitialized) {
        await getFeaturedNews();
      }
    }
    loadNews(apiToken);
  }, [isInitialized]);

  const article = featuredNews ? {
    title: featuredNews.headline,
    imageUrl: featuredNews.imageurl,
    content: featuredNews.nohtmlbody,
    section: featuredNews.section,
    publishdate: featuredNews.publishdate,
    slug: featuredNews.slug,
  } : {};

  const date_YYYYMMDD = article.publishdate ? article.publishdate.slice(0, 10) : '';
  const year = date_YYYYMMDD.slice(0, 4);
  const month = date_YYYYMMDD.slice(5, 7);
  const day = date_YYYYMMDD.slice(8, 10);
  const url = `/article/${article.section}/${year}/${month}/${day}/${article.slug}`;

  if (article.content && article.content.length >= 400) {
    article.content = article.content.slice(0, 380)
    article.content = article.content.concat('...')
  }
  return (
    <FeaturedWrapper className='featured-article relative z-50'>
      {isLoading ? (
        <div>Loading...</div>
      ) : featuredNews ? (<>
        <div className="cta-overlay absolute inset-0 flex p-5 justify-center items-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-400 rounded">
          <Link to={url} className="linker p-2 bg-gray-500 hover:bg-gray-400  hover:text-gray-700 rounded " style={{ fontSize: "12px" }}>Read More</Link>
        </div>
        <div className='featuredInnerWrapper'>
          <div className='featuredDefiner'><span>FEATURED ARTICLE</span></div>
          <div style={{ minHeight: '50px', maxHeight: '150px', display: 'flex', padding:"5px 0px 5px 0px", marginBottom : '5px'}}>
            <div className='featuredTitle'>{article.title}</div>
          </div>
          <div className='img-container' style={{padding:"5px 0px 5px 0px"}}>
            <img src={article.imageUrl} alt={article.title} />
          </div>
          <div>
            <p style={{ minHeight: '100px', maxHeight: '200px', padding:"15px 0px 0px 0px"}}>
              {article.content}
            </p>
          </div>
        </div>
      </>

      ) : (
        <div>
          <p>Still waiting? Why don't you refresh?</p>
        </div>
      )}
    </FeaturedWrapper>
  );
};

export default FeaturedArticle;
