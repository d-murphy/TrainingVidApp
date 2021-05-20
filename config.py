import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'TrueStoryKey'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_VIDEO_FOLDER = os.path.join(basedir,'app','static','uploads','video')
    UPLOAD_IMAGE_FOLDER = os.path.join(basedir,'app','static','uploads','image')
    MAX_CONTENT_LENGTH = 48 * 1000 * 1000
