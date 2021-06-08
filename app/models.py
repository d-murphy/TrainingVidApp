from enum import unique
from app import db, login
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.types import TypeDecorator
import uuid


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

class usersCourseCompleteDate(db.Model):
    def __init__(self, user=None, course=None):
#        self.id = str(uuid.uuid4())
        self.user = user
        self.course = course
        self.dateCompleted = datetime.utcnow()

    __tablename__ = 'usersCourseCompleteDate'
#    id = db.Column(db.String, primary_key=True, unique=True)
    id = db.Column(db.Integer, primary_key=True, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)
    dateCompleted = db.Column('date_completed', db.DateTime, index=True, default=datetime.utcnow)
    user = db.relationship("User", backref=db.backref("usersCourseCompleteDate", cascade="all, delete-orphan"))
    course = db.relationship("Course", backref=db.backref("usersCourseCompleteDate",cascade="all, delete-orphan"))


class User(UserMixin, db.Model):

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def completeLesson(self, lesson):
        self.lessonsComplete.append(lesson)
        
    def completeCourse(self, course):
        self.usersCourseCompleteDate.append(usersCourseCompleteDate(user=self, course=course))
    
    def unEnrollFromCourse(self, course):
        self.coursesEnrolled.remove(course)

    def getUsersCompletedCourses(self):
        usersCompletedCourses = Course.query.join(
            usersCourseCompleteDate, (usersCourseCompleteDate.course_id == Course.id)
            ).filter(
                usersCourseCompleteDate.user_id == self.id
            )
        return usersCompletedCourses

    def getUsersEnrolledCoursesCt(self):
        return(len(self.coursesEnrolled))

    def to_dict(self):
        data = {
            'id': self.id, 
            'username': self.username,
            'coursesComplete': self.getUsersCompletedCourses().count(),
            'coursesEnrolled': self.getUsersEnrolledCoursesCt(),
        }
        return data
        
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
    coursesComplete = db.relationship('Course', secondary='usersCourseCompleteDate', viewonly=True)


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
    usersCompleted = db.relationship('User', secondary='usersCourseCompleteDate', viewonly=True)


@login.user_loader
def load_user(id):
    return User.query.get(int(id))



