from app import app, db
from app.models import User, Lesson
from flask import render_template, request, flash, redirect, url_for
from flask_login import current_user, login_user, logout_user, login_required
from app.forms import LoginForm, RegistrationForm, CompleteLesson, LessonForm
from werkzeug.urls import url_parse
from app.decorators import admin_only

@app.route('/')
@app.route('/index')
@login_required
def index():
    return render_template('index.html', title="Home Page", lessons={})

@app.route('/login', methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', title="Sign In", form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data, adminPrivilege=form.adminPrivilege.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route('/user/<username>')
@login_required
def user(username):
    user = User.query.filter_by(username=username).first_or_404()
    return render_template('user.html', user=user)

@app.route('/lesson/<lessonId>', methods=['GET', 'POST'])
@login_required
def lesson(lessonId):
    lesson = Lesson.query.filter_by(id=lessonId).first_or_404()
    form = CompleteLesson()
    user = current_user
    if form.validate_on_submit():
        user.completeLesson(lesson)
        db.session.commit()
        flash('Congratulations, you have finished the lesson')
        redirectUrl = '/user/' + user.username
        print(redirectUrl)
        return redirect(url_for('user', username=user.username))
    return render_template('lesson.html', title='Lesson', form=form, lesson=lesson)

@app.route('/createLesson', methods=['GET', 'POST'])
@login_required
#@admin_only
def createLesson():
    form = LessonForm()
    if form.validate_on_submit():
        user = current_user
        lesson = Lesson(name=form.name.data, description=form.description.data, 
                        duration=form.duration.data, createdBy=user.id )
        db.session.add(lesson)
        db.session.commit()
        flash('Nice, you have created a lesson')
        return redirect(url_for('user', username=user.username))
    return render_template('createLesson.html', title='Create Lesson', form=form)

