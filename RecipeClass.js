function copy_json_obj (obj) {
  return JSON.parse (JSON.stringify (obj));
}

function internal_get_recipes_from_id (key_id) {
  var recipe_list = [];
  for (var recipe of recipes) {
    if (recipe.result || recipe.abstract) {
      if (recipe.result == key_id || recipe.abstract == key_id) {
        recipe_list.push (recipe);
      }
    }
  }
  return recipe_list;
}

function internal_get_requirement_from_id (key_id) {
  for (var requirement of requirements) {
    if (requirement['id']) {
      if (requirement['id'] == key_id) {
        return requirement;
      }
    }
  }
  return null;
}

RecipeClass = function (json) {
  this.result = json.result;
  this.json = json;
};

RecipeClass.prototype.getResult = function () {
  return this.result;
};

RecipeClass.prototype.getJson = function () {
  return this.json;
};

RecipeClass.prototype.getSkillUsed = function () {
  if (!this.skill_used) {
    if (this.json.skill_used) {
      this.skill_used = this.json.skill_used;
    } else if (this.json['copy-from']) {
      var copy_from = new ItemClass (this.json['copy-from']);
      this.skill_used = copy_from.getSkillUsed ();
    } else {
      this.skill_used = 'N/A';
    }
  }
  return this.skill_used;
};

RecipeClass.prototype.getSkillsRequired = function () {
  if (!this.skills_required) {
    if (this.json.skills_required) {
      this.skills_required = this.json.skills_required;
    } else if (this.json['copy-from']) {
      var copy_from = new ItemClass (this.json['copy-from']);
      this.skills_required = copy_from.getSkillsRequired ();
    } else {
      this.skills_required = [[]];
    }
  }
  if (!Array.isArray (this.skills_required[0])) {
    this.skills_required = [this.skills_required];
  }
  return this.skills_required;
};

RecipeClass.prototype.getDifficulty = function () {
  if (!this.difficulty) {
    if (this.json.difficulty) {
      this.difficulty = this.json.difficulty;
    } else if (this.json['copy-from']) {
      var copy_from = new ItemClass (this.json['copy-from']);
      this.difficulty = copy_from.getDifficulty ();
    } else {
      this.difficulty = 'N/A';
    }
  }
  return this.difficulty;
};

RecipeClass.prototype.getTime = function () {
  if (!this.time) {
    if (this.json.time) {
      this.time = this.json.time;
    } else if (this.json['copy-from']) {
      var copy_from = new ItemClass (this.json['copy-from']);
      this.time = copy_from.getTime ();
    } else {
      this.time = 0;
    }
  }
  return this.time;
};

RecipeClass.prototype.getAutolearn = function () {
  if (!this.autolearn) {
    if (this.json.autolearn) {
      this.autolearn = this.json.autolearn;
    } else if (this.json['copy-from']) {
      var copy_from = new ItemClass (this.json['copy-from']);
      this.autolearn = copy_from.getAutolearn ();
    } else {
      this.autolearn = true;
    }
  }
  return this.autolearn;
};

RecipeClass.prototype.getBookLearn = function () {
  if (!this.book_learn) {
    if (this.json.book_learn) {
      this.book_learn = this.json.book_learn;
    } else if (this.json['copy-from']) {
      var copy_from = new ItemClass (this.json['copy-from']);
      this.book_learn = copy_from.getBookLearn ();
    } else {
      this.book_learn = [];
    }
  }
  return this.book_learn;
};

RecipeClass.prototype.getQualities = function () {
  if (!this.qualities) {
    if (this.json.qualities) {
      this.qualities = this.json.qualities;
    } else if (this.json['copy-from']) {
      var copy_from = new ItemClass (this.json['copy-from']);
      this.qualities = copy_from.getQualities ();
    } else {
      this.qualities = [];
    }
  }
  if (!Array.isArray (this.qualities)) {
    this.qualities = [this.qualities];
  }
  return this.qualities;
};

RecipeClass.prototype.getTools = function () {
  // todo:ソースが汚いので整理する
  // todo:型の次元が想定外の場合対策する必要あるかも？
  if (!this.tools) {
    this.tools = [];

    if (this.json.using) {
      console.log (this.json.using);
      for (u of this.json.using) {
        var requirement = copy_json_obj (
          internal_get_requirement_from_id (u[0])
        );
        console.log (requirement);
        if (requirement.tools) {
          for (r of requirement.tools) {
            for (rr of r) {
              rr[1] = u[1] != -1 && rr[1] != -1 ? u[1] * rr[1] : -1;
            }
            this.tools.push (r);
          }
        }
      }
    }

    var tmp_tools = [];
    if (this.json.tools) {
      tmp_tools = this.json.tools;
    } else if (this.json['copy-from']) {
      var copy_from = new ItemClass (this.json['copy-from']);
      tmp_tools = copy_from.getTools ();
    }
    for (t1 of tmp_tools) {
      var tmp_tools_2 = [];
      for (t2 of t1) {
        if (t2[2] == 'LIST') {
          var requirement = copy_json_obj (
            internal_get_requirement_from_id (t2[0])
          );
          if (requirement.tools[0]) {
            for (t3 of requirement.tools[0]) {
              t3[1] = t2[1] != -1 && t3[1] != -1 ? t2[1] * t3[1] : -1;
              tmp_tools_2.push (t3);
            }
          }
        } else {
          if (t2) {
            tmp_tools_2.push (t2);
          }
        }
      }
      if (tmp_tools_2.length) {
        this.tools.push (tmp_tools_2);
      }
    }
  }
  return this.tools;
};

RecipeClass.prototype.getComponents = function () {
  // todo:ソースが汚いので整理する
  // todo:型の次元が想定外の場合対策する必要あるかも？
  if (!this.components) {
    this.components = [];

    if (this.json.using) {
      console.log (this.json.using);
      for (u of this.json.using) {
        var requirement = copy_json_obj (
          internal_get_requirement_from_id (u[0])
        );
        console.log (requirement);
        if (requirement.components) {
          for (r of requirement.components) {
            for (rr of r) {
              rr[1] = u[1] != -1 && rr[1] != -1 ? u[1] * rr[1] : -1;
            }
            this.components.push (r);
          }
        }
      }
    }

    var tmp_components = [];
    if (this.json.components) {
      tmp_components = this.json.components;
    } else if (this.json['copy-from']) {
      var copy_from = new ItemClass (this.json['copy-from']);
      tmp_components = copy_from.getTools ();
    }
    for (t1 of tmp_components) {
      var tmp_components_2 = [];
      for (t2 of t1) {
        if (t2[2] == 'LIST') {
          var requirement = copy_json_obj (
            internal_get_requirement_from_id (t2[0])
          );
          if (requirement.components[0]) {
            for (t3 of requirement.components[0]) {
              t3[1] = t2[1] != -1 && t3[1] != -1 ? t2[1] * t3[1] : -1;
              tmp_components_2.push (t3);
            }
          }
        } else {
          if (t2) {
            tmp_components_2.push (t2);
          }
        }
      }
      if (tmp_components_2.length) {
        this.components.push (tmp_components_2);
      }
    }
  }
  return this.components;
};

RecipeListClass = function (result) {
  this.result = result;
  this.json_list = internal_get_recipes_from_id (this.result);
  this.list = [];
  for (var j of this.json_list) {
    this.list.push (new RecipeClass (j));
  }
};

RecipeListClass.prototype.getRecipe = function (n) {
  if (this.list[n]) {
    return this.list[n];
  }
  return null;
};
