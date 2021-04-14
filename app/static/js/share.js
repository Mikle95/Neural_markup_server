/**
 *
 * @class
 * @classdesc Manages communication with VIA project server to allow sharing of VIA projects.
 * @author Abhishek Dutta <adutta@robots.ox.ac.uk>
 * @date 24 June 2019
 *
 */

'use strict';

function share(data, conf) {
  this._ID = '_via_share_';
  this.d = data;
  this.conf = conf;

  // registers on_event(), emit_event(), ... methods from
  // event to let this module listen and emit events
  event.call(this);
}

share.prototype._disable_share = function() {
  this.push   = this._disabled_info;
  this.pull   = this._disabled_info;
  this.exists = this._disabled_info;
}

share.prototype._disabled_info = function() {
  _via_util_msg_show('Share feature has been disabled in demo applications!');
}

share.prototype.push = function() {
    // avoid pushing empty projects
    if ( Object.keys(this.d.store.file).length === 0 ||
         Object.keys(this.d.store.view).length === 0
       ) {
      _via_util_msg_show('Cannot push empty project');
      return;
    }

    var request = new XMLHttpRequest();
    request.open('POST', via.url + 'save_project', true);
    request.setRequestHeader('Content-Type', 'text/json; charset=UTF-8');
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200)
        _via_util_msg_show('Project uploaded successfully!');
    });
    request.send(JSON.stringify(this.d.store));

}

share.prototype.pull = function() {
  var request = new XMLHttpRequest();
    request.open('POST', via.url + 'load_admin_project/' + via.d.store.project.pname, true);
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
        if(request.responseText != "")
          via.d.project_load(request.responseText)
      }
    });
    request.send();
}

share.prototype.exists = function(pid) {
  return new Promise( function(ok_callback, err_callback) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      switch(xhr.statusText) {
      case 'OK':
        ok_callback(pid);
        break;
      default:
        err_callback(pid, xhr.statusText);
      }
    });
    xhr.addEventListener('timeout', function(e) {
      err_callback(pid, 'timeout');
    });
    xhr.addEventListener('error', function(e) {
      err_callback(pid, 'error')
    });
    xhr.open('HEAD', this.conf['ENDPOINT'] + pid);
    xhr.send();
  }.bind(this));
}

share.prototype._project_on_push_ok_response = function(ok_response) {
  try {
    var d = JSON.parse(ok_response);
    if ( d.hasOwnProperty('pid') &&
         d.hasOwnProperty('rev') &&
         d.hasOwnProperty('rev_timestamp')
       ) {
      this.d.store.project.pid = d['pid'];
      this.d.store.project.rev = d['rev'];
      this.d.store.project.rev_timestamp = d['rev_timestamp'];
      _via_util_msg_show('Pushed revision ' + d['rev']);
    } else {
      _via_util_msg_show('Malformed response from server: ' + ok);
    }
  }
  catch(e) {
    _via_util_msg_show('Malformed response from server: ' + ok_response);
  }
}

share.prototype._project_on_push_err_response = function(reason, err_msg) {
  _via_util_msg_show('Push failed: ' + reason + ' ' + err_msg);
  console.warn(err_response);
}

share.prototype._project_pull = function(pid) {
  return new Promise( function(ok_callback, err_callback) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      switch(xhr.statusText) {
      case 'OK':
        ok_callback(xhr.responseText);
        break;
      default:
        err_callback(xhr.statusText);
      }
    });
    xhr.addEventListener('timeout', function(e) {
      err_callback('Timeout');
    });
    xhr.addEventListener('error', function(e) {
      err_callback('Error' )
    });
    xhr.open('GET', this.conf['ENDPOINT'] + pid);
    xhr.send();
  }.bind(this));
}

share.prototype._project_push = function(pid, rev) {
  return new Promise( function(ok_callback, err_callback) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      switch(xhr.statusText) {
      case 'OK':
        ok_callback(xhr.responseText);
        break;
      default:
        err_callback(xhr.statusText);
      }
    });
    xhr.addEventListener('timeout', function(e) {
      console.log('timeout');
      err_callback(pid, 'timeout');
    });
    xhr.addEventListener('error', function(e) {
      console.log(e.target)
      err_callback(pid, 'error')
    });

    var payload = JSON.parse(JSON.stringify(this.d.store));
    payload.project.rev = _VIA_PROJECT_REV_ID_MARKER;
    payload.project.rev_timestamp = _VIA_PROJECT_REV_TIMESTAMP_MARKER;
    if ( typeof(pid) === 'undefined' &&
         typeof(rev) === 'undefined'
       ) {
      payload.project.pid = _VIA_PROJECT_ID_MARKER;
      xhr.open('POST', this.conf['ENDPOINT']);
      console.log('POST ' + this.conf['ENDPOINT'])
    } else {
      xhr.open('POST', this.conf['ENDPOINT'] + pid + '?rev=' + rev);
      console.log('POST ' + this.conf['ENDPOINT' + pid + '?rev=' + rev])
    }
    xhr.timeout = _VIA_REMOTE_TIMEOUT;
    xhr.send(JSON.stringify(payload));
  }.bind(this));
}
