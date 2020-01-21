var all_material_data = [];

class MaterialClass {
    static initAllData() {
        all_material_data = [];
        for (var jo of materials) {
            var tmp = new MaterialClass(jo);
            tmp.init();
            tmp.is_mod = false;
        }
        for (var jo of mod_materials) {
            var tmp = new MaterialClass(jo);
            tmp.init();
            tmp.is_mod = true;
        }
    }

    static searchData(id) {
        var res = null;
        all_material_data.forEach(function(tmp) {
            if (tmp.id == id) {
                res = tmp;
            }
        });
        return res;
    }

    static getAllData() {
        return all_material_data;
    }

    constructor(jo) {
        this.json = jo;
        all_material_data.push(this);
    }

    init() {

    }

    get id() {
        return this.json.ident ? this.json.ident : null;
    }

    get name() {
        return this.json.name ? this.json.name : Tr("No name material");
    }

    get bash_resist() {
        return this.json.bash_resist ? this.json.bash_resist : 0;
    }

    get cut_resist() {
        return this.json.cut_resist ? this.json.cut_resist : 0;
    }

    get acid_resist() {
        return this.json.acid_resist ? this.json.acid_resist : 0;
    }

    get fire_resist() {
        return this.json.fire_resist ? this.json.fire_resist : 0;
    }

    get elec_resist() {
        return this.json.elec_resist ? this.json.elec_resist : 0;
    }
}