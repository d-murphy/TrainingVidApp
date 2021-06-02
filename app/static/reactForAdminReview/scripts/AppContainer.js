import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import moment from 'moment'

const AppContainer = function (){
    const [dailyTotals, setDailyTotals] = useState([])
    const [courseTotals, setCourseTotals] = useState([])
    const [statusTotals, setStatusTotals] = useState([])

    useEffect(() => {
        axios.get('/api/completions/')
        .then(response => {
            let dateCounts = response.data.map(el => {
                let displayDate = moment(el.completion_date).format("MM/DD/YY")
                let dayCount = moment(el.completion_date).format("DDD")
                let dayCountYr = moment(el.completion_date).format("YYYY")
                return {
                    'displayDate': displayDate,
                    'dayCount': dayCount,
                    'dayCountYr': dayCountYr
                }
            }).reduce((accumulator, el) => {
                if(!accumulator[el.displayDate]){
                    accumulator[el.displayDate] = {
                        "completionCount" : 1,
                        "displayDate": el.displayDate,
                        "dayCount" : el.dayCount,
                        "dayCountYr": el.dayCount
                    } 
                } else {
                    accumulator[el.displayDate].completionCount += 1
                }
                return accumulator;
            },{})

            const dateCountsArr = Object.values(dateCounts);
            setDailyTotals(dateCountsArr)
            console.log(dateCountsArr)
        })
        .catch(error => {
            console.log(error)
        })
      }, []);


    return (
        <h3>{dailyTotals.length} is the state length</h3>
    ) 
}

export default AppContainer