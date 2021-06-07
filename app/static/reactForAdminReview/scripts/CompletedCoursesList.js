const CompletedCoursesList = ({courseNamesArr}) => {
    return (
        <div className="CompletedCourseList">
            <h3>Completed Courses:</h3>
            <ul>
                {courseNamesArr.map((el,i) => {
                    if(el.completionCount>1){
                        return <li key={i}>{el.coursename} ({el.completionCount})</li>
                    }
                    return <li key={i}>{el.coursename}</li>
                })}
            </ul>
        </div>
    )
} 

export default CompletedCoursesList