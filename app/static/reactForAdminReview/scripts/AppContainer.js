import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {getDateCounts, getCourseCounts, getUserStatus} from './utils.js'

const AppContainer = function (){
    const [dailyTotals, setDailyTotals] = useState([])
    const [courseTotals, setCourseTotals] = useState([])
    const [statusTotals, setStatusTotals] = useState([])

    useEffect(() => {
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
            console.log(userStatus)
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