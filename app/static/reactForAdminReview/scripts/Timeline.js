import * as d3 from 'd3'
import { useResizeDetector } from 'react-resize-detector'
import { useEffect, useRef } from 'react'

const Timeline = ({completionData, countColName, labelColName, cssClassName, chartTitle}) => {

    console.log(completionData)
    return(<p>check the console!</p>)

    // const xAxisRef = useRef(null)
    // const yAxisRef = useRef(null)

    // countData = countData
    //     .sort((a,b) => (b[countColName] - a[countColName]))

    // const {width: widthRs, ref} = useResizeDetector();

    // const HEIGHT = 375
    // const MARGIN = {top: 25, right:20, bottom: 30, left: 130}
    // const INNERPAD = .1
    // const OUTERPAD = .5

    // const xScale = d3
    //     .scaleLinear()
    //     .domain([0, d3.max(countData.map(d=>d[countColName]))])
    //     .range([0, widthRs-MARGIN.right-MARGIN.left])
    
    // const xAxis = d3.axisBottom()
    //     .scale(xScale)
    //     .tickFormat(d3.format("1"))
    //     .ticks(3);

    // const yScale = d3
    //     .scaleBand()
    //     .domain(countData.map(d => d[labelColName]))
    //     .range([MARGIN.top, HEIGHT-MARGIN.bottom])
    //     .paddingInner(INNERPAD)
    //     .paddingOuter(OUTERPAD)
    // const yAxis = d3.axisLeft().scale(yScale)

    // useEffect(() => {
    //     d3.select(xAxisRef.current).call(xAxis) 
    //     d3.select(yAxisRef.current).call(yAxis)
    // },[xAxis,yAxis])

    // let cssClass = cssClassName + " HorizBar"
    // let idForMouseover = cssClassName + "ChartMouseover"
    // let selectionForMouseover = "#" + idForMouseover

    // useEffect(() =>{
    
    //      d3.selectAll('rect')
    //         .on('mouseover', function(event) {
    //             var tt1X = event.pageX - 90
    //             var tt1Y = event.pageY - 70
    //             d3.select(selectionForMouseover)
    //               .style("left", tt1X + "px")
    //               .style("top", tt1Y + "px")
    //               .html(event.srcElement.attributes.message.nodeValue)
    //               .classed("hidden", false)
    //         })
    //         .on("mouseout", function() {
    //             d3.select(selectionForMouseover).classed("hidden", true)
    //         })
    // })


    // return(
    //     <div className={cssClass} ref={ref} >
    //         <div id={idForMouseover} className="hidden"></div>
    //         <svg viewBox={`0 0 ${widthRs} ${HEIGHT}`}>
    //             <g >
    //                 {countData.map((d,i) => {
    //                     return(
    //                         <rect key={i}
    //                             x={MARGIN.left}
    //                             y={yScale(d[labelColName])}
    //                             height={yScale.bandwidth()}
    //                             width={xScale(d[countColName])}
    //                             fill= {cssClassName=="StatusCount" ?"rgba(140,40,140,.5)":"rgba(157,206,242,.7)"}
    //                             message={`<center><b>${d[labelColName]}</b><br/><br/>
    //                                       <b>Count</b>: ${d[countColName]}<br />
    //                                       </center>`}
    //                         />
    //                     )
    //                 })}
    //             </g>
    //             <g>
    //                 <g ref={xAxisRef} transform={`translate(${MARGIN.left} ${HEIGHT-MARGIN.bottom})`}/>
    //                 <g ref={yAxisRef} transform={`translate(${MARGIN.left} 0)`}/>
    //                 <g>
    //                     <text transform={`translate(${widthRs-widthRs*.45} ${HEIGHT}) `}
    //                      className="yAxisLabel"># of Users</text>
    //                 </g>
    //                 <g>
    //                     <text transform={`translate(${widthRs-widthRs*.6} ${MARGIN.top-8}) `}
    //                      className="title">{chartTitle}</text>
    //                 </g>
    //             </g>
    //         </svg>            
    //     </div>
    // )
    
}
export default Timeline

// const chart4 = svg4.append('g')
//     .attr('class', 'bars')
//     .attr('transform', `translate(${marginC4.left}, ${marginC4.top})`);

// const yScaleC4 = d3.scaleBand()
//     .domain([6,5,4,3,2,1,0])
//     .range([heightC4, 0])
//     .padding(0.2)

// const weekdayLut = { 0: "Su", 1: "M", 2:"Tu", 3:"W", 4:"Th", 5:"F", 6:"Sa"}

// chart4.append('g')
//   .call(d3.axisLeft(yScaleC4)
//     .tickFormat((d) => weekdayLut[d]));

// const xScaleC4 = d3.scaleBand()
//   .domain(d3.range(40))
//   .range([0, widthC4])
//   .padding(0.2)

// const mthLUT = { 0: "July", 5: "Aug", 10:"Sept", 14: "Oct", 
//                 18:"Nov", 23:"Dec", 27:"Jan", 32:"Feb", 36:"Mar"}

// chart4.append('g')
//   .attr('transform', `translate(0, ${heightC4})`)
//   .call(d3.axisBottom(xScaleC4).
//     tickFormat((d) => mthLUT[d])
//     .tickSize(0)
//   );

// const colorScale = d3.scaleLinear()
//   .domain([0,d3.max(timelinePlotData, d => d.mileage)])
//   .range(["#EEE", "#69b3a2"])


// chart4
//   .append("g")
//   .selectAll("rect")
//   .data(timelinePlotData)
//   .join("rect")
//     .attr('x', d => xScaleC4(d.weekNum))
//     .attr('y', d => yScaleC4(d.weekPos))
//     .attr('height', yScaleC4.bandwidth())
//     .attr('width', xScaleC4.bandwidth() )
//     .attr('fill', d => colorScale(d.mileage))
//   .on('mouseover', function(event, d) {
//     var tt4X = event.x - 60 - 10  // 1/2 div size + padding
//     var tt4Y = event.pageY - (d.mileage>0 ? 110 : 50)
//     d3.select("#chart4tt")
//       .style("left", tt4X + "px")
//       .style("top", tt4Y + "px")
//       .html(d.mileage == 0 ? `0 miles` : 
//             `<b>${new Date(d.date).getMonth()+1}/${new Date(d.date).getDate()}/${new Date(d.date).getFullYear()} 
//             ${new Date(d.date).getHours()}:${new Date(d.date).getMinutes() < 10 ? 
//             "0" + new Date(d.date).getMinutes() : new Date(d.date).getMinutes() }</b></br>
//             Mileage: ${d.mileage}</br>Avg Mile: ${d.averageStr}</br>(Total: ${d.timeMinsString})`)
//       .classed("hidden", false)
//   })
//   .on("mouseout", function() {
//     d3.select("#chart4tt").classed("hidden", true)
//   })

//   chart4.append('text')
//     .attr('x', widthC4 / 2 )
//     .attr('y', -.02*heightC4)
//     .attr('text-anchor', 'middle')
//     .text(`Timeline of ${Object.keys(runLUT).length} Runs`)