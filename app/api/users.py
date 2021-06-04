from flask import jsonify
from app.models import usersCourseCompleteDate, Course, User
from app import db
from app.api import bp 


@bp.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    returnArr=[]
    completions = db.session.query(usersCourseCompleteDate,Course,User).filter(
        usersCourseCompleteDate.course_id == Course.id 
    ).filter(
        usersCourseCompleteDate.user_id == User.id
    ).filter(
         usersCourseCompleteDate.user_id == id
    ).all()
    for completion in completions:
        print(completion)
        returnArr.append(
                {
                'user_id': completion[0].user_id, 
                'course_id': completion[0].course_id,
                'completion_date': completion[0].dateCompleted,
                'username': completion[2].username,
                'coursename': completion[1].name
                }
            )
    return jsonify(returnArr)


@bp.route('/users/', methods=['GET'])
def get_users():
    users = db.session.query(User).all()
    returnArr = [User.query.get_or_404(user.id).to_dict() for user in users]
    return jsonify(returnArr)
