import React, { useEffect, useState, useRef } from 'react';
import * as d3 from "d3";
import { ResponsiveContainer } from 'recharts';
import axios from 'axios';
// import geoData from './countries.geo.json'

const HotspotsChoropleth = () => {
    const svgRef = useRef(null);
    const [timePeriod, setTimePeriod] = useState('2w');
    const [data, setData] = useState([]);
    const [geoData,setGeoData] = useState({})

    const fetchData = async (period) => {
        try {
            const response = await axios.get('https://carmagnole.ohnoimded.com/api/analytics/plotdata/', {
                params: {
                    plot_type: 'geo_hotspots',
                    timeperiod: period,
                },
            });
            const fetchedData = response.data['data']
            const geoDataResponse = await axios.get("https://carmagnole.ohnoimded.com/assets/bigChungus/countries.geo.json", {withCredentials: false})

            setGeoData(geoDataResponse.data);
            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };
    useEffect(() => {
        fetchData(timePeriod)
    }, [timePeriod]);

    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const { width, height } = svgElement.getBoundingClientRect();

        const svg = d3.select(svgElement)
            .attr("width", width)
            .attr("height", height);

        svg.selectAll("*").remove();

        const projection = d3.geoEquirectangular()
            .translate([width / 2, height / 2])
            .scale(120)
            .clipExtent([[0, 0], [width, height]]);

        const path = d3.geoPath().projection(projection);

        const dataById = {};
        data.forEach(d => {
            dataById[d.country] = d.count;
        });
        const tooltip = d3.select(svgElement.parentNode).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "fixed")
            .style("background", "var(--root-bg-dark2)")
            .style("color", "gray")
            .style("border", "1px solid #ccc")
            .style("border-radius", "2px")
            .style("padding", "5px")
            .style("transition", "left 0.5s ease, top 0.5s ease")
            .style("pointer-events", "none");



        const colorScale = d3.scaleLog()
            .domain([1, d3.max(data, d => d.count)]) // Domain: starting from 1 to max count (avoid log(0))
            .range([
                "rgba(0, 0, 0, 1)",  // Starting color (low value)
                "rgba(225, 95, 95, 1)"  // Ending color (max value)
            ])
            .interpolate(d3.interpolateRgb);

        svg.selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("fill", d => {
                const value = dataById[d.properties.iso_a3] || 0;
                return colorScale(value);
            })
            .attr("fill-opacity", d => (dataById[d.properties.iso_a3] ? 1 : 0.0))
            .attr("stroke", "white")
            .attr("stroke-width", 0.4)
            .on("mouseover", function (event, d) {
                const value = dataById[d.properties.iso_a3] || 0;
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`${d.properties.name}: ${value}`);

                if (value === 0) {
                    d3.select(this).transition().duration(50)
                        .style("fill", "var(--darth-dark)")  
                        .style("fill-opacity", 0.85); 
                } else {
                    d3.select(this).transition().duration(50)
                        .style("filter", "brightness(150%)");
            }})
            .on("mousemove", function (event) {

                tooltip.style("left", event.clientX + "px")
                    .style("top", event.clientY + "px");
            })
            .on("mouseout", function () {
                tooltip.transition().duration(500).style("opacity", 0);

                const value = dataById[this.__data__.properties.iso_a3] || 0;
                if (value === 0) {
                    d3.select(this).transition().duration(200)
                        .style("fill", "rgba(0, 0, 0, 0.5)") 
                        .style("fill-opacity", 0.0); 
                } else {
                    d3.select(this).transition().duration(200)
                        .style("filter", "brightness(100%)");
                }
            });

    }, [data]);

    return (
        <>
            <div style={{ marginBottom: '20px' }}>
                {[
                    { value: '1d', label: '1 day' },
                    { value: '1w', label: '1 week' },
                    { value: '2w', label: '2 weeks' },
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
                            borderWidth: '1px',
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
                    <svg ref={svgRef} viewBox="0 0 800 500"></svg>
                ) : (
                    <div style={{ textAlign: 'center', margin: '20px' }}>Loading data...</div>
                )}
            </ResponsiveContainer>
            <p>Apologies for the borders if that concerns you</p>
        </>
    );
};

export default HotspotsChoropleth;
