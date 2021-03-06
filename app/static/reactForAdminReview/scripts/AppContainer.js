import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {getCourseCounts, getUserStatus, getTimelineDataset, getCompletedCourses} from './utils.js'
import HorizBar from './HorizBar'
import Timeline from './Timeline'
import CompletedCoursesList from './CompletedCoursesList'

const AppContainer = function (){
    const [callingUrl, setCallingUrlState] = useState("waitToTest")
    const [dailyCompletionTotals, setDailyCompletionTotals] = useState([])
    const [courseTotals, setCourseTotals] = useState([])
    const [allUsersStatus, setAllUsersStatus] = useState([])
    const [userDailyCompletionTotals, setuserDailyCompletionTotals] = useState([])
    const [userCoursesCompleteSt, setUserCoursesCompleteSt] = useState([])

    useEffect(() => {

        let currentUrl = window.location.href
        let pageToShow = currentUrl.split("/").slice(-1)[0]

        if (pageToShow === "adminDashboard") {
            setCallingUrlState("adminDashboard")
            axios.get('/api/users/')
            .then(response => {
                let userStatus = getUserStatus(response.data);
                setAllUsersStatus(userStatus)
            })
            .catch(error => {
                console.log(error)
            })
            axios.get('/api/completions/')
            .then(response => {
                let dateCounts = getTimelineDataset(response.data);
                setDailyCompletionTotals(dateCounts)
    
                let courseCts = getCourseCounts(response.data);
                setCourseTotals(courseCts)
            })
            .catch(error => {
                console.log(error)
            })

        } else {
            setCallingUrlState("userProfile")
            axios.get('/api/user/'+String(pageToShow))
            .then(response => {
                let userCompletionTotals = getTimelineDataset(response.data)
                setuserDailyCompletionTotals(userCompletionTotals)
                let userCoursesComplete = getCourseCounts(response.data)
                setUserCoursesCompleteSt(userCoursesComplete)
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
                    <div className="user-timeline">
                        <Timeline completionData={dailyCompletionTotals} countColName="completionCount" 
                                        xAxisColName="weeknum" yAxisColName="weekday" 
                                        cssClassName="Timeline" chartTitle="Course Completion Timeline"
                                        labelColName="displayDate" /> 
                    </div>
                </div>
                <div className="dashboardFirstRow">
                    <HorizBar countData={allUsersStatus} countColName="userCount" 
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
                <div className="dashboardSecondRow">
                    <div className="completion-list">
                        <CompletedCoursesList courseNamesArr={userCoursesCompleteSt}/>
                    </div>
                    <div className="user-timeline">
                        <Timeline completionData={userDailyCompletionTotals} countColName="completionCount" 
                                            xAxisColName="weeknum" yAxisColName="weekday" 
                                            cssClassName="Timeline" chartTitle="User Course Completion Timeline"
                                            labelColName="displayDate" />
                    </div>
                </div>
            </div>
        )
    }
}

export default AppContainer