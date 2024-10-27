import { createGlobalStyle } from 'styled-components';
// import NewsCycle400 from '../assets/fonts/news-cycle-v23-latin_latin-ext-regular.woff2';
// import NewsCycle700 from '../assets/fonts/news-cycle-v23-latin_latin-ext-700.woff2';

  // @font-face {
  //   font-family: 'News Cycle';
  //   font-style: normal;
  //   font-weight: 400;
  //   font-display: swap;
  //   src: url(${NewsCycle400}) format('woff2');
  // }

  // @font-face {
  //   font-family: 'News Cycle';
  //   font-style: normal;
  //   font-weight: 700;
  //   font-display: swap;
  //   src: url(${NewsCycle700}) format('woff2');
  // }

const GlobalStyles = createGlobalStyle`

  :root {
    --root-bg-dark: #8899A6;
    --root-bg-dark: cream;
    --root-bg-dark2: #121212;
    --root-card-bg-dark: #282828;
    --fr-blue: #002654;
    --fr-red: #e15f5f;
    --fr-white: #FFFF;
    --shadow-color: rgba(0, 0, 0, 0.1);
    --border-color: #ccc;
    --bg-light: #FCFBF4;
    --bg-light: #FFFFF0;
    --darth-dark: #333333;
    --darth-light: #b8b3ad;
    --price-red:#e15f5f;
    --price-green:#00c9b7;
    // --bg-light: white;
    // --btn-selected: #0049a1;
  --thick-background: #000000;
  --neutral-text: #c5c2be;
  --selection-background: #0d4f9e;
  --plot-fill-blue: #6EACDA;
  --plot-fill-ivory: #f0f0f0;
  --selection-text: #d3d1cf;
  background-color: var(--thick-background); 
  color:var(--neutral-text); 
    a{
    color:var(--neutral-text);
    }
  }

  html { overflow-y:scroll;     
      touch-action: manipulation;
      } // to avoid annoying layout shifts on chrome. 

  body {
  // visibility: hidden:
    min-width: 80vw;
    font-family: "Merriweather", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;    
    font-weight: 200;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    
  }

  .main-container {
    position: relative;
    max-width: 800px;
    min-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
          // background-color: var(--root-card-bg-dark);
    margin-bottom: 100px; 

  }
`;

export default GlobalStyles;
