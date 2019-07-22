function internal_get_json_tool_quality_from_id(key_id) {
  for (var tool_quality of mod_tool_qualitys) {
    if (tool_quality.id) {
      if (tool_quality.id == key_id) {
        return tool_quality;
      }
    }
  }
  for (var tool_quality of tool_qualitys) {
    if (tool_quality.id) {
      if (tool_quality.id == key_id) {
        return tool_quality;
      }
    }
  }
  return null;
}

ToolqualityClass = function(id) {
  this.id = id;
  this.json = internal_get_json_tool_quality_from_id(this.id);
};

ToolqualityClass.prototype.getName = function() {
  if (!this.name) {
    this.name = Tr("No name tool quality");
	
    if (this.json.name) {
      this.name = this.json.name;
    }
  }
  return this.name;
};
