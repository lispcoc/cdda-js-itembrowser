function internal_get_json_ammunition_type_from_id(key_id) {
  for (var ammunition_type of mod_ammunition_types) {
    if (ammunition_type.id) {
      if (ammunition_type.id == key_id) {
        return ammunition_type;
      }
    }
  }
  for (var ammunition_type of ammunition_types) {
    if (ammunition_type.id) {
      if (ammunition_type.id == key_id) {
        return ammunition_type;
      }
    }
  }
  return null;
}

AmmunitiontypeClass = function(id) {
  this.id = id;
  this.json = internal_get_json_ammunition_type_from_id(this.id);
};

AmmunitiontypeClass.prototype.getName = function() {
  if (!this.name) {
    this.name = Tr("No name tool quality");
	
    if (this.json.name) {
      this.name = this.json.name;
    }
  }
  return this.name;
};
