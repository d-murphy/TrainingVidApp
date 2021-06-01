from flask import jsonify
from app.models import usersCourseCompleteDate
from app import db
from app.api import bp 

@bp.route('/completions/', methods=['GET'])
def get_completions():
    completions = db.session.query(usersCourseCompleteDate).all()
    returnArr = []
    for completion in completions: 
        returnArr.append(
            {
             'user_id': completion.user_id, 
             'course_id': completion.course_id,
             'completion_date': completion.dateCompleted  
            }
        )
    return jsonify(returnArr)