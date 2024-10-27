import React, { useEffect, useState,useMemo } from 'react';
import { Text } from '@visx/text';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { scaleLog } from '@visx/scale';
import { ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import axios from 'axios';

const WordCloudPlot = styled.div`
  .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
        }
        .wordcloud svg {
          margin: 1rem 0;
          cursor: pointer;
        }

        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .wordcloud textarea {
          min-height: 100px;
        }
`;



const WordCloud = () => {
  const [timePeriod, setTimePeriod] = useState('1w');
  const [data, setData] = useState([]);

  const fetchData = async (period) => {
    try {
      const response = await axios.get('https://carmagnole.ohnoimded.com/api/analytics/plotdata/', {
        params: {
          plot_type: 'wordcloud',
          timeperiod: period,
        },
      });
      const fetchedData = response.data['data'];
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };

  useEffect(() => {
    fetchData(timePeriod);

  }, [timePeriod]);

  const fontScale = useMemo(() => {
    if (data.length === 0) return scaleLog({ domain: [1, 1], range: [10, 100] }); 
    return scaleLog({
      domain: [Math.min(...data.map((w) => w.count)), Math.max(...data.map((w) => w.count))],
      range: [10, 100],
    });
  }, [data]);
  
  const colors = ['#e15f5f', '#002654', '#6EACDA', '#0d4f9e', '#8899A6', '#00c9b7'];
  const fontSizeSetter = (datum) => fontScale(datum.count);
  
  return (
        <>
    <WordCloudPlot>
      <div style={{ marginBottom: '20px' }}>
        {[
          { value: '1d', label: '1 day' },
          { value: '1w', label: '1 week' },
          { value: '1m', label: '1 month' },
        ].map(({ value, label }) => (
          <button
          key={value}
          className={timePeriod === value ? 'btn-innerChart' : 'btn-innerChart-unselected'}
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
      <div width="100%" height="500px">
        {data.length > 0 ? (
          <Wordcloud
          words={data}
          width={800}
          height={500}
          fontSize={fontSizeSetter}
          spiral={'archimedean'}
          padding={2}
          // rotate={() => Math.random() > 0.5 ? 0 : 90}
          rotate={() => Math.random() > 0.5 ? 90 : 0}
          >
            {(cloudWords) =>
              cloudWords.map((w, i) => (
                <Text
                key={w.word}
                fill={colors[i % colors.length]}
                textAnchor="middle"
                transform={`translate(${isNaN(w.x) ? 0 : w.x}, ${isNaN(w.y) ? 0 : w.y}) rotate(${w.rotate})`}
                fontSize={w.size}
                fontFamily={'Segoe UI'}
                color='white'>
                  {w.word}
                </Text>
              ))
            }
          </Wordcloud>) : (
            <div style={{ textAlign: 'center', margin: '20px' }}>Loading data...</div>
          )}
      </div>
    </WordCloudPlot>
          </>
  );
};

export default WordCloud;
