class JsonFlagClass extends GenericClass {
    static get all_json() {
        return flags;
    }

    static get all_mod_json() {
        return mod_flags;
    }

    get id() {
        return this.json.id ? this.json.id : null;
    }

    get name() {
        return this.json.name ? this.json.name : Tr("No name flag");
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