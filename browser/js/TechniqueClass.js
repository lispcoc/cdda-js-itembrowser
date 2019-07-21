function internal_get_json_technique_from_id(key_id) {
  for (var technique of mod_techniques) {
    if (technique.id) {
      if (technique.id == key_id) {
        return technique;
      }
    }
  }
  for (var technique of techniques) {
    if (technique.id) {
      if (technique.id == key_id) {
        return technique;
      }
    }
  }
  return null;
}

TechniqueClass = function(id) {
  this.id = id;
  this.json = internal_get_json_technique_from_id(this.id);
};

TechniqueClass.prototype.getInfo = function(id) {
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

TechniqueClass.prototype.getName = function() {
  if (!this.name) {
    this.name = Tr("No name technique");
	
    if (this.json.name) {
      this.name = this.json.name;
    }
  }
  return this.name;
};
