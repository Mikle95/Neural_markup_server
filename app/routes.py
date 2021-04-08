from app import app, forms
from app.models import User
from flask import Flask, jsonify, request, render_template, redirect, url_for, flash
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse
import dataBaseController
import storeManager

# https://www.youtube.com/watch?v=9MHYHgh4jYc


@app.route('/')
@app.route('/check')
def index():
    return redirect(url_for('via'))
    # if current_user.is_authenticated:
    #     return "You are authenticated, {}!".format(current_user.username)
    # else:
    #     return "You are not authenticated!"


def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()


@app.route('/shutdown', methods=['GET'])
@login_required
def shutdown():
    if current_user.rights != "admin":
        return "Permission denied"
    shutdown_server()
    return 'Server shutting down...'


@app.route('/login/', methods=["POST", "GET"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if request.method == "POST":
        name = request.form["nm"]
        password = request.form["pw"]
        user = User.query.filter_by(username=name).first()
        if user is None or not user.check_password(password):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('via')
        return redirect(next_page)
    else:
        return render_template("login.html")


@app.route('/logout/')
def logout():
    if current_user.is_authenticated:
        logout_user()
    return redirect(url_for('index'))


@app.route('/<text>')
def echo(text):
    return render_template("index.html", content=text)


@app.route('/via')
@login_required
def via():
    return render_template("_via_video_annotator.html")


@app.route('/get_all_projects/', methods=["GET", "POST"])
@login_required
def get_all_projects():
    projects =  dataBaseController.get_projects(current_user.id)
    return jsonify(projects)
    # return dataBaseController.get_projects(User.query.filter_by(username=current_user.username).first())


@app.route('/save_project/', methods=["POST"])
def save_project():
    storeManager.save_project(request.data, current_user.username)
    return "success!"


@app.route('/delete_project/', methods=["POST"])
def delete_project():
    storeManager.delete_user_project(request.data, current_user.username)
    return "success!"


@app.route('/load_project/', methods=["POST"])
def load_project():
    text = request.args.get('pname', default = '', type = str)
    return storeManager.load_project(text, current_user.username)


@app.route('/get_rights/', methods=["GET"])
def get_rights():
    return jsonify([current_user.username, current_user.rights])


@app.route('/test_post/', methods=["POST"])
@login_required
def test_post():
    return request.data


