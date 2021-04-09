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
    this.show();
  } else {
    this.hide();
  }
}


admin_panel.prototype.hide = function (){
    this.c.innerHTML = '';
    this.c.classList.add('hide');
}


admin_panel.prototype.show = function (){
    this.c.classList.remove('hide');

    var request = new XMLHttpRequest();
    request.open('POST', this.via.url + 'get_all_projects', true);
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
        var values = JSON.parse(request.responseText);
        alert(values.length);
        alert(values);
      }
    });
    request.send();
    //GetAllProjects

    //GetAllUserForProject


}

