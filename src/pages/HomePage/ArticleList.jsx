// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';

// const NewsCards = styled.div`
//   flex-basis: 50%;
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
// `;

// const Card = styled.div`
//   background-color: #fff;
//   padding: 20px;
//   box-shadow: 0 0 10px var(--shadow-color);
//   border-radius: 10px;
// `;

// const Loading = styled.div`
//   text-align: center;
//   margin-top: 20px;
// `;

// const Error = styled.div`
//   text-align: center;
//   margin-top: 20px;
// `;

// const ArticleList = () => {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch('https://api.example.com/news')
//       .then((response) => response.json())
//       .then((data) => {
//         setArticles(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <Loading>Loading...</Loading>;
//   }

//   if (error) {
//     return <Error>Error: {error.message}</Error>;
//   }

//   return (
//     <NewsCards>
//       {articles.map((article) => (
//         <Card key={article.id}>
//           <h2>{article.title}</h2>
//           <p>{article.content}</p>
//         </Card>
//       ))}
//     </NewsCards>
//   );
// };

// export default ArticleList;
