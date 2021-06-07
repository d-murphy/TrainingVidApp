import * as d3 from 'd3'
import { useResizeDetector } from 'react-resize-detector'
import { useEffect, useRef } from 'react'
import { getMonthAxisLocations } from './utils.js'

const Timeline = ({completionData, countColName, xAxisColName, yAxisColName, 
                    cssClassName, chartTitle, labelColName}) => {

    const xAxisRef = useRef(null)
    const yAxisRef = useRef(null)

    const {width: widthRs, ref} = useResizeDetector();

    const HEIGHT = 225
    const MARGIN = {top: 25, right:20, bottom: 30, left: 40}
    const INNERPAD = .1
    const OUTERPAD = 0
    
    let monthNamesOrdered, monthNamesLocation
    ({monthNamesOrdered, monthNamesLocation} = getMonthAxisLocations())

    const xScale = d3.scaleBand()
        .domain([...Array(53).keys()])
        .range([widthRs-MARGIN.right - MARGIN.left,0])
        .padding(INNERPAD)
        .paddingOuter(OUTERPAD)

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickValues(monthNamesLocation)
        .tickFormat((d, i) => monthNamesOrdered[i]) 
        .tickSize(0)

    const yScale = d3.scaleBand()
        .domain([6,5,4,3,2,1,0])
        .range([MARGIN.top, HEIGHT-MARGIN.bottom])
        .paddingInner(INNERPAD)
        .paddingOuter(OUTERPAD)

    const weekdayLut = { 0: "Su", 1: "M", 2:"Tu", 3:"W", 4:"Th", 5:"F", 6:"Sa"}
    const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat((d) => weekdayLut[d])

    const colorScale = d3.scaleLinear()
        .domain([0,3])
        .range(["#EEE", "#69b3a2"])
      

    useEffect(() => {
        d3.select(xAxisRef.current).call(xAxis) 
        d3.select(yAxisRef.current).call(yAxis)
    },[xAxis,yAxis])

    let cssClass = cssClassName + " Timeline"
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
                    {completionData.map((d,i) => {
                        return(
                            <rect key={i}
                                x={xScale(d[xAxisColName])+MARGIN.left}
                                y={yScale(d[yAxisColName])}
                                height={yScale.bandwidth()}
                                width={xScale.bandwidth()}
                                fill= {colorScale(d[countColName])}
                                message={`<center><b>${d[labelColName]}</b><br/><br/>
                                          <b>Course Completions</b>: ${d[countColName]}<br />
                                          </center>`}
                            />
                        )
                    })}
                </g>
                <g>
                    <g ref={xAxisRef} transform={`translate(${MARGIN.left} ${HEIGHT-MARGIN.bottom})`}/>
                    <g ref={yAxisRef} transform={`translate(${MARGIN.left} 0)`}/>
                    <g>
                        <text transform={`translate(${widthRs-widthRs*.6} ${MARGIN.top-8}) `}
                         className="title">{chartTitle}</text>
                    </g>
                </g>
            </svg>            
        </div>
    )
    
}
export default Timeline

