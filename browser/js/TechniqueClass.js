var all_technique_data = [];

class TechniqueClass {
    static initAllData() {
        all_technique_data = [];
        for (var jo of techniques) {
            var tmp = new TechniqueClass(jo);
            tmp.init();
            tmp.is_mod = false;
        }
        for (var q of mod_techniques) {
            var tmp = new TechniqueClass(jo);
            tmp.init();
            tmp.is_mod = true;
        }
    }

    static searchData(id) {
        var res = null;
        all_technique_data.forEach(function(tmp) {
            if (tmp.id == id) {
                res = tmp;
            }
        });
        return res;
    }

    static getAllData() {
        return all_technique_data;
    }

    constructor(jo) {
        this.json = jo;
        all_technique_data.push(this);
    }

    init() {

    }

    get id() {
        return this.json.id ? this.json.id : null;
    }

    get name() {
        return this.json.name ? this.json.name : Tr("No name technique");
    }

    get info() {
        if (this.json.info) {
            return this.json.info;
        } else if (this.json.description) {
            return this.json.description;
        }
        return "No description.";
    }
}