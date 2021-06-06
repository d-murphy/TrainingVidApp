import * as d3 from 'd3'
import { useResizeDetector } from 'react-resize-detector'
import { useEffect, useRef } from 'react'

const Timeline = ({completionData, countColName, xAxisColName, yAxisColName, 
                    cssClassName, chartTitle, labelColName}) => {

    console.log(completionData)

    const xAxisRef = useRef(null)
    const yAxisRef = useRef(null)

    const {width: widthRs, ref} = useResizeDetector();

    const HEIGHT = 225
    const MARGIN = {top: 25, right:20, bottom: 30, left: 40}
    const INNERPAD = .1
    const OUTERPAD = 0
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let currentDate = new Date()
    let dayOneOfMonth = currentDate
    let monthLut = {}
    let arrTo12 = [...Array(12).keys()]
    arrTo12.forEach(el => {
        let dayOneOfMonth = currentDate
        if(currentDate.getMonth()>el) {
            dayOneOfMonth.setMonth = dayOneOfMonth.getMonth() - el
        } else {
            dayOneOfMonth.setFullYear = dayOneOfMonth.getFullYear() - 1
            dayOneOfMonth.setMonth = dayOneOfMonth.getMonth() - el
        }
        let weekNumOfDayOneOfMonth = Math.floor( (dayOneOfMonth - currentDate.getDay() - 1)/7 ) + 1
        monthLut[weekNumOfDayOneOfMonth] = {
            "weekNumOfDayOneOfMonth": weekNumOfDayOneOfMonth,
            "monthOfWeekNum": dayOneOfMonth.getMonth(), 
            "monthName": monthNames[dayOneOfMonth.getMonth()]
        }
    });
    console.log(monthLut)

    const xScale = d3.scaleBand()
        .domain([...Array(53).keys()])
        .range([widthRs-MARGIN.right - MARGIN.left,0])
        .padding(INNERPAD)
        .paddingOuter(OUTERPAD)

    const xAxis = d3.axisBottom()
        .scale(xScale)
        // .tickFormat((d) => mthLUT[d])
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
        .domain([0,d3.max(completionData, d => d.completionCount)])
        .range(["#EEE", "#69b3a2"])
      

    useEffect(() => {
        d3.select(xAxisRef.current).call(xAxis) 
        d3.select(yAxisRef.current).call(yAxis)
    },[xAxis,yAxis])

    let cssClass = cssClassName + " Timeline"
    let idForMouseover = cssClassName + "ChartMouseover"

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
                    {/* <g>
                        <text transform={`translate(${widthRs-widthRs*.45} ${HEIGHT}) `}
                         className="yAxisLabel"># of Users</text>
                    </g> */}
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

