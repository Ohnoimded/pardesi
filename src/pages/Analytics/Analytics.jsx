import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useActionState } from "react";
import axios from 'axios';
import { useAuth } from '../../services/AuthContext';
import { Audio, ThreeDots } from 'react-loader-spinner'
import PosNegLineChart from './PosNegLineChart';
import TopicsRadarChart from './TopicsRadarChart';
import MapChart from './HotspotsChoropleth';
import WordCloud from './WordCloud';


const selection ='';

const AnalyticsTab = styled.div`


font-family:  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;  
font-weight: normal;
font-size: 16px;
width:100%;



.panelTop{
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
margin-bottom:25px;
}

.plotsWindow{
display:flex;
flex-direction:column;
align-items:center;
width:100%;
gap: 10px;
}

.plotsToggleButtons{

display:flex;
flex-direction:row;
align-items:center;
justify-content:center;
gap:4px;
margin-bottom:10px;

}

.btn-plotSelect{
// background-color: var(--fr-red);
align-text:center;
background-color: var(--thick-background);
color: var(--neutral-text);
width: 150px;
padding:5px 5px 5px 5px;
border-radius:0px 0px 8px 0px;
border: 1px solid var(--plot-fill-blue);
}

.active, .btn-plotSelect:hover{
color: var(--darth-dark);
background-color: var(--plot-fill-blue);
}


// .btn-plotSelect:first-child{
// clip-path:polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%);
// }
// .btn-plotSelect:last-child{
// clip-path:polygon(0% 0%, 100% 0%, 100% 100%, 25% 100%);
// }
// .btn-plotSelect:not(:first-child):not(:last-child){
// clip-path:polygon(0% 0%, 75% 0%, 100% 100%, 25% 100%);
// }


.plotViewArea{
width:100%;
height: 500px;
width:100%;
// display:flex;
// flex-direction:column;
// align-items: center; 
// justify-content: center;

}

.btn-innerChart-unselected:hover{
border-color: white;
border-width:10px;
background-color:var(--darth-dark);
}

#beta {
    float: top;
    top: 9em;
    left: 0em;
    position: absolute; /* or fixed if you want it to always be visible */
    // transform: rotate(-45deg);
    background: red;
    color: white;
    font-weight: bold;
    padding-left: 3em;  padding-right: 3em;
    padding-top: .5em;  padding-bottom: .5em;
    border: 0;  margin: 0;
    height: auto;   width: auto;
    z-index: 999999999; /* or whatever is needed to show on top of other elements */
}
#beta::before {
    content: "⚠️ BETA ⚠️";
}
`;
const API_URL = 'https://carmagnole.ohnoimded.com';


const Analytics = () => {
    const { apiToken } = useAuth();
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [plotType, setPlotType] = useState('sentiment_daily')


    const renderPlot =() =>{
        switch (plotType){
            case 'sentiment_daily':
                return <PosNegLineChart/>
            case 'topic_counts':
                return <TopicsRadarChart/>
            case 'geo_hotspots':
                return <MapChart/>
            case 'wordcloud':
                return <WordCloud/>
        }
    };

    const handleClick = (plotName,index) =>{
        setPlotType(plotName);
        setSelectedIndex(index);
       
    };
    return (
        <AnalyticsTab>
            <div className='panelTop'>
                <h1 style={{ fontSize: "30px"}}>Analytics </h1>
            </div>
            <div className='plotsWindow'>
                <div className='plotsToggleButtons' >
                        <div 
                        role="button" 
                        onClick={() => handleClick("sentiment_daily", 0)} 
                        className={`btn-plotSelect ${selectedIndex === 0 ? "active" : ""}`} 
                        id="sentiment_daily">
                        Sentiment Daily
                    </div>

                    <div 
                        role="button" 
                        onClick={() => handleClick("topic_counts", 1)} 
                        className={`btn-plotSelect ${selectedIndex === 1 ? "active" : ""}`} 
                        id="topic_counts">
                        Popular Topics
                    </div>

                    <div 
                        role="button" 
                        onClick={() => handleClick("wordcloud", 2)} 
                        className={`btn-plotSelect ${selectedIndex === 2 ? "active" : ""}`} 
                        id="wordcloud">
                        Word Cloud
                    </div>

                    <div 
                        role="button" 
                        onClick={() => handleClick("geo_hotspots", 3)} 
                        className={`btn-plotSelect ${selectedIndex === 3 ? "active" : ""}`} 
                        id="geo_hotspots">
                        Hotspots
                    </div>
                
            </div>
                <div className='plotViewArea'>
                    {renderPlot()}
                </div>
            </div>
            {/* <hr id="beta" aria-label="Warning this page is a beta."></hr> */}
        </AnalyticsTab>
    );
};

export default Analytics;




