from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, IntegerField, TextAreaField 
from wtforms.validators import DataRequired, ValidationError, Email, EqualTo, NumberRange
from app.models import User

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    password2 = PasswordField('Repeat Password', validators=[DataRequired(), EqualTo('password')])
    adminPrivilege = BooleanField('Admin User?')
    submit = SubmitField('Register')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('Please use a different username.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError('Please use a different email address.')

class LessonForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    description = TextAreaField ('Description', validators=[DataRequired()])
    duration = IntegerField('Duration (Minutes)', validators=[DataRequired(), NumberRange(min=0, message='Must enter a number greater than 0')])
    submit = SubmitField('Create')

class CompleteLesson(FlaskForm):
    submit = SubmitField('Complete Lesson')

class CourseForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    description = TextAreaField ('Description', validators=[DataRequired()])
    submit = SubmitField('Create')

class EditCourse(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    description = TextAreaField ('Description', validators=[DataRequired()])
    lessonsIncluded = TextAreaField('LessonsIncluded')
    submit = SubmitField('Create')


