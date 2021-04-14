function admin_panel(via, container){
    this.via = via;
    this.c = container;
}

admin_panel.prototype.toggle = function (){
    if(this.via.user_rights !== "admin"){
        _via_util_msg_show("Permission denied the administrator rights are required to run this tool");
        return;
    }

    if ( this.c.classList.contains('hide') ) {
        if(!via.editor.status())
            via.editor.toggle();
    this.show();
  } else {
    this.hide();
  }
}


admin_panel.prototype.hide = function (){
    this.c.innerHTML = '';
    this.c.classList.add('hide');
}

admin_panel.prototype.status = function(){
    return this.c.classList.contains('hide');
}


admin_panel.prototype.show = function (){
    this.project_update();
    this.show_info();
    if ( this.c.classList.contains('hide') )
        this.c.classList.remove('hide');
}

admin_panel.prototype.project_update = function (){
    var request = new XMLHttpRequest();
    request.open('GET', this.via.url + 'get_all_projects', false);
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
          try{
            this.projects = JSON.parse(request.responseText);
          }catch (err){
              alert(request.responseText);
          }
      }

    });
    request.send();

    request = new XMLHttpRequest();
    request.open('GET', this.via.url + 'get_all_users', false);
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
          try{
            this.users = JSON.parse(request.responseText);
          }catch (err){
              alert(request.responseText);
          }
      }

    });
    request.send();
}

admin_panel.prototype.show_info = function () {
    this.c.innerHTML = '';
    var toolbar = document.createElement('div');
    toolbar.setAttribute('class', 'toolbar');
    var close_button = document.createElement('button');
    close_button.setAttribute('class', 'text_button');
    close_button.innerHTML = '&times;';
    close_button.addEventListener('click', this.toggle.bind(this));
    toolbar.appendChild(close_button);

    this.project_container = document.createElement('div');
    this.project_container.setAttribute('id', 'attribute_container');
    this.project_container.setAttribute('class', 'attribute_container');
    this.project_view = document.createElement('table');
    var project_title = document.createElement('h2');
    project_title.innerHTML = 'Projects';

    this.project_container.appendChild(project_title);
    this.project_container.appendChild(this.get_create_panel());
    this.project_container.appendChild(this.project_view);

    this.content_container = document.createElement('div');
    this.content_container.setAttribute('class', 'content_container');
    this.content_container.appendChild(this.project_container);

    // add everything to container
    this.c.appendChild(toolbar);
    this.c.appendChild(this.content_container);

    this.project_container_update()
}


admin_panel.prototype.project_container_update = function () {
    if(this.project_view.innerHTML !== "") return;
    this.add_cells();

}

admin_panel.prototype.add_cells = function (){
    var keys = Object.keys(this.projects);
    for (var i = 0; i < keys.length; ++i) {
        const pname = keys[i];
        var tr = document.createElement('tr');
        var proj = this.html_element('th', keys[i]);
        var delProjBtn = _via_util_get_svg_button('micon_remove_circle', 'remove Project')
        delProjBtn.addEventListener('click', function (){
            via.ap.delete_project(pname);
        })
        proj.appendChild(delProjBtn);
        tr.appendChild(proj);
        for (var j = 0; j < this.projects[keys[i]].length; ++j)
            if(via.username !== this.projects[keys[i]][j]) {
                const usr = this.projects[keys[i]][j];
                var td = this.html_element('td', this.projects[keys[i]][j])
                var el = _via_util_get_svg_button('micon_remove_circle', 'remove ' + usr)
                el.addEventListener('click', function () {
                    via.ap.user_for_project(usr, pname, 'delete');
                })
                td.appendChild(el)
                tr.appendChild(td);
            }
        var btn = this.html_element('button', 'Add User');
        var selector = document.createElement('select');
        selector.setAttribute('style', 'width:12em;');
        this.fill_user_selector(selector);

        btn.addEventListener('click', function () {
            via.ap.user_for_project(selector.value, pname, 'add');
        })

        var td = document.createElement('td');
        td.append(selector);
        td.appendChild(btn);
        tr.appendChild(td);
        this.project_view.appendChild(tr);
    }

}

admin_panel.prototype.delete_project = function (pname){
    if (!confirm("Удалить проект " + pname + "?")) return;
    var request = new XMLHttpRequest();
    request.open('POST', via.url + 'delete_project/' + pname, true);
    request.setRequestHeader('Content-Type', 'text/json; charset=UTF-8');
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200)
        via.ap.show()
    });
    request.send();
}

admin_panel.prototype.create_project = function (pname){
    var request = new XMLHttpRequest();
    request.open('POST', via.url + 'create_project/' + pname, true);
    request.setRequestHeader('Content-Type', 'text/json; charset=UTF-8');
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200)
        via.ap.show()
    });
    request.send();
}


admin_panel.prototype.fill_user_selector = function(selector){
    for (var i = 0; i < this.users.length; ++i)
        if(this.users[i] !== via.username) {
            var oi = document.createElement('option');
            oi.setAttribute('value', this.users[i]);
            oi.innerHTML = this.users[i];
            selector.appendChild(oi);
        }
}


admin_panel.prototype.user_for_project = function(username, pname, op = 'add'){
    if (op !== 'add' && op !== 'delete') return;
    var data = {'username' : username, 'pname': pname};
    var request = new XMLHttpRequest();
    request.open('POST', via.url + op + '_user_for_project', true);
    request.setRequestHeader('Content-Type', 'text/json; charset=UTF-8');
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200)
        via.ap.show()
    });
    request.send(JSON.stringify(data));
}


admin_panel.prototype.get_create_panel = function (){
  var c = document.createElement('div');
  c.setAttribute('class', 'attribute_entry');

  this.new_project_name_input = document.createElement('input');
  this.new_project_name_input.setAttribute('type', 'text');
  this.new_project_name_input.setAttribute('placeholder', 'name of new project');
  c.appendChild(this.new_project_name_input);

  var add = document.createElement('button');
  add.setAttribute('class', 'text-button');
  add.innerHTML = 'Create project';
  add.addEventListener('click', this.on_project_create.bind(this));
  c.appendChild(add);

  return c;
}

admin_panel.prototype.html_element = function(name, text) {
  var e = document.createElement(name);
  e.innerHTML = text;
  return e;
}

admin_panel.prototype.on_project_create = function () {
    var pname = this.new_project_name_input.value
    this.create_project(pname)
}