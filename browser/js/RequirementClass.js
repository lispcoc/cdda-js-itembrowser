var all_requirement_data = [];

class RequirementClass {
    static initAllData() {
        all_requirement_data = [];
        for (var jo of requirements) {
            var tmp = new RequirementClass(jo);
            tmp.init();
            tmp.is_mod = false;
        }
        for (var jo of mod_requirements) {
            var tmp = new RequirementClass(jo);
            tmp.init();
            tmp.is_mod = true;
        }
    }

    static searchData(id) {
        console.log(id);
        var res = null;
        all_requirement_data.forEach(function(tmp) {
            if (tmp.id == id) {
                res = tmp;
            }
        });
        return res;
    }

    static getAllData() {
        return all_requirement_data;
    }

    constructor(jo) {
        this.json = jo;
        all_requirement_data.push(this);
    }

    init() {

    }

    get id() {
        return this.json.id ? this.json.id : null;
    }

    getQualities() {
        return this.json.qualities ? this.json.qualities : [];
    }

    getComponents(multiplier) {
        var components = [];
        if (this.json.components) {
            for (var component_selections of this.json.components) {
                var tmp_component_selections = [];
                for (var component of component_selections) {
                    if (component[2] == "LIST") {
                        var tmp_req = RequirementClass.searchData(component[0]);
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
                components.push(tmp_component_selections);
            }
        }
        return components;
    }

    getComponentSelections(multiplier) {
        var component_selections = [];
        if (this.json.components[0]) {
            for (var component of this.json.components[0]) {
                if (component[2] == "LIST") {
                    var tmp_req = RequirementClass.searchData(component[0]);
                    Array.prototype.push.apply(
                        component_selections,
                        tmp_req.getComponentSelections(multiplier)
                    );
                } else {
                    component_selections.push([
                        component[0],
                        component[1] * multiplier
                    ]);
                }
            }
        }
        return component_selections;
    }

    getTools(multiplier) {
        var tools = [];
        if (this.json.tools) {
            for (var tool_selections of this.json.tools) {
                var tmp_tool_selections = [];
                for (tool of tool_selections) {
                    if (tool[2] == "LIST") {
                        var tmp_req = RequirementClass.searchData(tool[0]);
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
                tools.push(tmp_tool_selections);
            }
        }
        return tools;
    }

    getToolSelections(multiplier) {
        var tool_selections = [];
        if (this.json.tools) {
            for (var tool of this.json.tools[0]) {
                if (tool[2] == "LIST") {
                    var tmp_req = RequirementClass.searchData(tool[0]);
                    Array.prototype.push.apply(
                        tool_selections,
                        tmp_req.getToolSelections(multiplier)
                    );
                } else {
                    tool_selections.push([
                        tool[0],
                        tool[1] * multiplier >= 0 ? tool[1] * multiplier : -1
                    ]);
                }
            }
        }
        return tool_selections;
    }
}