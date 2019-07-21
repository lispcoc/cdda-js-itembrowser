function internal_get_json_skill_from_id(key_id) {
  for (var skill of mod_skills) {
    if (skill.ident) {
      if (skill.ident == key_id) {
        return skill;
      }
    }
  }
  for (var skill of skills) {
    if (skill.ident) {
      if (skill.ident == key_id) {
        return skill;
      }
    }
  }
  return null;
}

SkillClass = function(id) {
  this.ident = id;
  this.json = internal_get_json_skill_from_id(this.ident);
};

SkillClass.prototype.getInfo = function(id) {
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

SkillClass.prototype.getName = function() {
  if (!this.name) {
    this.name = Tr("No name skill");
	
    if (this.json.name) {
      this.name = this.json.name;
    }
  }
  return this.name;
};
