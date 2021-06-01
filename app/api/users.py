from flask import jsonify
from app.models import User
from app import db
from app.api import bp 

@bp.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    return jsonify(User.query.get_or_404(id).to_dict())

@bp.route('/users/', methods=['GET'])
def get_users():
    users = db.session.query(User).all()
    returnArr = [User.query.get_or_404(user.id).to_dict() for user in users]
    return jsonify(returnArr)
