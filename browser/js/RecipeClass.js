function copy_json_obj(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function internal_get_recipes_from_result(key_id) {
  var recipe_list = [];
  for (var recipe of mod_recipes) {
    if (recipe.result || recipe.abstract) {
      if (recipe.result == key_id || recipe.abstract == key_id) {
        recipe_list.push(recipe);
      }
    }
  }
  for (var recipe of recipes) {
    if (recipe.result || recipe.abstract) {
      if (recipe.result == key_id || recipe.abstract == key_id) {
        recipe_list.push(recipe);
      }
    }
  }
  return recipe_list;
}

function internal_get_recipe_from_id(key_id, num = 0) {
  for (var recipe of mod_recipes) {
    if (recipe.result || recipe.abstract) {
      var id = null;
      if (recipe.abstract) {
        id = recipe.abstract;
      } else {
        id = recipe.id_suffix
          ? recipe.result + "_" + recipe.id_suffix
          : recipe.result;
      }
      if (id == key_id || recipe.abstract == key_id) {
        if (num == 0) {
          return recipe;
        }
        num--;
      }
    }
  }
  for (var recipe of recipes) {
    if (recipe.result || recipe.abstract) {
      var id = null;
      if (recipe.abstract) {
        id = recipe.abstract;
      } else {
        id = recipe.id_suffix
          ? recipe.result + "_" + recipe.id_suffix
          : recipe.result;
      }
      if (id == key_id || recipe.abstract == key_id) {
        if (num == 0) {
          return recipe;
        }
        num--;
      }
    }
  }
  return null;
}

RecipeClass = function(id, nested = 0) {
  this.id = id;
  this.nested = nested;
  this.json = internal_get_recipe_from_id(id, nested);
};

RecipeClass.prototype.getResult = function() {
  return this.result;
};

RecipeClass.prototype.getJson = function() {
  return this.json;
};

RecipeClass.prototype.getCopyFrom = function() {
  if (this.json["copy-from"]) {
    if (this.json["copy-from"] == this.id) {
      return new RecipeClass(this.json["copy-from"], this.nested + 1);
    }
    return new RecipeClass(this.json["copy-from"], 0);
  }
  return null;
};

RecipeClass.prototype.getSkillUsed = function() {
  if (!this.skill_used) {
    var copy_from = this.getCopyFrom();
    if (this.json.skill_used) {
      this.skill_used = this.json.skill_used;
    } else if (copy_from) {
      this.skill_used = copy_from.getSkillUsed();
    } else {
      this.skill_used = "N/A";
    }
  }
  return this.skill_used;
};

RecipeClass.prototype.getSkillsRequired = function() {
  if (!this.skills_required) {
    var copy_from = this.getCopyFrom();
    if (this.json.skills_required) {
      this.skills_required = this.json.skills_required;
    } else if (copy_from) {
      this.skills_required = copy_from.getSkillsRequired();
    } else {
      this.skills_required = [[]];
    }
  }
  if (!Array.isArray(this.skills_required[0])) {
    this.skills_required = [this.skills_required];
  }
  return this.skills_required;
};

RecipeClass.prototype.getDifficulty = function() {
  if (!this.difficulty) {
    var copy_from = this.getCopyFrom();
    if (this.json.difficulty) {
      this.difficulty = this.json.difficulty;
    } else if (copy_from) {
      this.difficulty = copy_from.getDifficulty();
    } else {
      this.difficulty = "0";
    }
  }
  return this.difficulty;
};

RecipeClass.prototype.getTime = function() {
  if (!this.time) {
    var copy_from = this.getCopyFrom();
    if (this.json.time) {
      this.time = this.json.time;
    } else if (copy_from) {
      this.time = copy_from.getTime();
    } else {
      this.time = 0;
    }
  }
  if (typeof this.time == "number") {
    this.time=this.time/6000;
	//1回合=1秒=100点行动点数,60回合=60秒=1分钟=6000点行动点数
	if (Number.isInteger(this.time)){
	this.time=this.time+"m";	
	}
	else {
	 var a = Math.floor(this.time);
	 var b = this.time-a;	
	 b=Math.round(b*60);
      this.time = a+"m"+b+"s";
    }
  } 
  return this.time;
};

RecipeClass.prototype.getAutolearn = function() {
  if (!this.autolearn) {
    var copy_from = this.getCopyFrom();
    if (this.json.autolearn) {
      this.autolearn = this.json.autolearn;
    } else if (copy_from) {
      this.autolearn = copy_from.getAutolearn();
    } else {
      this.autolearn = false;
    }
  }
  return this.autolearn;
};

RecipeClass.prototype.getBookLearn = function() {
  if (!this.book_learn) {
    var copy_from = this.getCopyFrom();
    if (this.json.book_learn) {
      this.book_learn = this.json.book_learn;
    } else if (copy_from) {
      this.book_learn = copy_from.getBookLearn();
    } else {
      this.book_learn = [];
    }
  }
  return this.book_learn;
};

RecipeClass.prototype.getQualities = function() {
  if (!this.qualities) {
    var copy_from = this.getCopyFrom();
    if (this.json.qualities) {
      this.qualities = this.json.qualities;
    } else if (copy_from) {
      this.qualities = copy_from.getQualities();
    } else {
      this.qualities = [];
    }
  }
  if (!Array.isArray(this.qualities)) {
    this.qualities = [this.qualities];
  }

  if (this.json.using) {
    console.log(this.json.using);
    for (u of this.json.using) {
      var req = new RequirementClass(u[0]);
      var r = req.getQualities(u[1]);
      if (r.length > 0) {
        console.log(r);
        Array.prototype.push.apply(this.qualities, r);
      }
    }
  }

  return this.qualities;
};

RecipeClass.prototype.getTools = function() {
  if (!this.tools) {
    this.tools = [];

    if (this.json.using) {
      console.log(this.json.using);
      for (u of this.json.using) {
        var req = new RequirementClass(u[0]);
        var r = req.getTools(u[1]);
        if (r.length > 0) {
          console.log(r);
          Array.prototype.push.apply(this.tools, r);
        }
      }
    }

    var tmp_tools = [];
    var copy_from = this.getCopyFrom();
    if (this.json.tools) {
      tmp_tools = this.json.tools;
    } else if (copy_from) {
      tmp_tools = copy_from.getTools();
    }
    for (t1 of tmp_tools) {
      var tmp_tools_2 = [];
      for (t2 of t1) {
        if (t2[2] == "LIST") {
          var req = new RequirementClass(t2[0]);
          var r = req.getToolSelections(t2[1]);
          Array.prototype.push.apply(tmp_tools_2, r);
        } else {
          if (t2) {
            tmp_tools_2.push(t2);
          }
        }
      }
      if (tmp_tools_2.length) {
        this.tools.push(tmp_tools_2);
      }
    }
  }
  return this.tools;
};

RecipeClass.prototype.getComponents = function() {
  if (!this.components) {
    this.components = [];

    if (this.json.using) {
      console.log(this.json.using);
      for (u of this.json.using) {
        var req = new RequirementClass(u[0]);
        var r = req.getComponents(u[1]);
        if (r.length > 0) {
          console.log(r);
          Array.prototype.push.apply(this.components, r);
        }
      }
    }

    var tmp_components = [];
    var copy_from = this.getCopyFrom();
    if (this.json.components) {
      tmp_components = this.json.components;
    } else if (copy_from) {
      tmp_components = copy_from.getComponents();
    }
    for (t1 of tmp_components) {
      var tmp_components_2 = [];
      for (t2 of t1) {
        if (t2[2] == "LIST") {
          var req = new RequirementClass(t2[0]);
          var r = req.getComponentSelections(t2[1]);
          Array.prototype.push.apply(tmp_components_2, r);
        } else {
          if (t2) {
            tmp_components_2.push(t2);
          }
        }
      }
      if (tmp_components_2.length) {
        this.components.push(tmp_components_2);
      }
    }
  }
  return this.components;
};

RecipeListClass = function(result) {
  this.result = result;
  this.json_list = internal_get_recipes_from_result(this.result);
  this.list = [];
  // @todo: id重複してるレシピを消す
  for (var j of this.json_list) {
    var id = null;
    if (j.abstract) {
      id = j.abstract;
    } else {
      id = j.id_suffix ? j.result + "_" + j.id_suffix : j.result;
    }
    if (id) {
      this.list.push(new RecipeClass(id));
    }
  }
};

RecipeListClass.prototype.getRecipe = function(n) {
  if (this.list[n]) {
    return this.list[n];
  }
  return null;
};

RecipeClass.prototype.getbatch_time_factors = function() {
  if (!this.batch_time_factors) {
    var copy_from = this.getCopyFrom();
    if (this.json.batch_time_factors) {
      this.batch_time_factors = this.json.batch_time_factors;
    } else if (copy_from) {
      this.batch_time_factors = copy_from.getbatch_time_factors();
    } else {
      this.batch_time_factors = [[]];
    }
  }
  if (!Array.isArray(this.batch_time_factors[0])) {
    this.batch_time_factors = [this.batch_time_factors];
  }
  return this.batch_time_factors;
};

RecipeClass.prototype.getFlags = function() {
  if (!this.flags) {
    var copy_from = this.getCopyFrom();
    if (this.json.flags) {
      this.flags = this.json.flags;
    } else if (copy_from) {
      this.flags = copy_from.getFlags();
    } else {
      this.flags = [];
    }
  }
  return this.flags;
};

RecipeClass.prototype.hasFlag = function(key_flag) {
  for (f of this.getFlags()) {
    if (f == key_flag) {
      return true;
    }
  }
  return false;
};