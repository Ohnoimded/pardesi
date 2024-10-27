import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {NewsCard,NewsCardExtended} from './NewsCard';
import FeaturedArticle from './FeaturedArticle';
import { useAuth } from '../../../services/AuthContext';
import { TailSpin } from 'react-loader-spinner';
import { ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import ScrollToTop from "react-scroll-to-top";
import { v4 as uuidv4, v4 } from 'uuid';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';


const Grid = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    width: 100%;
    // max-height: 850px;

    // .newscard {
    //     min-height: 170px;
    // }
    // .featured-article {
    //     min-height: 623px;
    // }
`;

const NewsSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;
const NewsSection2 = styled.div`
    display: grid;
    // margin-top: 16px;
    grid-template-columns: 1fr 1fr;
    margin-bottom:20px;
    gap: 16px;
    width: 100%;
`;

const FeaturedSection = styled.div`
    // grid-row: span 0.8;
`;
const SecondaryBanner = styled.div`
    margin-bottom:20px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 16px;

    .adbanner{
    padding:10px;
    display:flex;
    justify-content: center;
    align-items:center;
    background-color: black;
    }

    img{
    width: 80%;
    height: 400px;
    max-width: 150px;
    object-fit: cover;
    }

    .secondaryBannerAd1{
    grid-row: span 3 / span 3;
    padding:10px;
    display:flex;
    justify-content: center;
    align-items:center;
    
    }
    
    .secondaryBanner{
     grid-column: span 2 / span 2;
    grid-row: span 3 / span 3;
    }

    .secondaryBannerAd2{
        grid-row: span 3 / span 3;
    grid-column-start: 4;
    padding:10px;
    display:flex;
    justify-content: center;
    align-items:center;
        }
`;

const InfiniteScroll = styled.div`
    display: grid;
    // margin-top: 16px;
    grid-template-columns: 1fr 1fr;
    // margin-top:-20px;
    gap: 16px;
    width: 100%;
    // .newscard {
    //     min-height: 170px;
    // }
`;
const NewsCarousal = styled.div`
// margin-top:5px;
//     display: flex;
//   flex-wrap: nowrap;
//   overflow-x: scroll;
//     flex-direction:row;
    // gap: 5px;
    // width: 100%;
    
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
       font-size: 5px;
       line-height: 0;
       clear: both;
       border: none;
       border-top: 1px solid #AAA2;
       border-bottom: 1px solid #AAA2;
`

const MainNews = () => {
    const { apiToken,getApiToken,isInitialized } = useAuth();
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const [loadedNews, setLoadedNews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getNews = async (pageNum) => {
        try {
            if (pageNum <= 12) {
                setIsLoading(true);
                // This should be replaced with additional fetch/get operations.
                // Image Carousel should be some popular topics like sports or entertainment.
                // Having a single point of fetching seems shitty.
                const url = `https://carmagnole.ohnoimded.com/api/news/frequentdata/?page=${pageNum}`; 
                const response = await axios.get(url, {
                    headers: {
                    //     // "Access-Control-Allow-Origin": "*",
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiToken}`
                    }
                });
                const responses = response.data.results;
                setLoadedNews((prev) => {
                    const existingIds = new Set(prev.map(news => news.id));
                    const filteredResponses = responses.filter(news => !existingIds.has(news.id));
                    return [...prev, ...filteredResponses];
                });
                setIsLoading(false);
            }
        } catch (err) {
            // console.error('Error fetching news:', err);
            if (err.response && err.response.status === 404) {
                navigate('/404', { replace: true });
            }
            else if (err.response && err.response.status === 503) {
                navigate('/503', { replace: true });
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initialLoad = async (n) => {
            for (let i = 1; i <= n; i++) {
                if(apiToken){
                    await getNews(i);
                }
            }
            setPage(n+1);
        };
        if (screen.availWidth<=480){           // FOr mobile screen. Not designed for mobile screens, but this works to some extent. Nothing is meant for user readability anyways.
            initialLoad(5);
        }else{
            initialLoad(4);

        }
    }, [isInitialized]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100 && !isLoading) {
                setPage((prevPage) => {
                    if (prevPage <= 12) {
                        getNews(prevPage);
                        return prevPage + 1;
                    }
                    return prevPage;
                });
            }
        };
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('touchmove', handleScroll,{  passive: false });
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('touchmove', handleScroll,{  passive: false });
            window.removeEventListener('resize', handleScroll);
        };
      
    }, [isLoading]);

    const slideLeft = () => {
        var slider = document.getElementById('slider');
        slider.scrollLeft = slider.scrollLeft - 500;
    }
    const slideRight = () => {
        var slider = document.getElementById('slider');
        slider.scrollLeft = slider.scrollLeft + 500;
    }

    const initGrid = loadedNews.slice(0, 3);
    const initGridBottom = loadedNews.slice(3, 5);
    const imagesSection = loadedNews.slice(5, 11);
    const infiniteScrollBeforeAd = loadedNews.slice(11,15);
    const inBetweenAdsNews = loadedNews.slice(15, 16); //single
    const infiniteScrollAfterAd = loadedNews.slice(16);

    return (
        <>

            <Grid>
                <NewsSection>
                    {initGrid.map((article) => (
                        <NewsCard key={article.id} title={article.headline} content={article.nohtmlbody} slug={article.slug} section = {article.section} publishdate = {article.publishdate}/>
                    ))}
                </NewsSection>
                <FeaturedSection className='featured-top'>
                    <FeaturedArticle />
                </FeaturedSection>
                {initGridBottom.map((article) => (
                    <NewsCard key={article.id} title={article.headline} content={article.nohtmlbody} slug={article.slug} section = {article.section} publishdate = {article.publishdate}/>
                ))}
            </Grid>

            <Hr></Hr>
            <NewsCarousal className='relative flex items-center '>
                <ChevronLeft size={30} onClick={slideLeft} className='opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300' />
                <div id='slider' className=' [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth'>

                    {imagesSection.map((article) => {
                        const date_YYYYMMDD = article.publishdate ? article.publishdate.slice(0, 10) : '';
                        const year = date_YYYYMMDD.slice(0, 4);
                        const month = date_YYYYMMDD.slice(5, 7);
                        const day = date_YYYYMMDD.slice(8, 10);
                        const url = `/article/${article.section}/${year}/${month}/${day}/${article.slug}`;
                        return <Link to={url} key={article.id} >
                        <img 
                          className='w-[250px] filter grayscale inline-block p-2 cursor-pointer hover:scale-105 hover:brightness-80 hover:grayscale-0 ease-in-out duration-300'
                          key={article.id} 
                          src={article.imageurl} 
                          alt={article.title}
                        />
                      </Link>

})}

                </div>
                <ChevronRight size={30} onClick={slideRight} className='opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300' />
            </NewsCarousal>
            <Hr></Hr>

            <NewsSection2>
            {infiniteScrollBeforeAd.map((article) => (
                <NewsCard key={article.id} title={article.headline} content={article.nohtmlbody} slug={article.slug} section = {article.section} publishdate = {article.publishdate}/>
            ))}
            </NewsSection2>

            <SecondaryBanner>
                    <div className='secondaryBannerAd1 filter grayscale '> 
                        <img src='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/351a19f3-fa83-4984-97e1-38371246aaa9/ddy1f33-daa02efe-544d-43dc-9e3b-25f6bee7a3e3.png/v1/fit/w_766,h_1800,q_70,strp/aws_cloud_banner_by_sketcheedesign_ddy1f33-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzAxMCIsInBhdGgiOiJcL2ZcLzM1MWExOWYzLWZhODMtNDk4NC05N2UxLTM4MzcxMjQ2YWFhOVwvZGR5MWYzMy1kYWEwMmVmZS01NDRkLTQzZGMtOWUzYi0yNWY2YmVlN2EzZTMucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.0NQF8ZpoXf2irwquLCJbc5cTaiV0hbtofW2t4SFet6A' /> 
                    </div>
                <NewsSection className='secondaryBanner'>
                    {inBetweenAdsNews.map((article) => (
                        <NewsCardExtended key={article.id } title={article.headline} content={article.nohtmlbody} slug={article.slug} section = {article.section} publishdate = {article.publishdate}/>
                    ))}
                </NewsSection>
                    <div className='secondaryBannerAd2 filter grayscale '> <img src='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/351a19f3-fa83-4984-97e1-38371246aaa9/ddy1f33-daa02efe-544d-43dc-9e3b-25f6bee7a3e3.png/v1/fit/w_766,h_1800,q_70,strp/aws_cloud_banner_by_sketcheedesign_ddy1f33-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzAxMCIsInBhdGgiOiJcL2ZcLzM1MWExOWYzLWZhODMtNDk4NC05N2UxLTM4MzcxMjQ2YWFhOVwvZGR5MWYzMy1kYWEwMmVmZS01NDRkLTQzZGMtOWUzYi0yNWY2YmVlN2EzZTMucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.0NQF8ZpoXf2irwquLCJbc5cTaiV0hbtofW2t4SFet6A' /> </div>
            </SecondaryBanner>



            <InfiniteScroll>

                {infiniteScrollAfterAd.map((article) => (
                    <NewsCard key={article.id * 7} title={article.headline} content={article.nohtmlbody} slug={article.slug} section = {article.section} publishdate = {article.publishdate}/>
                ))}
                {isLoading && (
                    <TailSpin
                        height="40"
                        width="40"
                        color="var(--fr-red)"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{ marginTop: '16px' }}
                        visible={true}
                    />
                )}
            </InfiniteScroll>
            {loadedNews.length > 10 && (
                <ScrollToTop smooth component={<ChevronUp />} style={{boxShadow:'none', display: 'flex', backgroundColor: 'var(--fr-blue)', color: 'var(--fr-white)', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' , zIndex:'10000000'}} />
            )}
        </>
    );
};

export default MainNews;
