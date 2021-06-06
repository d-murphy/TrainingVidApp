import * as d3 from 'd3'
import { useResizeDetector } from 'react-resize-detector'
import { useEffect, useRef } from 'react'

const HorizBar = ({countData, countColName, labelColName, cssClassName, chartTitle}) => {

    const xAxisRef = useRef(null)
    const yAxisRef = useRef(null)

    countData = countData
        .sort((a,b) => (b[countColName] - a[countColName]))

    const {width: widthRs, ref} = useResizeDetector();

    const HEIGHT = 300
    const MARGIN = {top: 25, right:20, bottom: 30, left: 130}
    const INNERPAD = .1
    const OUTERPAD = .5

    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(countData.map(d=>d[countColName]))])
        .range([0, widthRs-MARGIN.right-MARGIN.left])
    
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format("1"))
        .ticks(3);

    const yScale = d3
        .scaleBand()
        .domain(countData.map(d => d[labelColName]))
        .range([MARGIN.top, HEIGHT-MARGIN.bottom])
        .paddingInner(INNERPAD)
        .paddingOuter(OUTERPAD)
    const yAxis = d3.axisLeft().scale(yScale)

    useEffect(() => {
        d3.select(xAxisRef.current).call(xAxis) 
        d3.select(yAxisRef.current).call(yAxis)
    },[xAxis,yAxis])

    let cssClass = cssClassName + " HorizBar"
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
                        return(
                            <rect key={i}
                                x={MARGIN.left}
                                y={yScale(d[labelColName])}
                                height={yScale.bandwidth()}
                                width={xScale(d[countColName])}
                                fill= {cssClassName=="StatusCount" ?"rgba(140,40,140,.5)":"rgba(157,206,242,.7)"}
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
export default HorizBar