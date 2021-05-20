from app import app, db
from app.models import User, Lesson, Course
from flask import render_template, request, flash, redirect, url_for, Flask
from flask_login import current_user, login_user, logout_user, login_required
from app.forms import LoginForm, RegistrationForm, CompleteLesson, LessonForm, CourseForm
from werkzeug.urls import url_parse
from werkzeug.utils import secure_filename
from app.decorators import admin_only
import os


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

ALLOWED_VIDEO_EXTENSIONS = {'mp4'}
ALLOWED_IMAGE_EXTENSIONS = {'jpeg', 'jpg', 'png'}

def allowed_file(filename, imgOrVid):
    if(imgOrVid == 'Image'):
        return '.' in filename and \
            filename.rsplit('.',1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS
    else: 
        return '.' in filename and \
            filename.rsplit('.',1)[1].lower() in ALLOWED_VIDEO_EXTENSIONS

def stopFileUpload(request, imgOrVid):
    formFileName = 'imgFile' if imgOrVid=='Image' else 'vidFile'
    if formFileName not in request.files:
        flash(imgOrVid + " file not included.")
        return True
    file = request.files[formFileName]
    if file.filename == '':
        flash(imgOrVid + " file not included.")
        return True
    if len(file.filename)>100:
        flash(imgOrVid + " filename is too long.")
        return True
    if not allowed_file(file.filename, imgOrVid):
        flash(imgOrVid + " file extension is not accepted.")        
        return True
    return False

@app.route('/createLesson', methods=['GET', 'POST'])
@login_required
@admin_only
def createLesson():
    form = LessonForm()
    if form.validate_on_submit():
        user = current_user
        if stopFileUpload(request, 'Image'):
            return render_template('createLesson.html', title='Create Lesson', form=form)
        imgFile = request.files['imgFile']
        imgFilename = secure_filename(imgFile.filename)
        imgFilePath = os.path.join(app.config['UPLOAD_IMAGE_FOLDER'], imgFilename)
        imgFile.save(imgFilePath)
        if stopFileUpload(request, 'Video'):
            return render_template('createLesson.html', title='Create Lesson', form=form)
        vidFile = request.files['vidFile']
        vidFilename = secure_filename(vidFile.filename)
        vidFilePath = os.path.join(app.config['UPLOAD_IMAGE_FOLDER'], vidFilename)
        vidFile.save(vidFilePath)
        lesson = Lesson(name=form.name.data, description=form.description.data, 
                        duration=form.duration.data, imgFileLoc=imgFilename,
                        vidFileLoc=vidFilename, createdBy=user.id )
        db.session.add(lesson)
        db.session.commit()
        flash('Nice, you have created a lesson')
        return redirect(url_for('user', username=user.username))
    return render_template('createLesson.html', title='Create Lesson', form=form)


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

@app.route('/displayImg/<filename>')
def displayImg(filename):
	return redirect(url_for('static', filename='uploads/image/' + filename), code=301)

@app.route('/deleteLesson/<lessonId>')
@login_required
@admin_only
def deleteLesson(lessonId):
    lesson = Lesson.query.filter_by(id=lessonId).first_or_404()
    db.session.delete(lesson)
    db.session.commit()
    flash("Lesson '{}' successfully deleted.".format(lesson.name))
    return redirect(url_for('index'))

@app.route('/createCourse', methods=['GET', 'POST'])
@login_required
@admin_only
def createCourse():
    form = CourseForm()
    if form.validate_on_submit():
        user = current_user
        course = Course(name=form.name.data, description=form.description.data, 
                        createdBy=user.id )
        db.session.add(course)
        db.session.commit()
        flash('Course created successfully.')
        return redirect(url_for('course', courseId=course.id))
    return render_template('createCourse.html', title='Create Course', form=form)

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
    db.session.delete(course)
    db.session.commit()
    flash("Course '{}' successfully deleted.".format(course.name))
    return redirect(url_for('index'))
