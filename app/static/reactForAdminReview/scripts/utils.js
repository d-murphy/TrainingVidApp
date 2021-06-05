import moment from 'moment'

const getDateCounts = function(completionsArray){
    let dateCounts = completionsArray.map(el => {
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
    return dateCountsArr
}

const getCourseCounts = function(completionsArray){
    let courseCts = completionsArray.reduce((accumulator, el) => {
        if(!accumulator[el.coursename]){
            accumulator[el.coursename] = {
                "completionCount" : 1,
                "coursename": el.coursename
            } 
        } else {
            accumulator[el.coursename].completionCount += 1
        }
        return accumulator;
    },{})
    const courseCtsArr = Object.values(courseCts);
    return courseCtsArr
}

const getUserStatus = function(userArray){

    let userStatus = userArray.map(el => {
            let status
            if (el.coursesComplete > 0 && el.coursesEnrolled === 0) {
                status = "Training Complete"
            } else if (el.coursesComplete > 0 && el.coursesEnrolled > 0) {
                status = "Some Training Complete"
            } else if (el.coursesComplete === 0 && el.coursesEnrolled > 0) {
                status = "No Training Complete"
            } else {
                status = "Not Enrolled"
            }

            return {
                "status": status
            }
        })    
        .reduce((accumulator, el) => {
            if(!accumulator[el.status]){
                accumulator[el.status] = {
                    "userCount" : 1,
                    "status": el.status
                } 
            } else {
                accumulator[el.status].userCount += 1
            }
            return accumulator;
    },{})
    const userStatusArr = Object.values(userStatus);
    return userStatusArr
}

const getTimelineDataset = function (completionsArray) {

    let currentYear = new Date().getFullYear()  
    let currentDate = new Date()
    let oneDay = 1000 * 60 * 60 * 24;
    console.log(currentDate)
    let timelineDataset = completionsArray.map(el => {
        let returnObj = {...el}
        returnObj.dateAsDateType = new Date(el.completion_date)
        returnObj.displayDate = moment(el.completion_date).format("MM/DD/YY")
        // returnObj.dayCount = moment(el.completion_date).format("DDD")
        // returnObj.year = new Date(el.completion_date).getFullYear()
        console.log(returnObj)
        return returnObj
    }).reduce((accumulator, el) => {
        // if ( (currentDate - el.dateAsDateType < 365)/oneDay && !accumulator[el.displayDate]){
            if ( (currentDate - el.dateAsDateType)/oneDay < 365 && !accumulator[el.displayDate]){

            console.log("anything here?")
            accumulator[el.displayDate] = {
                "displayDate" : el.displayDate,
                "completionCount" : 1
            } 
        } else if (accumulator[el.displayDate]){
            console.log("dup date hit")
            accumulator[el.displayDate].completionCount += 1
        } 
        return accumulator
    },{})
    console.log("end of redue",timelineDataset)
    let timelineDatasetArr = Object.values(timelineDataset)
    return timelineDatasetArr
}

export {getDateCounts,getCourseCounts, getUserStatus, getTimelineDataset}
