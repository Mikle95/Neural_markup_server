from app import db
from app.models import User, Markup
import json


def add_user(name, password):
    u = User(username=name)
    u.set_password(password)
    db.session.add(u)
    db.session.commit()


def get_projects(user_id):
    user_projs = Markup.query.filter_by(user_id=user_id)
    return [a.filename for a in user_projs]


def test_projects_names():
    data = ["SomeProject1", "SomeProject2", "My Test Project"]
    return json.dumps(data)


def add_new_project(pname, user):
    if(type(user) == str):
        user_id = User.query.filter_by(username = user).first().id
        db.session.add(Markup.query.filter_by(user_id=user_id, filename = pname))
    else:
        db.session.add(Markup.query.filter_by(user_id=user, filename=pname))
    db.session.commit()


def delete_project(pname, user):
    if(type(user) == str):
        user_id = User.query.filter_by(username=user).first().id
        db.session.remove(Markup.query.filter_by(user_id=user_id, filename = pname))
    else:
        db.session.remove(Markup.query.filter_by(user_id=user, filename=pname))
    db.session.commit()