function internal_get_material_from_id(key_id) {
  console.log(key_id);
  for (var mat of mod_materials) {
    if (mat.ident) {
      if (mat.ident == key_id) {
        console.log(mat.name);
        return mat;
      }
    }
  }
  for (var mat of materials) {
    if (mat.ident) {
      if (mat.ident == key_id) {
        console.log(mat.name);
        return mat;
      }
    }
  }
  return null;
}

MaterialClass = function(mat_ident) {
  this.ident = mat_ident;
  this.json = internal_get_material_from_id(this.ident);
};

MaterialClass.prototype.getJson = function() {
  return this.json;
};

MaterialClass.prototype.getIdent = function() {
  return this.ident;
};

MaterialClass.prototype.getName = function() {
  if (!this.name) {
    this.name = Tr("No name material");
    if (this.json.name) {
      this.name = this.json.name;
    }
  }
  return this.name;
};

MaterialClass.prototype.getBashResist = function() {
  if (!this.bash_resist) {
    this.bash_resist = 0;
    if (this.json.bash_resist) {
      this.bash_resist = this.json.bash_resist;
    }
  }
  return this.bash_resist;
};

MaterialClass.prototype.getCutResist = function() {
  if (!this.cut_resist) {
    this.cut_resist = 0;
    if (this.json.cut_resist) {
      this.cut_resist = this.json.cut_resist;
    }
  }
  return this.cut_resist;
};

MaterialClass.prototype.getAcidResist = function() {
  if (!this.acid_resist) {
    this.acid_resist = 0;
    if (this.json.acid_resist) {
      this.acid_resist = this.json.acid_resist;
    }
  }
  return this.acid_resist;
};

MaterialClass.prototype.getFireResist = function() {
  if (!this.fire_resist) {
    this.fire_resist = 0;
    if (this.json.fire_resist) {
      this.fire_resist = this.json.fire_resist;
    }
  }
  return this.fire_resist;
};

MaterialClass.prototype.getElecResist = function() {
  if (!this.elec_resist) {
    this.elec_resist = 0;
    if (this.json.elec_resist) {
      this.elec_resist = this.json.elec_resist;
    }
  }
  return this.elec_resist;
};
