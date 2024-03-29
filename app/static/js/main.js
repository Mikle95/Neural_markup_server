function main(via_container, url) {
  this.user_rights = 'user'
  this.username = '---'
  this.url = url;

  this._ID = 'main';
  this.container = via_container;

  this.d  = new data();
  var conf = { 'ENDPOINT': _VIA_REMOTE_STORE };
  this.s  = new share(this.d, conf);

  if ( typeof(_VIA_DEBUG) === 'undefined' || _VIA_DEBUG === true ) {
    // ADD DEBUG CODE HERE (IF NEEDED)
  }

  //// define the html containers
  this.control_panel_container = document.createElement('div');
  this.control_panel_container.setAttribute('id', 'via_control_panel_container');
  this.container.appendChild(this.control_panel_container);

  this.view_container = document.createElement('div');
  this.view_container.setAttribute('id', 'view_container');
  this.container.appendChild(this.view_container);

  this.editor_container = document.createElement('div');
  this.editor_container.setAttribute('id', 'editor_container');
  this.editor_container.classList.add('hide');
  this.container.appendChild(this.editor_container);

  this.admin_container = document.createElement('div');
  this.admin_container.classList.add('hide');
  this.admin_container.setAttribute('id', 'admin_container');
  // this.admin_container.setAttribute('class', 'editor_container')
  this.container.appendChild(this.admin_container);



  this.message_container = document.createElement('div');
  this.message_container.setAttribute('id', '_via_message_container');
  this.message_container.setAttribute('class', 'message_container');
  this.message_container.addEventListener('click', _via_util_msg_hide);
  this.message_panel = document.createElement('div');
  this.message_panel.setAttribute('id', '_via_message');
  this.message_container.appendChild(this.message_panel);
  this.container.appendChild(this.message_container);

  //// initialise content creators and managers
  // this.ie = new import_export(this.d);

  this.va = new view_annotator(this.d, this.view_container);
  this.editor = new editor(this.d, this.va, this.editor_container);

  this.ap = new admin_panel(this, this.admin_container);

  this.view_manager_container = document.createElement('div');
  this.vm = new view_manager(this.d, this.va, this.view_manager_container, this);
  this.vm._init();

  // control panel shows the view_manager_container
  this.cp = new control_panel(this.control_panel_container, this);
  var request = new XMLHttpRequest();
    request.open('GET', 'get_rights', true);
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
        try {
          var data = JSON.parse(request.responseText);
          this.username = data[0];
          this.user_rights = data[1];
          this.cp.add_user();
          if (this.user_rights === 'admin'){
            this.cp.add_admin_panel_ref();
          }
        }
        catch(err){}
      }
    });
    request.send();
  this.cp._set_region_shape('RECTANGLE');

  // event handlers for buttons in the control panel
  this.cp.on_event('region_shape', this._ID, function(data, event_payload) {
    this.va.set_region_draw_shape(event_payload.shape);
  }.bind(this));
  this.cp.on_event('editor_toggle', this._ID, function(data, event_payload) {
    this.editor.toggle();
  }.bind(this));
  this.cp.on_event('admin_panel_toggle', this._ID, function(data, event_payload) {
    this.ap.toggle();
  }.bind(this));

  // keyboard event handlers
  //this.via_container.focus()
  //this.via_container.addEventListener('keydown', this._keydown_handler.bind(this));
  window.addEventListener('keydown', this._keydown_handler.bind(this)); // @todo: should be attached only to VIA application container

  // update VIA version number
  var el = document.getElementById('via_page_container');
  var pages = el.getElementsByClassName('via_page');
  var n = pages.length;
  for ( var i = 0; i < n; ++i ) {
    if ( pages[i].dataset.pageid === 'page_about' ) {
      var content0 = pages[i].innerHTML;
      pages[i].innerHTML = content0.replace('__VIA_VERSION__', _VIA_VERSION);
    }
  }

  // load any external modules (e.g. demo) which should be defined as follows
  // function _via_load_submodules()
  if (typeof _via_load_submodules === 'function') {
    console.log('VIA submodule detected, invoking _via_load_submodules()');
    this._load_submodule = new Promise( function(ok_callback, err_callback) {
      try {
        _via_load_submodules.call(this);
      }
      catch(err) {
        console.warn('VIA submodule load failed: ' + err);
        err_callback(err);
      }
    }.bind(this));
  } else {
    // debug code (disabled for release)
    if ( typeof(_VIA_DEBUG) === 'undefined' || _VIA_DEBUG === true ) {
      //this.s.pull('e302eadf-aa53-4a5a-b958-11175692c928'); // load shared project
      //this.d.project_load_json(_via_dp[2]['store']); // video
      //this.d.project_load_json(_via_dp[1]['store']); // audio
      //this.d.project_load_json(_via_dp[4]['store']); // image
      //this.d.project_load_json(_via_dp[3]['store']); // pair
      setTimeout( function() {
        //this.va.view_show('1');
        //this.editor.show();
        //this.cp._page_show_import_export();
        //this.cp._share_show_info();
      }.bind(this), 200);
    }
  }

  // ready
  util_msg_show('Annotator ready!');
}

main.prototype._hook_on_browser_resize = function() {
  if ( typeof(this.va.vid) !== 'undefined' ) {
    this.va.view_show(this.va.vid);
  }
}

main.prototype._keydown_handler = function(e) {
  // avoid handling events when text input field is in focus
  if ( e.target.type !== 'text' &&
       e.target.type !== 'textarea'
     ) {
    this.va._on_event_keydown(e);
  }
}
