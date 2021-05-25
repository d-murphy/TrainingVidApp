from app import db, login
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

usersCoursesAssociation = db.Table('usersCoursesAssociation', db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('course_id', db.Integer, db.ForeignKey('course.id'))
)

usersLessonCompleteAssociation = db.Table('usersLessonCompleteAssociation', db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('lesson_id', db.Integer, db.ForeignKey('lesson.id')), 
    db.Column('date_completed', db.DateTime, index=True, default=datetime.utcnow)

)

courseVideosAssociation = db.Table('courseVideosAssociation', db.Model.metadata,
    db.Column('course_id', db.Integer, db.ForeignKey('course.id')),
    db.Column('lesson_id', db.Integer, db.ForeignKey('lesson.id'))
)


class User(UserMixin, db.Model):

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def completeLesson(self, lesson):
        self.lessonsComplete.append(lesson)
        
    def __repr__(self):
        return '<User {}>'.format(self.username) 

    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    adminPrivilege = db.Column(db.Boolean(), index=True)
    lessonsCreated = db.relationship('Lesson', backref='author', lazy='dynamic')
    coursesCreated = db.relationship('Course', backref='author', lazy='dynamic')
    coursesEnrolled = db.relationship('Course', secondary=usersCoursesAssociation, backref="courseStudents")
    lessonsComplete = db.relationship('Lesson', secondary=usersLessonCompleteAssociation, backref="lessonStudents")

class Lesson(db.Model):

    __tablename__ = 'lesson'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), index=True, unique=True)
    description = db.Column(db.String(400))
    duration = db.Column(db.Integer)
    imgFileLoc = db.Column(db.String(120))
    vidFileLoc = db.Column(db.String(120))
    dateAdded = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    createdBy = db.Column(db.Integer, db.ForeignKey('user.id'))

class Course(db.Model):
    __tablename__ = 'course'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), index=True, unique=True)
    description = db.Column(db.String(400))
    imgFileLoc = db.Column(db.String(120))
    createdBy = db.Column(db.Integer, db.ForeignKey('user.id'))
    lessonsIncluded = db.relationship('Lesson', secondary=courseVideosAssociation, backref="lessonInCourse")

@login.user_loader
def load_user(id):
    return User.query.get(int(id))


