function copy_json_obj(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function internal_get_requirement_from_id(key_id) {
  for (var requirement of mod_requirements) {
    if (requirement["id"]) {
      if (requirement["id"] == key_id) {
        return requirement;
      }
    }
  }
  for (var requirement of requirements) {
    if (requirement["id"]) {
      if (requirement["id"] == key_id) {
        return requirement;
      }
    }
  }
  return null;
}

RequirementClass = function(requirement_id) {
  this.id = requirement_id;
  this.json = internal_get_requirement_from_id(this.id);
};

RequirementClass.prototype.getToolSelections = function(multiplier) {
  if (!this.tool_selections) {
    this.tool_selections = [];
    if (this.json.tools) {
      for (tool of this.json.tools[0]) {
        if (tool[2] == "LIST") {
          var tmp_req = new RequirementClass(tool[0]);
          Array.prototype.push.apply(
            this.tool_selections,
            tmp_req.getToolSelections(multiplier)
          );
        } else {
          this.tool_selections.push([
            tool[0],
            tool[1] * multiplier >= 0 ? tool[1] * multiplier : -1
          ]);
        }
      }
    }
  }
  return this.tool_selections;
};

RequirementClass.prototype.getTools = function(multiplier) {
  if (!this.tools) {
    this.tools = [];
    if (this.json.tools) {
      for (tool_selections of this.json.tools) {
        var tmp_tool_selections = [];
        for (tool of tool_selections) {
          if (tool[2] == "LIST") {
            var tmp_req = new RequirementClass(tool[0]);
            Array.prototype.push.apply(
              tmp_tool_selections,
              tmp_req.getToolSelections(multiplier)
            );
          } else {
            tmp_tool_selections.push([
              tool[0],
              tool[1] * multiplier >= 0 ? tool[1] * multiplier : -1
            ]);
          }
        }
        this.tools.push(tmp_tool_selections);
      }
    }
  }
  return this.tools;
};

RequirementClass.prototype.getComponentSelections = function(multiplier) {
  if (!this.component_selections) {
    this.component_selections = [];
    for (component of this.json.components[0]) {
      if (component[2] == "LIST") {
        var tmp_req = new RequirementClass(component[0]);
        Array.prototype.push.apply(
          this.component_selections,
          tmp_req.getComponentSelections(multiplier)
        );
      } else {
        this.component_selections.push([
          component[0],
          component[1] * multiplier
        ]);
      }
    }
  }
  return this.component_selections;
};

RequirementClass.prototype.getComponents = function(multiplier) {
  if (!this.components) {
    this.components = [];
    if (this.json.components) {
      for (component_selections of this.json.components) {
        var tmp_component_selections = [];
        for (component of component_selections) {
          if (component[2] == "LIST") {
            var tmp_req = new RequirementClass(component[0]);
            Array.prototype.push.apply(
              tmp_component_selections,
              tmp_req.getComponentSelections(multiplier)
            );
          } else {
            tmp_component_selections.push([
              component[0],
              component[1] * multiplier >= 0 ? component[1] * multiplier : -1
            ]);
          }
        }
        this.components.push(tmp_component_selections);
      }
    }
  }
  return this.components;
};

RequirementClass.prototype.getQualities = function() {
  if (!this.qualities) {
    this.qualities = [];
    if (this.json.qualities) {
      for (q of this.json.qualities) {
        this.qualities.push(q);
      }
    }
  }
  return this.qualities;
};
