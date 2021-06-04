import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {getDateCounts, getCourseCounts, getUserStatus} from './utils.js'
import HorizBar from './HorizBar'

const AppContainer = function (){
    const [url, setUrl] = useState("waitToTest")
    const [dailyTotals, setDailyTotals] = useState([])
    const [courseTotals, setCourseTotals] = useState([])
    const [statusTotals, setStatusTotals] = useState([])

    useEffect(() => {

        let currentUrl = window.location.href
        console.log(currentUrl)
        let pageToShow = currentUrl.split("/").slice(-1)[0]
        console.log(pageToShow)

        if (pageToShow === "adminDashboard") {
            setUrl("adminDashboard")

            axios.get('/api/completions/')
            .then(response => {
                let dateCounts = getDateCounts(response.data);
                setDailyTotals(dateCounts)
    
                let courseCts = getCourseCounts(response.data);
                setCourseTotals(courseCts)
            })
            .catch(error => {
                console.log(error)
            })
    
            axios.get('/api/users/')
            .then(response => {
                let userStatus = getUserStatus(response.data);
                setStatusTotals(userStatus)
            })
            .catch(error => {
                console.log(error)
            })
        } else {
            setUrl("userProfile")
        }
    }, []);

    console.log(url);


    if(url === "waitToTest") {
        return(<p></p>)
    } else if (url === "adminDashboard") {
        return (
            <div className="dashboardWrapper">
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
                    <p>React test</p>
                </div>
            </div>
        )
    }
}

export default AppContainer