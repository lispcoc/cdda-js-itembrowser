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
        return this.json.name ? this.json.name : Tr("No name tool quality");
    }
}