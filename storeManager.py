import json
import os
import dataBaseController

def save_project(jsonStr, username):
    project = json.loads(jsonStr)
    if project["project"]["pname"] == "New Project":
        return ""
    dir = "store/" +  project["project"]["pname"]
    filename =dir + "/" + username + ".json"
    if not os.path.exists(dir):
        os.mkdir(dir)
    if not os.path.exists(filename):
        dataBaseController.add_new_project(project["project"]["pname"], username)
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

def delete_project(pname, username):
    dataBaseController.delete_project(pname, username)
    dir = "store/" + pname
    filename = dir + "/" + username + ".json"
    if os.path.exists(filename) and os.path.isfile(filename):
        os.remove(filename)

def create_dataset(pname, data):
    if pname != "admin":
        return

def delete_dataset(pname, data):
    if pname != "admin":
        return

def load_dataset(pname, data):
    if pname != "admin":
        return