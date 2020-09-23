class MaterialClass extends GenericClass {
    static get all_json() {
        return materials;
    }

    static get all_mod_json() {
        return mod_materials;
    }

    get id() {
        if (this.json.id) {
            return this.json.id;
        }
        // old core
        if (this.json.ident) {
            return this.json.ident;
        }
        return null;
    }

    get name() {
        if (this.json.name) {
            if (this.json.name.str) {
                return __(this.json.name.str);
            }
            return __(this.json.name);
        }
        return Tr("No name material");
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