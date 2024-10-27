import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { ArrowDown, ArrowUp, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { TailSpin, Bars } from 'react-loader-spinner';

const MarketDataContent = styled.div`

  flex-basis: 33%;
  display:inline-flex;
 justify-content:flex-end;

 .lucide {
  width: 12px;
  height: 12px;
  stroke-width: 3px;
}

  .ticker.container{
    display: flex;
    width:50%;
    flex-direction:column;
    align-tems:center;
    justify-content:center;
      opacity: 0;
 animation: fade-in 5s;
  }
    .ticker > .price,.change-percent,.change-symbol{
    font-size:14px;
    padding:0px 5px 0px 5px;
    }

    .ticker.name{
    font-size:15px;
    font-weight:bold;
    text-align:center;
    }



    .ticker.pricepercentsymbol{
    display: inline-flex;
    justify-content:center;
    align-items:center;
    }

    @keyframes fade-in {
  0% {
        opacity: 0;
    }
    14% {
      opacity: 1;
    }
    
    86% {
        opacity: 1;
    }
  
    100% {
      opacity: 0;
    }
}
`;



const MarketData = () => {
    const [isloading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [marketData, setMarketData] = useState([]);
    const [isEventSourceConnected, setEventSourceConnected] = useState(false);
    const retriesRef = useRef(0);



    // 
    ////////////////////////////////////////////////////////////////////////////////////////////// 
    const connectEventSource = () => {
        const source = new EventSource("https://carmagnole.ohnoimded.com/api/market_data/stream/");
        const channel = new BroadcastChannel('market_data_channel');

        source.addEventListener("stock_market_updates", (event) => {
            const content = JSON.parse(event.data);
            const sortedContent = content.sort((a, b) => a.id - b.id);
            channel.postMessage(sortedContent);
            setLoading(false);
            retriesRef.current = 0; 
        });

        source.onerror = () => {
            // console.error("Connection to server failed, reconnecting in 5 seconds");
            source.close();
            if (retriesRef.current < 5){
                retriesRef.current += 1;
                setTimeout(connectEventSource, 5000);
            }else{
                console.log("Max retries exceeded: Cannot connect to market data service.")
            }
        };
    };

    useEffect(() => {
        const channel = new BroadcastChannel('market_data_channel');

        if (!isEventSourceConnected) {
            connectEventSource();
            setEventSourceConnected(true);
        }

        channel.onmessage = (event) => {
            setMarketData(event.data);
        };
        return () => {
            channel.close()
        };
  
    }, [isEventSourceConnected]);


    useEffect(() =>{
        const intervalId = setInterval(() => {
            if (marketData.length > 0) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % marketData.length);
            }
        }, 5000);

        return () => {
            clearInterval(intervalId);
        };
    },[marketData.length])
    //
    ////////////////////////////////////////////////////////////////////////////////////////////// 


    // {String.fromCharCode(parseInt(marketData[0]['currency_unicode'].replace('U+', ''), 16))} 



    return (
        <MarketDataContent>
            {!isloading ?

                (
                    <>
                        {marketData.length > 0 && (
                            <div key={`${currentIndex}-tickercomponent`} className='ticker container '>
                                <div key={`${currentIndex}-tickername`} className='ticker name'>{marketData[currentIndex]['ticker_short']}</div>
                                <div key={`${currentIndex}-tickerpricepercentsymbol`} className='ticker pricepercentsymbol'>
                                    <div key={`${currentIndex}-tickerprice`} className='ticker price'>{marketData[currentIndex]['current_price']}</div>
                                    <div key={`${currentIndex}-tickerchangepercent`} className='ticker change-percent'>
                                        {(((marketData[currentIndex]['current_price'] - marketData[currentIndex]['last_price']) / marketData[currentIndex]['last_price']) * 100).toPrecision(2)}%
                                    </div>
                                    <div key={`${currentIndex}-tickerchangesymbol`} className='ticker change-symbol'>
                                        {(marketData[currentIndex]['current_price'] - marketData[currentIndex]['last_price']) < 0 ? <TrendingDown style={{ color: 'var(--price-red)' }} />
                                            : ((marketData[currentIndex]['current_price'] - marketData[currentIndex]['last_price']) > 0 ? <TrendingUp style={{ color: 'var(--price-green)' }} />
                                                : <Minus />)}
                                    </div>
                                </div>
                            </div>)}
                    </>
                )
                : (<>
                    <Bars
                        height="15"
                        width="15"
                        color="white"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass="bars-weather"
                        visible={true}

                    />
                    <p style={{ marginLeft: '10px', fontSize: '8px' }}>

                        Connecting to data service
                    </p>
                </>

                )
            }
        </MarketDataContent>
    );
};

export default MarketData;
