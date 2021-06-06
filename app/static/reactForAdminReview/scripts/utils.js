import moment from 'moment'

// const getDateCounts = function(completionsArray){
//     let dateCounts = completionsArray.map(el => {
//         let displayDate = moment(el.completion_date).format("MM/DD/YY")
//         let dayCount = moment(el.completion_date).format("DDD")
//         let dayCountYr = moment(el.completion_date).format("YYYY")
//         return {
//             'displayDate': displayDate,
//             'dayCount': dayCount,
//             'dayCountYr': dayCountYr
//         }
//     }).reduce((accumulator, el) => {
//         if(!accumulator[el.displayDate]){
//             accumulator[el.displayDate] = {
//                 "completionCount" : 1,
//                 "displayDate": el.displayDate,
//                 "dayCount" : el.dayCount,
//                 "dayCountYr": el.dayCount
//             } 
//         } else {
//             accumulator[el.displayDate].completionCount += 1
//         }
//         return accumulator;
//     },{})
//     const dateCountsArr = Object.values(dateCounts);
//     return dateCountsArr
// }

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

    let currentDate = new Date()
    // change time of current date for daysFromToday calculations
    currentDate.setHours(23)
    currentDate.setMinutes(59)
    let oneDay = 1000 * 60 * 60 * 24;
    let timelineDataset = completionsArray.map(el => {
        let returnObj = {...el}
        returnObj.dateAsDateType = new Date(el.completion_date)
        returnObj.displayDate = moment(el.completion_date).format("MM/DD/YY")
        return returnObj
    }).reduce((accumulator, el) => {
            let daysFromToday = Math.floor((currentDate - el.dateAsDateType)/oneDay)
            if ( daysFromToday < 365 && !accumulator[el.displayDate]){
            accumulator[el.displayDate] = {
                "displayDate" : el.displayDate,
                "completionCount" : 1, 
                "daysFromToday": daysFromToday,
                "weekday": el.dateAsDateType.getDay(),
                "weeknum": Math.floor( (daysFromToday - currentDate.getDay() - 1)/7 ) + 1
            } 
        } else if (accumulator[el.displayDate]){
            accumulator[el.displayDate].completionCount += 1
        } 
        return accumulator
    },{})

    let eachDayOfYear = [...Array(365).keys()]
    eachDayOfYear.forEach(el => {
        let testDay = new Date(currentDate - el * oneDay)
        let testDayFormatted = moment(testDay).format("MM/DD/YY")
        if (!timelineDataset[testDayFormatted]) {
            timelineDataset[testDayFormatted] = {
                "displayDate": testDayFormatted,
                "completionCount" : 0, 
                "weekday": testDay.getDay(),
                "weeknum": Math.floor( (el - currentDate.getDay() - 1)/7 ) + 1
            }
        }
    })
    let timelineDatasetArr = Object.values(timelineDataset)
    return timelineDatasetArr
}

const getMonthAxisLocations = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let currentDate = new Date()
    let monthNamesOrdered = []
    let monthNamesLocation = []
    let oneDay = 1000 * 60 * 60 * 24;
    let arrTo12 = [...Array(12).keys()]
    arrTo12.forEach(el => {
        let dayOneOfMonth = new Date(currentDate)
        if(currentDate.getMonth()>=el) {
            dayOneOfMonth.setMonth(dayOneOfMonth.getMonth() - el)
        } else {
            dayOneOfMonth.setFullYear(dayOneOfMonth.getFullYear() )
            dayOneOfMonth.setMonth(dayOneOfMonth.getMonth() - el)
        }
        let dayOneOfMonthFromToday = Math.floor((currentDate - dayOneOfMonth)/oneDay)
        let weekNumOfDayOneOfMonth = Math.floor( (dayOneOfMonthFromToday - currentDate.getDay() - 1)/7 ) + 2
        monthNamesOrdered.push(monthNames[dayOneOfMonth.getMonth()])
        monthNamesLocation.push(weekNumOfDayOneOfMonth)
    });
    return({
        "monthNamesOrdered":monthNamesOrdered,
        "monthNamesLocation":monthNamesLocation
    })
}


export {getCourseCounts, getUserStatus, getTimelineDataset, getMonthAxisLocations}
