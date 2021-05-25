from app import app
from app.models import Lesson
from flask import flash
from flask_login import current_user
from werkzeug.utils import secure_filename
from uuid import uuid4
import os, json



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

def defineFileLocations(imgOrVid):
    fileLocations = {}
    fileLocations['requestFileName'] = 'imgFile' if imgOrVid =='Image' else 'vidFile'
    fileLocations['uploadFolder'] = 'UPLOAD_IMAGE_FOLDER' if imgOrVid == 'Image' else 'UPLOAD_VIDEO_FOLDER'
    return fileLocations

def saveFileReturnFileName(request, imgOrVid):
    fileLocations = defineFileLocations(imgOrVid)

    file = request.files[fileLocations['requestFileName']]
    filename = secure_filename(file.filename)
    filename = str(uuid4()) + filename
    filepath = os.path.join(app.config[fileLocations['uploadFolder']],filename)
    file.save(filepath)
    return(filename)

def deleteFile(imgOrVid, currentFilename):
    fileLocations = defineFileLocations(imgOrVid)
    filepath = os.path.join(app.config[fileLocations['uploadFolder']],currentFilename)
    os.remove(filepath)


def changeFileReturnFileName(request, imgOrVid, currentFilename):
    deleteFile(imgOrVid, currentFilename)
    return saveFileReturnFileName(request, imgOrVid)

def findLessonsGroups(course):
    returnDict = {}
    if course == None:
        returnDict['lessonsInCourse'] = []
        lessonIDsInCourse = set()
    else:
        returnDict['lessonsInCourse'] = course.lessonsIncluded
        lessonIDsInCourse = set([lesson.id for lesson in returnDict['lessonsInCourse']])
    lessonsAll = Lesson.query.all()
    returnDict['lessonsUserCreated'] = []
    returnDict['lessonsOthersCreated'] = []
    for lesson in lessonsAll: 
        if lesson.id in lessonIDsInCourse:
            continue
        if lesson.createdBy == current_user.id:
            returnDict['lessonsUserCreated'].append(lesson)
        else:
            returnDict['lessonsOthersCreated'].append(lesson) 
    return returnDict

def formElToAppendLessons(lessonsIncludeFormEl, course):
    lessonsToAppend = lessonsIncludeFormEl.data.split(',')[:-1]
    course.lessonsIncluded = []
    for lessonId in lessonsToAppend:
        lessonObj = Lesson.query.get(lessonId)
        course.lessonsIncluded.append(lessonObj)

def formElToReturnCoursepath(lessonsIncludeFormEl):
    lessonsToAppend = lessonsIncludeFormEl.data.split(',')[:-1]
    coursePath = {}
    for i in range(len(lessonsToAppend)):
        if i < len(lessonsToAppend) - 1:
            coursePath[lessonsToAppend[i]] = lessonsToAppend[i+1]
        else:
            coursePath[lessonsToAppend[i]] = 'end'
    coursePath = json.dumps(coursePath)
    print(coursePath)
    return coursePath 
