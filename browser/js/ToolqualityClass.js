class ToolqualityClass extends GenericClass {
    static get all_json() {
        return tool_qualitys;
    }

    static get all_mod_json() {
        return mod_tool_qualitys;
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
        return Tr("No name tool quality");
    }
}