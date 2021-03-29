from app import db
from app.models import User, Markup
import json


def add_user(login, password):
    u = User(username=login)
    u.set_password(password)
    db.session.add(u)
    db.session.commit()

# def check_user(login, password):
#     users = User.quary.find(login)


def get_projects(user):
    user_projs = Markup.quary.filter_by(user_id=user.id)
    projects = []
    for a in user_projs:
        projects.append(Markup.quary.filter_by(filename=a.filename))
    return form_via_project_file(projects)


def form_via_project_file(projects):
    # TODO: forming via project json
    return str(projects)

def test_projects_names():
    data = ["SomeProject1", "SomeProject2", "My Test Project"]
    return json.dumps(data)