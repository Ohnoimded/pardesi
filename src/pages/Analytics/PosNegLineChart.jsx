import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const PosNegLineChart = () => {
  const [timePeriod, setTimePeriod] = useState('2w');
  const [data, setData] = useState([]);

  const fetchData = async (period) => {
    try {
      const response = await axios.get('https://carmagnole.ohnoimded.com/api/analytics/plotdata/', {
        params: {
          plot_type: 'sentiment_daily',
          timeperiod: period,
        },
      });
      const fetchedData = response.data['data']
 
      fetchedData.forEach(d => {
        // d.date = d.date;
        d.positive = parseFloat(d.positive);
        d.negative = parseFloat(d.negative);
      });
      fetchedData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };

  useEffect(() => {
    fetchData(timePeriod);
  }, [timePeriod]);

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        {[
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
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
            <XAxis dataKey="date" opacity={0.75} />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "var(--root-bg-dark2)" }} />
            <Legend  layout="horizontal" verticalAlign="top" align="right"/>
            <ReferenceLine y={0} stroke="gray" />
            <Line
              type="monotone"
              dataKey="positive"
              strokeWidth={2}
              stroke="var(--plot-fill-blue)"
              opacity="0.85"
              activeDot={{ r: 7, opacity: '0.75' }}
              dot={{ opacity: '0.5' }}
              isAnimationActive={true}
              animationDuration={500}
            />
            <Line
              type="monotone"
              dataKey="negative"
              strokeWidth={2}
              stroke="var(--fr-red)"
              opacity="0.85"
              activeDot={{ r: 7, opacity: '0.75' }}
              dot={{ opacity: '0.5' }}
              isAnimationActive={true}
              animationDuration={500}
            />
          </LineChart>
        ) : (
          <div style={{ textAlign: 'center', margin: '20px' }}>Loading data...</div>
        )}
      </ResponsiveContainer>
    </>
  );
};

export default PosNegLineChart;
