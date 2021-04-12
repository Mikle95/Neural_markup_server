import json
import os
import dataBaseController as dbc
import shutil

def save_project(jsonStr, username):
    project = json.loads(jsonStr)
    if project["project"]["pname"] == "New Project":
        return ""
    dir = "store/" +  project["project"]["pname"]
    filename =dir + "/" + username + ".json"
    if not os.path.exists(dir):
        # if dbc.get_user(username).rights == "admin":
        #     os.mkdir(dir)
        # else:
        return

    if not os.path.exists(filename):
        dbc.add_new_project(project["project"]["pname"], username)
    with open(filename, "w", encoding='utf8') as write_file:
        json.dump(project, write_file, ensure_ascii=False)

def load_project(pname, username):
    dir = "store/" + pname
    filename = dir + "/" + username + ".json"
    if os.path.exists(filename) and os.path.isfile(filename):
        with open(filename, encoding='utf8') as read_file:
            jsonStr = read_file.read()
        return jsonStr
    else:
        return ''


def delete_project(pname):
    dir = "store/" + pname
    # dbc.delete_project(pname)
    os.remove(dir)


def delete_user_project(pname, username):
    if not dbc.delete_user_project(pname, username):
        return 'Exception!'
    dir = "store/" + pname
    filename = dir + "/" + username + ".json"
    if os.path.exists(filename) and os.path.isfile(filename):
        os.remove(filename)
    return "success!"


def add_user_project(stringJS):
    newProj = json.loads(stringJS)
    dir = "store/" + newProj['pname']
    filename = dir + "/" + newProj['username'] + ".json"
    if not os.path.exists(dir):
        return ""

    if os.path.exists(filename):
        return "exist!"
    elif os.path.exists(dir + "/admin.json"):
        admin = open(dir  + "/admin.json", 'rb')
        user = open(filename, 'wb')
        shutil.copyfileobj(admin, user)
        return 'success!'
    else:
        return "wrong!"


def create_project(pname):
    dir = 'store/' + pname
    if not os.path.exists(dir):
        os.mkdir(dir)
    filename = dir + "/admin.json"
    with open('store/empty_project.json', 'r') as empty:
        data = json.load(empty)
    data["project"]["pname"] = pname
    with open(filename, 'w') as newProj:
        json.dump(newProj, data)


def create_dataset(pname, data):
    if pname != "admin":
        return

def delete_dataset(pname, data):
    if pname != "admin":
        return

def load_dataset(pname, data):
    if pname != "admin":
        return