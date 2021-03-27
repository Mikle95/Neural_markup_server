import json
import os

def save_project(jsonStr, username):
    project = json.loads(jsonStr)
    dir = "store/" +  project["project"]["pname"]
    filename =dir + "/" + username + ".json"
    if not os.path.exists(dir):
        os.mkdir(dir)
    with open(filename, "w") as write_file:
        json.dump(project, write_file)

def load_project(pname, username):
    dir = "store/" + pname
    filename = dir + "/" + username + ".json"
    if os.path.exists(filename) and os.path.isfile(filename):
        with open(filename) as read_file:
            jsonStr = read_file.read()
        return jsonStr
    else:
        return ''

def delete_project(pname, username):
    dir = "store/" + pname
    filename = dir + "/" + username + ".json"
    if os.path.exists(filename) and os.path.isfile(filename):
        os.remove(filename)