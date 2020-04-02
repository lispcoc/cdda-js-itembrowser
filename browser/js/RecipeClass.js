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
                id = recipe.id_suffix ?
                    recipe.result + "_" + recipe.id_suffix :
                    recipe.result;
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
                id = recipe.id_suffix ?
                    recipe.result + "_" + recipe.id_suffix :
                    recipe.result;
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

class RecipeClass extends GenericClass {
    static get all_json() {
        return recipes;
    }

    static get all_mod_json() {
        return mod_recipes;
    }

    static searchDataFromResult(result) {
        var list = {};
        var retval = [];
        this.all_data.forEach(function(tmp) {
            if (tmp.result == result && tmp.valid) {
                list[tmp.id] = tmp;
            }
        });
        for (var key in list) {
            retval.push(list[key]);
        }
        return retval;
    }

    init() {
        super.init();

        if (this.valid) {
            this.nested = 0;

            if (this.json.skill_used) {
                this.skill_used = this.json.skill_used;
            } else if (!this.skill_used) {
                this.skill_used = "N/A";
            }

            if (this.json.skills_required) {
                if (Array.isArray(this.json.skills_required[0])) {
                    this.skills_required = this.json.skills_required;
                } else {
                    this.skills_required = [];
                    this.skills_required.push(this.json.skills_required);
                }
            } else if (!this.skills_required) {
                this.skills_required = [
                    []
                ];
            }

            if (this.json.difficulty) {
                this.difficulty = this.json.difficulty;
            } else if (!this.difficulty) {
                this.difficulty = 0;
            }

            if (this.json.time) {
                this.time = this.json.time;
            } else if (!this.time) {
                this.time = 0;
            }

            if (this.json.autolearn) {
                this.autolearn = this.json.autolearn;
            } else if (!this.autolearn) {
                this.autolearn = false;
            }

            if (this.json.book_learn) {
                this.book_learn = this.json.book_learn;
            } else if (!this.book_learn) {
                this.book_learn = [];
            }

            if (this.json.batch_time_factors) {
                this.batch_time_factors = this.json.batch_time_factors;
                if (!Array.isArray(this.batch_time_factors[0])) {
                    this.batch_time_factors = [this.batch_time_factors];
                }
            } else if (!this.batch_time_factors) {
                this.batch_time_factors = [
                    []
                ];
            }

            if (this.json.flags) {
                this.flags = this.json.flags;
            } else if (!this.flags) {
                this.flags = [
                    []
                ];
            }

            if (this.json.using) {
                this.using = this.json.using;
            } else if (!this.using) {
                this.using = [];
            }

            if (this.json.tools) {
                this.tools = this.json.tools;
            } else if (!this.tools) {
                this.tools = [];
            }

            if (this.json.components) {
                this.components = this.json.components;
            } else if (!this.components) {
                this.components = [];
            }

            if (this.json.qualities) {
                this.qualities = this.json.qualities;
            } else if (!this.qualities) {
                this.qualities = [];
            }
        }
    }

    get id() {
        return this.result + this.id_suffix;
    }

    get id_suffix() {
        return this.json.id_suffix ? this.json.id_suffix : "";
    }

    get result() {
        if (this.json.result) {
            return this.json.result;
        } else if (this.json.abstract) {
            return this.json.abstract;
        }
        return null;
    }

    getResult() {
        return this.result;
    }

    getJson() {
        return this.json;
    }

    getCopyFrom() {
        return this.copy_from ? this.copy_from : null;
    }

    getSkillUsed() {
        return this.skill_used;
    }

    getSkillsRequired() {
        return this.skills_required
    }

    getDifficulty() {
        return this.difficulty;
    }

    getTime() {
        var ret = this.time;
        if (typeof ret == "number") {
            ret = ret / 6000;
            //1回合=1秒=100点行动点数,60回合=60秒=1分钟=6000点行动点数
            if (Number.isInteger(ret)) {
                ret = ret + "m";
            } else {
                var a = Math.floor(ret);
                var b = ret - a;
                b = Math.round(b * 60);
                ret = a + "m" + b + "s";
            }
        }
        return ret;
    }

    getAutolearn() {
        return this.autolearn;
    }

    getBookLearn() {
        return this.book_learn;
    }

    getQualities() {
        var res = [];
        for (var t1 of this.qualities) {
            res.push(t1);
        }
        for (var u of this.using) {
            var tmp_qualities = RequirementClass.searchData(u[0]).getQualities(u[1]);
            for (var t1 of tmp_qualities) {
                res.push(t1);
            }
        }
        //console.log(res);
        return res;
    }

    getTools() {
        var res = [];
        for (var t1 of this.tools) {
            var tmp_tools = [];
            for (var t2 of t1) {
                if (t2[2] == "LIST") {
                    for (var req_tool of RequirementClass.searchData(t2[0]).getToolSelections(t2[1])) {
                        tmp_tools.push(req_tool);
                    }
                } else {
                    tmp_tools.push(t2);
                }
            }
            if (tmp_tools.length) {
                res.push(tmp_tools);
            }
        }
        for (var u of this.using) {
            var tmp_tools = RequirementClass.searchData(u[0]).getToolSelections(u[1]);
            if (tmp_tools.length) {
                res.push(tmp_tools);
            }
        }
        return res;
    }

    getComponents() {
        var res = [];
        var reqs = {};

        for (var t1 of this.components) {
            var tmp_components = [];
            for (var t2 of t1) {
                if (t2[2] == "LIST") {
                    for (var req_tool of RequirementClass.searchData(t2[0]).getComponentSelections(t2[1])) {
                        tmp_components.push(req_tool);
                    }
                } else {
                    tmp_components.push(t2);
                }
            }
            if (tmp_components.length) {
                res.push(tmp_components);
            }
        }
        for (var u of this.using) {
            var tmp_components = RequirementClass.searchData(u[0]).getComponentSelections(u[1]);
            if (tmp_components.length) {
                res.push(tmp_components);
            }
        }
        return res;
    }

    getbatch_time_factors() {
        return this.batch_time_factors;
    }

    getFlags() {
        return this.flags;
    }

    hasFlag(key_flag) {
        for (var f of this.getFlags()) {
            if (f == key_flag) {
                return true;
            }
        }
        return false;
    }
}

class RecipeListClass {
    constructor(result) {
        this.result = result;
        this.list = RecipeClass.searchDataFromResult(this.result);
    }

    getRecipe(n) {
        return this.list[n] ? this.list[n] : null;
    }
}