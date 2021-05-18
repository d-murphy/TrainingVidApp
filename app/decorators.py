from flask_login import current_user
from flask import flash, redirect, url_for

def redirect():
    flash('Admin credentials required for this action.')
    redirect(url_for('user', username=current_user.username)) 


def admin_only(func):
    def wrapper():
        if current_user.adminPrivilege:
            return func()
        else:
            return redirect()
    return wrapper

