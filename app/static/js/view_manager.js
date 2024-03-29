function view_manager(data, view_annotator, container, via) {
  this._ID = '_via_view_manager_';
  this.d = data;
  this.va = view_annotator;
  this.c = container;
  this.via = via;

  this.view_selector_vid_list = [];

  event.call( this );

  this.d.on_event('project_loaded', this._ID, this._on_event_project_loaded.bind(this));
  this.d.on_event('project_updated', this._ID, this._on_event_project_updated.bind(this));
  this.d.on_event('view_bulk_add', this._ID, this._on_event_view_bulk_add.bind(this));
  this.va.on_event('view_show', this._ID, this._on_event_view_show.bind(this));
  this.va.on_event('view_next', this._ID, this._on_event_view_next.bind(this));
  this.va.on_event('view_prev', this._ID, this._on_event_view_prev.bind(this));

  this._init_ui_elements();
}

view_manager.prototype._init = function() {
  this._init_ui_elements();
  this._view_selector_update();
}

view_manager.prototype._init_ui_elements = function() {
  this.pname = document.createElement('input');
  this.pname.setAttribute('type', 'text');
  this.pname.setAttribute('id', 'via_project_name_input');
  this.pname.setAttribute('value', 'Untitled'); //this.d.store.project.pname
  this.pname.setAttribute('title', 'Project Name (click to update)');
  this.pname.addEventListener('change', this._on_pname_change.bind(this));

  this.view_selector = document.createElement('select');
  this.view_selector.setAttribute('class', 'view_selector');
  this.view_selector.setAttribute('title', 'Select a file for annotation');
  this.view_selector.addEventListener('change', this._on_view_selector_change.bind(this));

  this.projet_selector = document.createElement('select');
  // this.view_filter_regex.setAttribute('type', 'text');
  this.projet_selector.setAttribute('class', 'view_selector');
  this.projet_selector.setAttribute('title', 'Filter file list');
  // this.view_filter_regex.setAttribute('placeholder', 'Search');
  this.projet_selector.addEventListener('change', this._on_project_selector_change.bind(this));
  // this.view_filter_regex.addEventListener('reset', this._on_click_get_projects.bind(this));

  this.c.innerHTML = '';
  // this.c.appendChild(this.pname);
  this.c.appendChild(this.projet_selector);
  this.c.appendChild(this.view_selector);
  this.get_project_names(this);
}

//
// UI elements change listeners
//

view_manager.prototype.get_project_names = function(e) {
  if (this.projet_selector.innerHTML.length > 0)
    return;
  var request = new XMLHttpRequest();
    request.open('POST', this.via.url + 'get_projects', true);
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
        var values = JSON.parse(request.responseText);
        this.projet_selector.innerHTML = '';
        for (var i = -1; i < values.length; ++i){
          var oi = document.createElement('option');
          oi.setAttribute('value', i > -1 ? values[i] : this.d.store.pname);
          oi.innerHTML = i > -1 ? values[i] : this.d.store.project.pname;
          this.projet_selector.appendChild(oi);
        }

        // this.view_filter_regex.appendChild( this._view_selector_option_html(values[2], 2) );

        // выводим в консоль то что ответил сервер
        // alert( request.responseText );
      }
    });
    request.send();
}

view_manager.prototype.load_first = function(){
  this._load_project_from_server(this.projet_selector.value);
}

view_manager.prototype._on_pname_change = function(e) {
  this.d.store.project.pname = e.target.value.trim();
  this.projet_selector.options[this.projet_selector.selectedIndex].innerHTML = e.target.value.trim();
}

view_manager.prototype._on_view_selector_change = function(e) {
  var vid = e.target.options[e.target.selectedIndex].value;
  if ( vid !== this.va.vid ) {
    this.va.view_show(vid);
  }
}

view_manager.prototype._on_next_view = function() {
  if ( this.view_selector.options.length ) {
    var vid = this.view_selector.options[this.view_selector.selectedIndex].value;
    var vindex = this.view_selector_vid_list.indexOf(vid);
    if ( vindex !== -1 ) {
      var next_vindex = vindex + 1;
      if ( next_vindex >= this.view_selector_vid_list.length ) {
        next_vindex = 0;
      }
      this.va.view_show( this.view_selector_vid_list[next_vindex] );
    } else {
      util_msg_show('Cannot move to next view!');
    }
  }
}

view_manager.prototype._on_prev_view = function() {
  if ( this.view_selector.options.length ) {
    var vid = this.view_selector.options[this.view_selector.selectedIndex].value;
    var vindex = this.view_selector_vid_list.indexOf(vid);
    if ( vindex !== -1 ) {
      var prev_vindex = vindex - 1;
      if ( prev_vindex < 0 ) {
        prev_vindex = this.view_selector_vid_list.length - 1;
      }
      this.va.view_show( this.view_selector_vid_list[prev_vindex] );
    } else {
      util_msg_show('Cannot move to next view!');
    }
  }
}

view_manager.prototype._on_event_view_show = function(data, event_payload) {
  var vid = event_payload.vid.toString();
  this.view_selector.selectedIndex = -1;

  // ensure that the view selector shows the view being displayed
  var n = this.view_selector.options.length;
  for ( var i = 0; i < n; ++i ) {
    if ( this.view_selector.options[i].value === vid ) {
      this.view_selector.selectedIndex = i;
      break;
    }
  }
}

view_manager.prototype._on_event_view_next = function(data, event_payload) {
  this._on_next_view();
}

view_manager.prototype._on_event_view_prev = function(data, event_payload) {
  this._on_prev_view();
}

view_manager.prototype._on_event_project_loaded = function(data, event_payload) {
  this._init_ui_elements();
  this._view_selector_update();
  if ( this.d.store.project.vid_list.length ) {
    // show first view by default
    this.va.view_show( this.d.store.project.vid_list[0] );
  }
}

view_manager.prototype._on_event_project_updated = function(data, event_payload) {
  var current_vid = this.va.vid;
  this._init_ui_elements();
  this._view_selector_update();
  if ( this.d.store.project.vid_list.length ) {
    if ( current_vid in this.d.store.project.vid_list ) {
      this.va.view_show( current_vid );
    } else {
      // show first view by default
      this.va.view_show( this.d.store.project.vid_list[0] );
    }
  }
}

//
// View Selector
//
view_manager.prototype._view_selector_clear = function() {
  this.view_selector.innerHTML = '';
  this.view_selector_vid_list = [];
}

view_manager.prototype._view_selector_option_html = function(vindex, vid) {
  var oi = document.createElement('option');
  oi.setAttribute('value', vid);

  var file_count = this.d.store.view[vid].fid_list.length;
  var view_name;
  if ( file_count === 1 ) {
    var fid = this.d.store.view[vid].fid_list[0];
    view_name = this.d.store.file[fid].fname;
    oi.innerHTML = '[' + (parseInt(vindex)+1) + '] ' + decodeURI(view_name);
  } else {
    var filelist = [];
    var fid;
    for ( var findex in this.d.store.view[vid].fid_list ) {
      fid = this.d.store.view[vid].fid_list[findex];
      filelist.push(this.d.store.file[fid].fname);
    }
    oi.innerHTML = '[' + (parseInt(vindex)+1) + '] ' + filelist.join(', ');
  }
  return oi;
}

view_manager.prototype._view_selector_update = function() {
    this._view_selector_update_showall();
}


view_manager.prototype._view_selector_update_showall = function() {
  var existing_selectedIndex = this.view_selector.selectedIndex;
  var existing_vid;
  if ( existing_selectedIndex !== -1 ) {
    existing_vid = this.view_selector.options[existing_selectedIndex].value;
  }
  this._view_selector_clear();

  var vid;
  for ( var vindex in this.d.store.project.vid_list ) {
    vid = this.d.store.project.vid_list[vindex];
    this.view_selector.appendChild( this._view_selector_option_html(vindex, vid) );
    this.view_selector_vid_list.push(vid);
  }
  this.is_view_filtered_by_regex = false;
  if ( existing_selectedIndex !== -1 ) {
    var existing_vid_index = this.view_selector_vid_list.indexOf(existing_vid);
    if ( existing_vid_index === -1 ) {
      this.view_selector.selectedIndex = -1;
    } else {
      this.view_selector.selectedIndex = existing_vid_index;
    }
  }
}

view_manager.prototype._on_project_selector_change = function(e) {
  this._load_project_from_server(e.target.options[e.target.selectedIndex].value);
  // this.pname.value = e.target.options[e.target.selectedIndex].innerHTML;
}

view_manager.prototype._load_project_from_server = function(pname){
  var request = new XMLHttpRequest();
    var params = "pname=" + pname;
    request.open('POST', this.via.url + 'load_project?' + params, true);
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
        if(request.responseText != "") {
          this.via.d.project_load(request.responseText)
        }
      }
    });
    request.send(params);
}

view_manager.prototype._file_add_from_filelist = function(filelist) {
  this.d.view_bulk_add_from_filelist(filelist).then( function(ok) {
    var filetype_summary = {};
    var fid, ftype_str;
    for ( var findex in ok.fid_list ) {
      fid = ok.fid_list[findex];
      ftype_str = util_file_type_to_str( this.d.store.file[fid].type );
      if ( ! filetype_summary.hasOwnProperty(ftype_str) ) {
        filetype_summary[ftype_str] = 0;
      }
      filetype_summary[ftype_str] = filetype_summary[ftype_str] + 1;
    }
    util_msg_show('Added ' + ok.fid_list.length + ' files. ' + JSON.stringify(filetype_summary));
  }.bind(this), function(err) {
    util_msg_show('Failed to add files! [' + err + ']');
    console.warn(err);
  }.bind(this));
}

view_manager.prototype._on_add_media_local = function() {
  _via_util_file_select_local(_VIA_FILE_SELECT_TYPE.IMAGE | _VIA_FILE_SELECT_TYPE.VIDEO | _VIA_FILE_SELECT_TYPE.AUDIO,
                              this._file_add_local.bind(this),
                              true);
}

view_manager.prototype._file_add_local = function(e) {
  var files = e.target.files;
  var filelist = [];

  for ( var findex = 0; findex < files.length; ++findex ) {
    var flag = false;
    for (var i = 1; i <= Object.keys(this.d.store.file).length; ++i)
      if (files[findex].name === this.d.store.file[i.toString()].fname){
        this.d.file_update(this.d.store.file[i.toString()].fid, 'src', files[findex]).then( function(ok) {
          this.va.view_show(this.va.vid);
        }.bind(this), function(err) {
        util_msg_show('Failed to update properties of file: ' + err );
        }.bind(this));
        flag = true;
        break;
      }
    if(flag) continue;

    filelist.push({ 'fname':files[findex].name,
                    'type':util_infer_file_type_from_filename(files[findex].name),
                    'loc':_VIA_FILE_LOC.LOCAL,
                    'src':files[findex],
                  });
  }
  if(filelist.length > 0)
    this._file_add_from_filelist(filelist);
}

view_manager.prototype._on_event_view_bulk_add = function(data, event_payload) {
  this._view_selector_update();
  this.d._cache_update();
  if ( event_payload.vid_list.length ) {
    this.va.view_show( event_payload.vid_list[0] );
  }
}

view_manager.prototype._on_add_media_remote = function() {
  var url = window.prompt('Enter URL of an image, audio or video (e.g. http://www....)',
                          '');
  var filelist = [ {'fname':url,
                    'type':util_infer_file_type_from_filename(url),
                    'loc':_VIA_FILE_LOC.URIHTTP,
                    'src':url,
                   }
                 ];

  this._file_add_from_filelist(filelist);
}

view_manager.prototype._on_add_media_bulk = function() {
  _via_util_file_select_local(_VIA_FILE_SELECT_TYPE.TEXT,
                              this._on_add_media_bulk_file_selected.bind(this), false);
}

view_manager.prototype._on_add_media_bulk_file_selected = function(e) {
  if ( e.target.files.length ) {
    util_load_text_file(e.target.files[0], this._on_add_media_bulk_file_load.bind(this));
  }
}

view_manager.prototype._on_add_media_bulk_file_load = function(file_data) {
  var url_list = file_data.split('\n');
  if ( url_list.length ) {
    var filelist = [];
    for ( var i = 0; i < url_list.length; ++i ) {
      if ( url_list[i] === '' ||
           url_list[i] === ' ' ||
           url_list[i] === '\n'
         ) {
        continue; // skip
      }
      filelist.push({ 'fname':url_list[i],
                      'type':util_infer_file_type_from_filename(url_list[i]),
                      'loc':_via_util_infer_file_loc_from_filename(url_list[i]),
                      'src':url_list[i],
                    });
    }
    this._file_add_from_filelist(filelist);
  }
}
