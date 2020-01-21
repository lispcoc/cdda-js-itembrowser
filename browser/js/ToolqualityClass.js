var all_quality_data = [];

class ToolqualityClass {
    static initAllData() {
        all_quality_data = [];
        for (var q of tool_qualitys) {
            var tmp = new ToolqualityClass(q);
            tmp.init();
            tmp.is_mod = false;
        }
        for (var q of mod_tool_qualitys) {
            var tmp = new ToolqualityClass(q);
            tmp.init();
            tmp.is_mod = true;
        }
    }

    static searchData(id) {
        var res = null;
        all_quality_data.forEach(function(q) {
            if (q.id == id) {
                res = q;
            }
        });
        return res;
    }

    static getAllData() {
        return all_quality_data;
    }

    constructor(jo) {
        this.json = jo;
        if (jo.id) {
            this.id = jo.id;
        } else {
            this.id = null;
            return;
        }
        all_quality_data.push(this);
    }

    init() {

    }

    get name() {
        return this.json.name ? this.json.name : Tr("No name tool quality");
    }
}