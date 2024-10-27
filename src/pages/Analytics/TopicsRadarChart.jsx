import React, { useEffect, useState, PureComponent } from 'react';

import axios from 'axios';
import {
    Radar,
    RadarChart,
    PolarGrid, 
    PolarAngleAxis, 
    PolarRadiusAxis,
    Tooltip,
    Legend,
    ResponsiveContainer

} from 'recharts';
import { scaleLog } from 'd3-scale';

const TopicsRadarChart = () => {
    const [timePeriod, setTimePeriod] = useState('1d');
    const [data, setData] = useState([]);

    const fetchData = async (period) => {
        try {
            const response = await axios.get('https://carmagnole.ohnoimded.com/api/analytics/plotdata/', {
                params: {
                    plot_type: 'topic_counts',
                    timeperiod: period,
                },
            });
            const fetchedData = response.data['data'];
            // fetchedData.sort(function (a, b) {
            //     if (a.topic < b.topic) {
            //       return -1;
            //     }
            //     if (a.topic > b.topic) {
            //       return 1;
            //     }
            //     return 0;
            //   });

            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    useEffect(() => {
        fetchData(timePeriod);
    }, [timePeriod]);


    const scale = scaleLog().base(Math.E);

    return (
        <>
            <div style={{ marginBottom: '20px' }}>
                {[
                    { value: '1d', label: 'Today' },
                    { value: '1w', label: '1 week' },
                    { value: '2w', label: '2 weeks' },
                    { value: '1m', label: '1 month' },
                ].map(({ value, label }) => (
                    <button
                        key={value}
                        className={timePeriod === value ? 'btn-innerChart': 'btn-innerChart-unselected'}
                        onClick={() => setTimePeriod(value)}
                        style={{
                            marginRight: '5px',
                            padding: '5px 10px',
                            backgroundColor: timePeriod === value ? 'var(--plot-fill-blue)' : '',
                            color: timePeriod === value ? 'var(--darth-dark)' : 'gray',
                            borderStyle: timePeriod === value ? 'solid' : 'dotted',
                            borderColor: timePeriod === value ? 'var(--plot-fill-blue)' : 'gray',
                            borderWidth: timePeriod === value ? '1px' : '1px',
                            // border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            opacity: timePeriod === value ? 1 : 0.8,

                        }}
                    >
                        {label}
                    </button>
                ))}

            </div>
            <ResponsiveContainer width="100%" height="100%">
                {data.length > 0 ? (
                    <RadarChart
                        cx="50%" cy="50%" outerRadius="80%"
                        data={data}
                        width={500}
                        height={500}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <PolarGrid stroke="gray" strokeOpacity={0.4} />
                        <PolarAngleAxis dataKey="topic"  opacity={0.85} tick={{ fill: "var(--neutral-text)" }} />
                        <PolarRadiusAxis  opacity={0.65} style={{ fill: "var(--neutral-text)" }} tick={false}  axisLine={false} domain={['auto', 'auto']}/>
                        <Tooltip contentStyle={{ backgroundColor: "var(--root-bg-dark2)" }} cursor={{ fill: 'transparent' }} />
                        {/* <Legend /> */}
                        {/* <ReferenceLine y={0} stroke="gray" /> */}

                        <Radar dataKey="count" fill="var(--plot-fill-blue)" opacity={0.85} activeDot={{ r: 5, strokeOpacity: 0.75 }} />
                    </RadarChart>
                ) : (
                    <div style={{ textAlign: 'center', margin: '20px' }}>Loading data...</div>
                )}
            </ResponsiveContainer>
        </>
    );
};

export default TopicsRadarChart;
