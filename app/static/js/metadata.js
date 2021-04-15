const _VIA_RSHAPE  = { 'POINT':1, 'RECTANGLE':2, 'CIRCLE':3, 'ELLIPSE':4, 'LINE':5, 'POLYLINE':6, 'POLYGON':7, 'EXTREME_RECTANGLE': 8, 'EXTREME_CIRCLE':9 };
const _VIA_METADATA_FLAG = { 'RESERVED_FOR_FUTURE':1 };

function metadata(vid, z, xy, av) {
  this.vid = vid;   // view id
  this.flg = 0;     // flags reserved for future
  this.z   = z;     // [t0, ..., tn] (temporal coordinate e.g. time or frame index)
  this.xy  = xy;    // [shape_id, shape_coordinates, ...] (i.e. spatial coordinate)
  this.av  = av;    // attribute-value pair e.g. {attribute_id : attribute_value, ...}
}
