class PaletteClass extends GenericClass {
    static get all_json() {
        return palettes;
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
        return "";
    }

    get items() {
        return this.json.items ? this.json.items : {};
    }

    init() {
        super.init();
    }
}