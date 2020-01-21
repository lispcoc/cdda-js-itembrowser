var all_flag_data = [];

class JsonFlagClass {
    static initAllData() {
        all_flag_data = [];
        for (var jo of flags) {
            var tmp = new JsonFlagClass(jo);
            tmp.init();
            tmp.is_mod = false;
        }
        for (var jo of mod_flags) {
            var tmp = new JsonFlagClass(jo);
            tmp.init();
            tmp.is_mod = false;
        }
    }

    static searchData(id) {
        var res = null;
        all_flag_data.forEach(function(tmp) {
            if (tmp.id == id) {
                res = tmp;
            }
        });
        return res;
    }

    static getAllData() {
        return all_flag_data;
    }

    constructor(jo) {
        this.json = jo;
        all_flag_data.push(this);
    }

    init() {

    }

    get id() {
        return this.json.id ? this.json.id : null;
    }

    get name() {
        return this.json.name ? this.json.name : Tr("No name skill");
    }

    get info() {
        if (this.json.info) {
            return this.json.info;
        } else if (this.json.description) {
            return this.json.description;
        }
        return null;
    }
}