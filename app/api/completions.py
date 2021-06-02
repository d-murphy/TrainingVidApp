from flask import jsonify
from app.models import usersCourseCompleteDate, Course, User
from app import db
from app.api import bp 

@bp.route('/completions/', methods=['GET'])
def get_completions():
    returnArr = []
    completions = db.session.query(usersCourseCompleteDate,Course,User).filter(
        usersCourseCompleteDate.course_id == Course.id 
    ).filter(
        usersCourseCompleteDate.user_id == User.id
    ).all()
    for completion in completions:
        returnArr.append(
                {
                'user_id': completion[0].user_id, 
                'course_id': completion[0].course_id,
                'completion_date': completion[0].dateCompleted,
                'username': completion[2].username,
                'coursename': completion[1].name,
                'courseDesc': completion[1].description
                }
            )
    return jsonify(returnArr)

