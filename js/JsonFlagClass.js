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
        if (this.json.name) {
            if (this.json.name.str) {
                return __(this.json.name.str);
            }
            return __(this.json.name);
        }
        return Tr("No name flag");
    }

    get info() {
        if (this.json.info) {
            return __(this.json.info);
        } else if (this.json.description) {
            return __(this.json.description);
        }
        return null;
    }
}