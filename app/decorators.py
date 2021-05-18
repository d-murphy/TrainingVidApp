from flask_login import current_user
from flask import flash, redirect, url_for
from functools import wraps

def admin_only(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.adminPrivilege:
            flash('Admin credentials required for this action.')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function