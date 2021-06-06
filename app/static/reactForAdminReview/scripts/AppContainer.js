import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {getCourseCounts, getUserStatus, getTimelineDataset} from './utils.js'
import HorizBar from './HorizBar'
import Timeline from './Timeline'

const AppContainer = function (){
    const [callingUrl, setCallingUrlState] = useState("waitToTest")
    const [dailyTotals, setDailyTotals] = useState([])
    const [courseTotals, setCourseTotals] = useState([])
    const [statusTotals, setStatusTotals] = useState([])

    useEffect(() => {

        let currentUrl = window.location.href
        console.log(currentUrl)
        let pageToShow = currentUrl.split("/").slice(-1)[0]
        console.log(pageToShow)

        if (pageToShow === "adminDashboard") {
            setCallingUrlState("adminDashboard")
        } else {
            setCallingUrlState("userProfile")
        }
        axios.get('/api/completions/')
            .then(response => {
                let dateCounts = getTimelineDataset(response.data);
                setDailyTotals(dateCounts)
    
                let courseCts = getCourseCounts(response.data);
                setCourseTotals(courseCts)
            })
            .catch(error => {
                console.log(error)
            })

        if (pageToShow === "adminDashboard") {    
            axios.get('/api/users/')
            .then(response => {
                let userStatus = getUserStatus(response.data);
                setStatusTotals(userStatus)
            })
            .catch(error => {
                console.log(error)
            })
        }
    }, []);

    if(callingUrl === "waitToTest") {
        return(<p></p>)
    } else if (callingUrl === "adminDashboard") {
        return (
            <div className="dashboardWrapper">
                <div className="dashboardSecondRow">
                    <Timeline completionData={dailyTotals} countColName="completionCount" 
                                    xAxisColName="weeknum" yAxisColName="weekday" 
                                    cssClassName="Timeline" chartTitle="Completion Timeline"
                                    labelColName="displayDate" /> 
                </div>
                <div className="dashboardFirstRow">
                    <HorizBar countData={statusTotals} countColName="userCount" 
                            labelColName="status" cssClassName="StatusCount"
                            chartTitle="User Status Count" />
                    <HorizBar countData={courseTotals} countColName="completionCount" 
                            labelColName="coursename" cssClassName="CourseCount"
                            chartTitle="Course Completion Count" />
                </div>
            </div>
        )     
    } else {
        return (
            <div className="dashboardWrapper">
                <div className="dashboardFirstRow">
                    <Timeline completionData={dailyTotals} countColName="completionCount" 
                            labelColName="coursename" cssClassName="CourseCount"
                            chartTitle="Course Completion Count" />
                </div>
            </div>
        )
    }
}

export default AppContainer