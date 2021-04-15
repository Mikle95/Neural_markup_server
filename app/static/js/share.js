function share(data, conf) {
  this._ID = '_via_share_';
  this.d = data;
  this.conf = conf;
  
  event.call(this);
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
