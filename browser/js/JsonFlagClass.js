function internal_get_json_flag_from_id(key_id) {
  for (var flag of mod_flags) {
    if (flag.id) {
      if (flag.id == key_id) {
        return flag;
      }
    }
  }
  for (var flag of flags) {
    if (flag.id) {
      if (flag.id == key_id) {
        return flag;
      }
    }
  }
  return null;
}

JsonFlagClass = function(id) {
  this.id = id;
  this.json = internal_get_json_flag_from_id(this.id);
};

JsonFlagClass.prototype.getInfo = function(id) {
  if (!this.json) {
    return null;
  }
    if (this.json.info) {
    return this.json.info;
  }
  else if(this.json.description) {
  return this.json.description;
}
};
