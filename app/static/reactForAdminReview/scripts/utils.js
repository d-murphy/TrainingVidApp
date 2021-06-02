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



export {getDateCounts,getCourseCounts, getUserStatus}
