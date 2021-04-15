function control_panel(control_panel_container, via) {
  this._ID = '_via_control_panel_';
  this.c   = control_panel_container;
  this.via = via;

  // registers on_event(), emit_event(), ... methods from
  // event to let this module listen and emit events
  event.call( this );

  this._init();
}

control_panel.prototype._init = function(type) {
  this.c.innerHTML = '';

  this.c.appendChild(this.via.vm.c);
  this._add_view_manager_tools();

  this._add_spacer();

  this._add_project_tools();

  this._add_spacer();

  this._add_region_shape_selector();

  this._add_spacer();

  var editor = _via_util_get_svg_button('micon_insertcomment', 'Show/Hide Attribute Editor');
  editor.addEventListener('click', function() {
    this.emit_event( 'editor_toggle', {});
  }.bind(this));
  this.c.appendChild(editor);

  this._add_spacer();

  this._add_project_share_tools();

  this._add_spacer();

  var keyboard = _via_util_get_svg_button('micon_keyboard', 'Keyboard Shortcuts');
  keyboard.addEventListener('click', function() {
    _via_util_page_show('page_keyboard_shortcut');
  }.bind(this));
  this.c.appendChild(keyboard);

}

control_panel.prototype.add_user = function() {
  this._add_spacer();
  user = document.createElement('div')
  user.id = 'user_rights';
  user.innerHTML = this.via.username + "(" + this.via.user_rights + ")"
  this.c.appendChild(user);

  logout = document.createElement('button');
  logout.innerHTML = 'LogOut'
  logout.onclick = function () {
    window.location.href = "logout";
  }
  this.c.appendChild(logout);
}

control_panel.prototype.add_admin_panel_ref = function(){
  var btn = document.createElement('button');
  btn.innerHTML = 'Managment'
  btn.addEventListener('click' ,function () {
    // this.emit_event('admin_panel_toggle', {});
    via.ap.toggle();
  })
  this.c.appendChild(btn);
}

control_panel.prototype._add_spacer = function() {
  var spacer = document.createElement('div');
  spacer.setAttribute('class', 'spacer');
  this.c.appendChild(spacer);
}

control_panel.prototype._add_view_manager_tools = function() {
  var prev_view = _via_util_get_svg_button('micon_navigate_prev', 'Show Previous File', 'show_prev');
  prev_view.addEventListener('click', this.via.vm._on_prev_view.bind(this.via.vm));
  this.c.appendChild(prev_view);

  var next_view = _via_util_get_svg_button('micon_navigate_next', 'Show Next File', 'show_next');
  next_view.addEventListener('click', this.via.vm._on_next_view.bind(this.via.vm));
  this.c.appendChild(next_view);

  var add_media_local = _via_util_get_svg_button('micon_add_circle', 'Add File in Local Computer', 'add_media_local');
  add_media_local.addEventListener('click', this.via.vm._on_add_media_local.bind(this.via.vm));
  this.c.appendChild(add_media_local);
}

control_panel.prototype._add_region_shape_selector = function() {
  if ( document.getElementById('shape_point') === null ) {
    return;
  }

  var rect = _via_util_get_svg_button('shape_rectangle', 'Rectangle', 'RECTANGLE');
  rect.addEventListener('click', function() {
    this._set_region_shape('RECTANGLE');
  }.bind(this));
  this.c.appendChild(rect);

  var extreme_rect = _via_util_get_svg_button('shape_extreme_rectangle', 'Extreme rectangle is defined using four points along the boundary of a rectangular object.', 'EXTREME_RECTANGLE');
  extreme_rect.classList.add('shape_selector');
  extreme_rect.addEventListener('click', function() {
    this._set_region_shape('EXTREME_RECTANGLE');
  }.bind(this));
  this.c.appendChild(extreme_rect);

  var circle = _via_util_get_svg_button('shape_circle', 'Circle', 'CIRCLE');
  circle.addEventListener('click', function() {
    this._set_region_shape('CIRCLE');
  }.bind(this));
  this.c.appendChild(circle);

  var extreme_circle = _via_util_get_svg_button('shape_extreme_circle', 'Extreme circle is defined using any three points along the circumference of a circular object.', 'EXTREME_CIRCLE');
  extreme_circle.addEventListener('click', function() {
    this._set_region_shape('EXTREME_CIRCLE');
  }.bind(this));
  this.c.appendChild(extreme_circle);

  var ellipse = _via_util_get_svg_button('shape_ellipse', 'Ellipse', 'ELLIPSE');
  ellipse.addEventListener('click', function() {
    this._set_region_shape('ELLIPSE');
  }.bind(this));
  this.c.appendChild(ellipse);

  var line = _via_util_get_svg_button('shape_line', 'Line', 'LINE');
  line.addEventListener('click', function() {
    this._set_region_shape('LINE');
  }.bind(this));
  this.c.appendChild(line);

  var polygon = _via_util_get_svg_button('shape_polygon', 'Polygon', 'POLYGON');
  polygon.addEventListener('click', function() {
    this._set_region_shape('POLYGON');
  }.bind(this));
  this.c.appendChild(polygon);

  var polyline = _via_util_get_svg_button('shape_polyline', 'Polyline', 'POLYLINE');
  polyline.addEventListener('click', function() {
    this._set_region_shape('POLYLINE');
  }.bind(this));
  this.c.appendChild(polyline);

  var point = _via_util_get_svg_button('shape_point', 'Point', 'POINT');
  point.addEventListener('click', function() {
    this._set_region_shape('POINT');
  }.bind(this));
  this.c.appendChild(point);

  this.shape_selector_list = { 'POINT':point, 'RECTANGLE':rect, 'EXTREME_RECTANGLE':extreme_rect, 'CIRCLE':circle, 'EXTREME_CIRCLE':extreme_circle, 'ELLIPSE':ellipse, 'LINE':line, 'POLYGON':polygon, 'POLYLINE':polyline };
}

control_panel.prototype._set_region_shape = function(shape) {
  this.emit_event( 'region_shape', {'shape':shape});
  for ( var si in this.shape_selector_list ) {
    if ( si === shape ) {
      this.shape_selector_list[si].classList.add('svg_button_selected');
    } else {
      this.shape_selector_list[si].classList.remove('svg_button_selected');
    }
  }
}

control_panel.prototype._add_project_tools = function() {
  var load = _via_util_get_svg_button('micon_open', 'Open a VIA Project');
  load.addEventListener('click', function() {
    _via_util_file_select_local(_VIA_FILE_SELECT_TYPE.JSON, this._project_load_on_local_file_select.bind(this), false);
  }.bind(this));
  this.c.appendChild(load);

  var save = _via_util_get_svg_button('micon_save', 'Save current VIA Project');
  save.addEventListener('click', function() {
    this.via.d.project_save();
  }.bind(this));
  this.c.appendChild(save);

  // var import_export_annotation = _via_util_get_svg_button('micon_import_export', 'Import or Export Annotations');
  // import_export_annotation.addEventListener('click', this._page_show_import_export.bind(this));
  // this.c.appendChild(import_export_annotation);
}

control_panel.prototype._project_load_on_local_file_select = function(e) {
  if ( e.target.files.length === 1 ) {
    _via_util_load_text_file(e.target.files[0], this._project_load_on_local_file_read.bind(this));
  }
}

control_panel.prototype._project_load_on_local_file_read = function(project_data_str) {
  this.via.d.project_load(project_data_str);
}

control_panel.prototype._project_import_via2_on_local_file_read = function(project_data_str) {
  this.via.d.project_import_via2_json(project_data_str);
}

control_panel.prototype._add_project_share_tools = function() {
  // if ( this.via.s ) {
  //   var share = _via_util_get_svg_button('micon_share', 'Information about sharing this VIA project with others for collaborative annotation');
  //   share.addEventListener('click', function() {
  //     this._share_show_info();
  //   }.bind(this));
    var push = _via_util_get_svg_button('micon_upload', 'Push (upload the project to the server)');
    push.addEventListener('click', function() {
      this.via.s.push();
    }.bind(this));
  //
      var pull = _via_util_get_svg_button('micon_download', 'download the admin project');
      pull.addEventListener('click', function () {
        this.via.s.pull();
      }.bind(this));
  //   this.c.appendChild(share);
    this.c.appendChild(push);
    this.c.appendChild(pull);
  // }
}
