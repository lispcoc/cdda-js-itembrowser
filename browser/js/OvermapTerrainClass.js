class OvermapTerrainClass extends GenericClass {
    static get all_json() {
        return overmap_terrains;
    }

    static get all_mod_json() {
        return []; //todo
    }

    get id() {
        if (this.json.id) {
            return this.json.id;
        } else if (this.json.abstract) {
            return this.json.abstract;
        }
        return null;
    }

    get name() {
        return this._name ? __(this._name) : "No name overmap_terrain";
    }

    set name(name) {
        this._name = name;
    }

    get name_with_id() {
        if (this.id) {
            return this.name + '(' + this.id + ')';
        }
        return this.name;
    }

    init() {
        super.init();

        if (this.json.name) {
            this.name = this.json.name;
        }
    }
}