import React, { useEffect, Suspense, lazy } from 'react';
import WebFont from 'webfontloader';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import GlobalStyles from './assets/GlobalStyles';
import { AuthProvider } from './services/AuthContext';
import { TailSpin } from 'react-loader-spinner';
import RootLayout from './components/layout/RootLayout'
import Footer from './components/layout/Footer'
import './App.css';
import './index.css';

// import HomePage from './pages/HomePage/HomePage';
// import Article from './pages/Article';
// import Newsletter from './pages/NewsLetter';
// import Analytics from './pages/Analytics/Analytics';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const Article = lazy(() => import('./pages/Article'));
const Newsletter = lazy(() => import('./pages/NewsLetter'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => {
  // useEffect(() => {
  //   WebFont.load({
  //     custom: {
  //       families: ['News Cycle'],
  //       urls: [
  //         '/fonts/news-cycle-v23-latin_latin-ext-regular.woff2',
  //         '/fonts/news-cycle-v23-latin_latin-ext-700.woff2'
  //       ]
  //     }
  //   });
  // }, []);
  // useEffect(() => {
  //   window.addEventListener('load', () => {
  //     document.body.style.visibility = 'visible';
  //   });

  //   return () => {
  //     window.removeEventListener('load', () => {
  //       document.body.style.visibility = 'visible';
  //     });
  //   };
  // }, []);

  const LoadingSpinner =() =>{
    return <TailSpin height="40" width="40" color="var(--fr-red)" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{ marginTop: '16px' }} visible={true}/>
  }
  function ServerSide404() {
    React.useEffect(() => {
      window.location.href = '/404';
    }, []);

    return null;
  }
  return (
    <>
      <GlobalStyles />
      <AuthProvider>
        <Router>

          
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<Suspense fallback={<LoadingSpinner/>}><HomePage /></Suspense>} />
                <Route path="article/:section/:year/:month/:day/:slug" element={<Suspense fallback={<LoadingSpinner/>}><Article /></Suspense>} />
                <Route path="/newsletter" element={<Suspense fallback={<LoadingSpinner/>}><Newsletter /></Suspense>} />
                <Route path="/analytics" element={<Suspense fallback={<LoadingSpinner/>}><Analytics /></Suspense>} />
              </Route>
              <Route path="/404" element={<ServerSide404 />} />
              <Route path="*" element={<ServerSide404 />} />
              {/* // <Route path="/summarize" element={<Summarize />} />
          // <Route path="/analytics" element={<Analytics />} />
          // <Route path="/login" element={<Login />} />  */}
            </Routes>
        </Router>
      </AuthProvider>
      {/* <footer className='footer'>© Le Carmagnole - <span>{new Date().getFullYear()}</span></footer> */}

    </>
  );
};

export default App;
