from app import db
from app.models import User, Markup, Project
import json


def add_user(name, password):
    u = User(username=name)
    u.set_password(password)
    db.session.add(u)
    db.session.commit()

def get_user(username):
    return User.query.filter_by(username=username).first()

def get_projects(user_id):
    user_projs = Markup.query.filter_by(user_id=user_id)
    return [a.filename for a in user_projs]


def test_projects_names():
    data = ["SomeProject1", "SomeProject2", "My Test Project"]
    return json.dumps(data)


def add_new_project(pname, user):
    if(type(user) == str):
        user_id = User.query.filter_by(username = user).first().id
        db.session.add(Markup(user_id=user_id, filename = pname))
    else:
        db.session.add(Markup(user_id=user, filename=pname))
    db.session.add(Project(pname=pname))
    db.session.commit()


def delete_user_project(pname, user):
    if(type(user) == str):
        user_id = User.query.filter_by(username=user).first().id
        db.session.remove(Markup.query.filter_by(user_id=user_id, filename = pname))
    else:
        db.session.remove(Markup.query.filter_by(user_id=user, filename=pname))
    db.session.commit()


def delete_project(pname):
    db.session.remove(Markup.query.filter_by(filename=pname))


def get_all_projects():
    return [a.pname for a in Project.query.all()]