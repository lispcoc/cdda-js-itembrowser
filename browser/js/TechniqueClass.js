class TechniqueClass extends GenericClass {
    static get all_json() {
        return techniques;
    }

    static get all_mod_json() {
        return mod_techniques;
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