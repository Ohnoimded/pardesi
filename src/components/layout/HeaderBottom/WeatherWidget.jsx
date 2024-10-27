import React, { useEffect, useState } from 'react';
import getIpLocation from '../../../hooks/useIpLocation';
import { fetchWeatherApi } from 'openmeteo';
import { Thermometer, Droplets } from 'lucide-react';
import styled from 'styled-components';
import { TailSpin, Bars } from 'react-loader-spinner';


const WeatherWidgetContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    // padding:10px;
    padding-left:0px;
 
    
`;

const WeatherDetails = styled.div`
    text-align: center;
    font-size: 14px;
    display:flex;
    flex-direction:row;
    justify-content:flex-start;
    align-items: center;
    width:100%;
    
    div{
    font-size:14px;}

    .weather-container{
    display:flex;
    flex-direction:column;
    align-items:center;

    }
    
    .weather-city{
    font-size:15px;
    font-weight:bold;
    }
    .weather-stats{
    display:inline-flex;
    flex-direction:row;
    align-items:center;
    }
   
    svg {
        // horizontal-align: middle;
        padding:2px;
    }
`;

function WeatherWidget() {
    const [ipLocation, setIpLocation] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [isloading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIpLocation = async () => {
            const ip_loc = await getIpLocation();
            setIpLocation(ip_loc);
        };

        fetchIpLocation();
    }, []);

    useEffect(() => {
        if (ipLocation) {
            const fetchWeather = async () => {
                const params = {
                    "latitude": ipLocation.latitude,
                    "longitude": ipLocation.longitude,
                    "current": ["temperature_2m", "relative_humidity_2m"],
                    "forecast_days": 1,
                    headers: {
                        "Access-Control-Allow-Credentials": true, 'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                    }
                };
                const url = "https://api.open-meteo.com/v1/forecast";
                const responses = await fetchWeatherApi(url, params);
                const response = responses[0];
                const utcOffsetSeconds = response.utcOffsetSeconds();
                await new Promise(r => setTimeout(r, 204));

                const current = response.current();
                const weatherData = {
                    current: {
                        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                        temperature2m: current.variables(0).value(),
                        relativeHumidity2m: current.variables(1).value(),
                    },
                };
                if (weatherData) {

                    setWeatherData(weatherData);
                    setLoading(false);
                }
            };

            fetchWeather();

            const intervalId = setInterval(fetchWeather, 900000);

            return () => clearInterval(intervalId);
        }
    }, [ipLocation]);

    return (
        <WeatherWidgetContainer>
            {weatherData || !isloading ? (
                <WeatherDetails>{
                    ipLocation.city ?
                        (<div className='weather-container'>
                            <div className='weather-city'>{ipLocation.city} </div>
                            {/* <div style={{margin:'5px',color:"var(--fr-red)",fontSize:'12px',fontWeight:'800'}}> |</div> */}
                            <div className='weather-stats'>
                                <Thermometer size={20} /><div>{parseFloat(weatherData.current.temperature2m).toFixed(1)} °C </div>
                                <div style={{ padding: '5px', color: "var(--fr-red)", fontSize: '15px', fontWeight: '800' }}> |</div>
                                <Droplets size={20} /><div> {weatherData.current.relativeHumidity2m}%</div>
                            </div>
                        </div>
                        )
                        : <></>
                }

                </WeatherDetails>
            ) : (<>
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

                    Loading Weather Info
                </p>
            </>

            )}
        </WeatherWidgetContainer>
    );
}

export default WeatherWidget;
