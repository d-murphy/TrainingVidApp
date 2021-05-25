from app import app, db
from app.models import User, Lesson, Course
from flask import render_template, request, flash, redirect, url_for
from flask_login import current_user, login_user, logout_user, login_required
from app.forms import LoginForm, RegistrationForm, CompleteLesson, LessonForm, CourseForm, EditCourse
from werkzeug.urls import url_parse
from app.decorators import admin_only
from app.utils import stopFileUpload, saveFileReturnFileName, changeFileReturnFileName, deleteFile, findLessonsGroups
from sqlalchemy.exc import IntegrityError


@app.route('/')
@app.route('/index')
def index():
    lessons = db.session.query(Lesson).all()
    courses = db.session.query(Course).all()
    return render_template('index.html', title="Home Page", lessons=lessons, courses=courses)

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
    lessonsComplete = len(user.lessonsComplete)
    return render_template('user.html', user=user, lessonsComplete=lessonsComplete)

@app.route('/admin/<username>')
@login_required
def admin(username):
    user = User.query.filter_by(username=username).first_or_404()
    return render_template('admin.html', user=user)


@app.route('/deleteUser/<username>')
@login_required
@admin_only
def deleteUser(username):
    user = User.query.filter_by(username=username).first_or_404()
    db.session.delete(user)
    db.session.commit()
    flash("User: {} successfully deleted.".format(user.username))
    return redirect(url_for('index'))


@app.route('/createLesson', methods=['GET', 'POST'])
@login_required
@admin_only
def createLesson():
    form = LessonForm()
    if form.validate_on_submit():
        try:
            user = current_user
            if stopFileUpload(request, 'Image'):
                return render_template('createLesson.html', title='Create Lesson', form=form)
            imgFilename = saveFileReturnFileName(request, 'Image')
            if stopFileUpload(request, 'Video'):
                return render_template('createLesson.html', title='Create Lesson', form=form)
            vidFilename = saveFileReturnFileName(request, 'Video')
            lesson = Lesson(name=form.name.data, description=form.description.data, 
                            duration=form.duration.data, imgFileLoc=imgFilename,
                            vidFileLoc=vidFilename, createdBy=user.id )
            db.session.add(lesson)
            db.session.commit()
            flash('Nice, you have created a lesson')
            return redirect(url_for('editLesson', lessonId=lesson.id))
        except IntegrityError: 
            db.session.rollback()
            flash('This title is already in use.  Please try another.')
            return redirect(url_for('createLesson'))
    return render_template('createLesson.html', title='Create Lesson', form=form)

@app.route('/editLesson/<lessonId>', methods=['GET', 'POST'])
@login_required
@admin_only
def editLesson(lessonId):
    form = LessonForm()
    lesson = Lesson.query.filter_by(id=lessonId).first_or_404()
    if form.validate_on_submit():
        lesson.name = form.name.data
        lesson.description = form.description.data
        lesson.duration = form.duration.data
        try:
            if request.files['imgFile']:
                if stopFileUpload(request, 'Image'):
                    return render_template('editLesson.html', title='Edit Course', lesson=lesson, form=form)
                lesson.imgFileLoc = changeFileReturnFileName(request, 'Image', lesson.imgFileLoc)
            if request.files['vidFile']:
                if stopFileUpload(request, 'Video'):
                    return render_template('editLesson.html', title='Edit Course', lesson=lesson, form=form)
                lesson.vidFileLoc = changeFileReturnFileName(request, 'Video', lesson.vidFileLoc)
            db.session.commit()
            flash('Your changes have been saved')
            return redirect(url_for('editLesson', lessonId=lesson.id))
        except IntegrityError: 
            db.session.rollback()
            flash('This title is already in use.  Please try another.')
            return render_template('editLesson.html', title='Edit Course', lesson=lesson, form=form)
    elif request.method == 'GET':
        form.name.data = lesson.name
        form.description.data = lesson.description
        form.duration.data = lesson.duration
    return render_template('editLesson.html', title='Edit Course', lesson=lesson, form=form)

@app.route('/lesson/<lessonId>', methods=['GET', 'POST'])
@login_required
def lesson(lessonId):
    lesson = Lesson.query.filter_by(id=lessonId).first_or_404()
    form = CompleteLesson()
    user = current_user
    if form.validate_on_submit():
        user.completeLesson(lesson)
        db.session.commit()
        # flash('Congratulations, you have finished the lesson')
        return redirect(url_for('user', username=user.username))
    return render_template('lesson.html', title='Lesson', form=form, lesson=lesson)

@app.route('/deleteLesson/<lessonId>')
@login_required
@admin_only
def deleteLesson(lessonId):
    lesson = Lesson.query.filter_by(id=lessonId).first_or_404()
    deleteFile('Image', lesson.imgFileLoc)
    deleteFile('Video', lesson.vidFileLoc)
    db.session.delete(lesson)
    db.session.commit()
    flash("Lesson '{}' successfully deleted.".format(lesson.name))
    return redirect(url_for('index'))

@app.route('/createCourse', methods=['GET', 'POST'])
@login_required
@admin_only
def createCourse():
    form = CourseForm()
    lessonGroups = findLessonsGroups(course=None)   
    if form.validate_on_submit():
        user = current_user
        if stopFileUpload(request, 'Image'):
            return render_template('createCourse.html', title='Create Course', form=form)
        imgFilename = saveFileReturnFileName(request, 'Image')
        course = Course(name=form.name.data, description=form.description.data, 
                        imgFileLoc=imgFilename, createdBy=user.id )
        course.lessonsIncluded = []
        lessonsToAppend = form.lessonsIncluded.data.split(',')[:-1]
        for lessonId in lessonsToAppend:
            lessonObj = Lesson.query.get(lessonId)
            course.lessonsIncluded.append(lessonObj)
        db.session.add(course)
        db.session.commit()
        flash('Course created successfully.')
        return redirect(url_for('editCourse', courseId=course.id))
    return render_template('createCourse.html', title='Create Course', form=form,
        lessonsInCourse=lessonGroups['lessonsInCourse'], 
        lessonsUserCreated=lessonGroups['lessonsUserCreated'], 
        lessonsOthersCreated=lessonGroups['lessonsOthersCreated'])

@app.route('/editCourse/<courseId>', methods=['GET','POST'])
@login_required
@admin_only
def editCourse(courseId):
    form = CourseForm()
    course = Course.query.filter_by(id=courseId).first_or_404()
    if form.validate_on_submit():
        course.name = form.name.data
        course.description = form.description.data
        course.lessonsIncluded = []
        lessonsToAppend = form.lessonsIncluded.data.split(',')[:-1]
        for lessonId in lessonsToAppend:
            lessonObj = Lesson.query.get(lessonId)
            course.lessonsIncluded.append(lessonObj)
        if request.files['imgFile']:
            if stopFileUpload(request, 'Image'):
                return render_template(url_for('editCourse'), courseId=courseId, title='Edit Course', form=form)
            course.imgFileLoc = changeFileReturnFileName(request, 'Image', course.imgFileLoc)
        db.session.commit()
        flash('Your changes were saved')
        return redirect(url_for('editCourse', courseId=courseId))
    elif request.method == 'GET':
        lessonGroups = findLessonsGroups(course)
        lessonIDsInCourse = set([lesson.id for lesson in lessonGroups['lessonsInCourse']])
        form.name.data = course.name
        form.description.data = course.description
        form.lessonsIncluded.data = ''.join(str(lessonID) + ',' for lessonID in lessonIDsInCourse ) 
    return render_template('editCourse.html', title='Edit Course', course=course, form=form,
        lessonsInCourse=lessonGroups['lessonsInCourse'], 
        lessonsUserCreated=lessonGroups['lessonsUserCreated'], 
        lessonsOthersCreated=lessonGroups['lessonsOthersCreated'], 
        lessonIDsInCourse=lessonIDsInCourse)

@app.route('/course/<courseId>')
@login_required
def course(courseId):
    course = Course.query.filter_by(id=courseId).first_or_404()
    return render_template('course.html', title='Course', course=course)

@app.route('/deleteCourse/<courseId>')
@login_required
@admin_only
def deleteCourse(courseId):
    course = Course.query.filter_by(id=courseId).first_or_404()
    deleteFile('Image', course.imgFileLoc)
    db.session.delete(course)
    db.session.commit()
    flash("Course '{}' successfully deleted.".format(course.name))
    return redirect(url_for('index'))

@app.route('/displayImg/<filename>')
def displayImg(filename):
	return redirect(url_for('static', filename='uploads/image/' + filename), code=301)

@app.route('/displayVid/<filename>')
def displayVid(filename):
	return redirect(url_for('static', filename='uploads/video/' + filename), code=301)
