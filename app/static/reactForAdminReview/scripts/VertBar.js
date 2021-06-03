import * as d3 from 'd3'
import { useResizeDetector } from 'react-resize-detector'
import { useEffect, useRef } from 'react'

const VertBar = ({countData, countColName, labelColName, cssClassName, chartTitle}) => {

    const xAxisRef = useRef(null)
    const yAxisRef = useRef(null)

    countData = countData
        .sort((a,b) => (b[countColName] - a[countColName]))

    const {width: widthRs, ref} = useResizeDetector();

    const HEIGHT = 250
    const MARGIN = {top: 25, right:50, bottom: 30, left: 50}

    const xScale = d3
        .scaleTime()
        .domain([
            d3.min(countData.map(d=>new Date(d[labelColName]))),
            d3.max(countData.map(d=>new Date(d[labelColName])))
        ])
        .range([0, widthRs-MARGIN.right-MARGIN.left])
        .nice()
    
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.timeFormat("%Y-%m-%d"))
        .ticks(5)
    
    const barWidth = xScale(new Date("2021-06-02"))-xScale(new Date("2021-06-01"))

    const yScale = d3
        .scaleLinear()
        .domain([d3.max(countData.map(d => d[countColName])),0])
        .range([MARGIN.top, HEIGHT-MARGIN.bottom])
    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(3)

    useEffect(() => {
        d3.select(xAxisRef.current).call(xAxis) 
        d3.select(yAxisRef.current).call(yAxis)
    },[xAxis,yAxis])

    let cssClass = cssClassName + " VertBar"
    let idForMouseover = cssClassName + "ChartMouseover"
    let selectionForMouseover = "#" + idForMouseover

    useEffect(() =>{
    
         d3.selectAll('rect')
            .on('mouseover', function(event) {
                var tt1X = event.pageX - 90
                var tt1Y = event.pageY - 70
                d3.select(selectionForMouseover)
                  .style("left", tt1X + "px")
                  .style("top", tt1Y + "px")
                  .html(event.srcElement.attributes.message.nodeValue)
                  .classed("hidden", false)
            })
            .on("mouseout", function() {
                d3.select(selectionForMouseover).classed("hidden", true)
            })
    })


    return(
        <div className={cssClass} ref={ref} >
            <div id={idForMouseover} className="hidden"></div>
            <svg viewBox={`0 0 ${widthRs} ${HEIGHT}`}>
                <g >
                    {countData.map((d,i) => {
                        console.log(xScale(new Date(d[labelColName])))
                        return(
                            <rect key={i}
                                x={MARGIN.left + xScale(new Date(d[labelColName])) - barWidth/2}
                                y={yScale(d[countColName])}
                                height={yScale(0) - yScale(d[countColName])}
                                width={barWidth}
                                fill= "rgba(157,206,242,.7)"
                                message={`<center><b>${d[labelColName]}</b><br/><br/>
                                          <b>Count</b>: ${d[countColName]}<br />
                                          </center>`}
                            />
                        )
                    })}
                </g>
                <g>
                    <g ref={xAxisRef} transform={`translate(${MARGIN.left} ${HEIGHT-MARGIN.bottom})`}/>
                    <g ref={yAxisRef} transform={`translate(${MARGIN.left} 0)`}/>
                    <g>
                        <text transform={`translate(${widthRs-widthRs*.45} ${HEIGHT}) `}
                         className="yAxisLabel"># of Users</text>
                    </g>
                    <g>
                        <text transform={`translate(${widthRs-widthRs*.6} ${MARGIN.top-8}) `}
                         className="title">{chartTitle}</text>
                    </g>
                </g>
            </svg>            
        </div>
    )
    
}
export default VertBar