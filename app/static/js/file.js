const _VIA_FILE_TYPE = { IMAGE:2, VIDEO:4, AUDIO:8 };
const _VIA_FILE_LOC  = { LOCAL:1, URIHTTP:2, URIFILE:3, INLINE:4 };

function file(fid, fname, type, loc, src) {
  this.fid      = fid;
  this.fname    = fname;
  this.type     = type;
  this.loc      = loc;
  this.src      = src;
}

