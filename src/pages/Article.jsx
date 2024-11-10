import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import HeaderBottom from '../components/layout/HeaderBottom/HeaderBottom';
import axios from 'axios';
import { v4 as uuidv4, v4 } from 'uuid';
import { useAuth } from '../services/AuthContext';

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 5px;
`;

const Article = () => {
    const { apiToken,getApiToken,isInitialized } = useAuth();
    const { slug, section, year, month, day } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [articleMeta, setArticleMeta] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`https://carmagnole.ohnoimded.com/api/news/article/${slug}/`, {
                    params: {
                        // slug: slug,
                        // section: section
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials:true
                });
                const date_YYYYMMDD = response.data.article_data.publishdate.slice(0, 10);
                // console.log(date_YYYYMMDD)
                if (response.data.article_data.section !== section | year !== date_YYYYMMDD.slice(0, 4) | month !== date_YYYYMMDD.slice(5, 7) | day !== date_YYYYMMDD.slice(8, 10)) {
                    navigate('/404');
                    // navigate('/404', { replace: true });
                } else {
                    setArticle(response.data.article_data);
                    setArticleMeta(response.data.article_meta);
                }
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    navigate('/404', );
                }
                else if (err.response && err.response.status === 503) {
                    navigate('/503', );
                }
                else {
                    console.error('Error fetching article:', err);
                    setError('Error fetching article');
                }
            }
        };


        if(isInitialized){
            fetchArticle();
        }
    }, [isInitialized]);

    if (error) {
        navigate('*', { replace: true });
        return null;
    }
    const unescapeHTML = (string)=> {
        var elt = document.createElement("textarea");
        elt.innerHTML = string;
        // console.log(elt)
        return elt.value;
     }

    if (article) {
        // console.log( eval(article.htmlbody))
        // console.log(article.htmlbody)
        const htmlBodyArray = JSON.parse(article.htmlbody.replace(/\xad/g, '').replace(/'/g, '"').replace(/\\/g, "\\\\")); 
        return (
                <div className='main-container'>
                    {/* <HeaderBottom /> */}
                    <ContentContainer>
                        <div className='article-headline p-5 text-3xl text-justify'>{article.headline}</div>
                        <div className='article-meta publishdate' style={{display:"flex", flexDirection:'row', justifyContent:"space-between",alignItems:'center', gap:'10px', padding: "20px"}}>
                            <div className='article-publishdate' style={{fontSize:'13px'}}>Published Date: {`${day} ${new Date(article.publishdate.slice(0, 10).split('/')).toLocaleString('default', { month: 'long' })}, ${year}`}</div>
                        </div>
                        {(article.imageurl != 'nan') ? <img className='p-5' src={article.imageurl.slice(0,article.imageurl.length-7)+"1000.jpg"} alt={article.headline} /> : <></>}
                        <div className='article-meta' style={{display:"flex", flexDirection:'row', justifyContent:"space-between",alignItems:'center', gap:'10px', padding: "20px"}}>
                            {articleMeta? <div className='article-keywords' style={{fontSize:'11px', display:"flex", flexDirection:'row', gap:"5px"}}>
                                <div key="keywords">Keywords: </div>
                                {
                                    articleMeta.map((item)=> {
                                      return <div key={item.word} style={{fontStyle:'italic'}}> {item.word.charAt(0).toUpperCase() + item.word.slice(1)}</div>
                                    })
                                }
                            </div>:<div key="keywords"></div>}
                            <div className='article-readtime' style={{fontSize:'11px', padding:"5px"}}>Time to read: {(article.wordcount/238).toFixed()} mins</div>
                        </div>
                        <div className='article-content p-5 flex flex-col space-y-4'>
                            {
                            htmlBodyArray.map(item => (
                                <p className='text-justify' key={uuidv4()} dangerouslySetInnerHTML={{ __html: unescapeHTML(item) }}></p>
                                
                            ))
                            }
                        </div>
                    </ContentContainer>
                </div>
        );
    }

    // Render nothing if data is not yet fetched or error occurred
    return null;
};

export default Article;
