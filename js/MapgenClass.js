function isString(obj) {
    return typeof(obj) == "string" || obj instanceof String;
}

function decomposeArray(t) {
    var res = [];
    if (!Array.isArray(t)) {
        res.push(t);
    } else {
        for (var t2 of t) {
            for (var t3 of decomposeArray(t2)) {
                if (t3) {
                    res.push(t3);
                }
            }
        }
    }
    return res;
}

class MapgenClass extends GenericClass {
    static get all_json() {
        return mapgens;
    }

    static get all_mod_json() {
        return [];
    }

    get id() {
        return "";
    }

    get name() {
        return "";
    }

    get palettes() {
        return this.json.object.palettes ? this.json.object.palettes : [];
    }

    get items() {
        if (this._items) {
            return this._items;
        }
        this._items = {};
        for (const palette_id of this.palettes) {
            const palette = PaletteClass.searchData(palette_id);
            for (var key in palette.items) {
                this._items[key] = palette.items[key];
            }
        }
        if (this.json.object.items) {
            for (var key in this.json.object.items) {
                this._items[key] = this.json.object.items[key];
            }
        }
        return this._items;
    }

    get place_items() {
        return this.json.object.place_items ? this.json.object.place_items : [];
    }

    get rows_str() {
        return this.json.object.rows ? this.json.object.rows.join('') : '';
    }

    init() {
        super.init();

        this.om_terrain = decomposeArray(this.json.om_terrain);
    }

    static get_om_terrain_from_item(ig_id) {
        var res = [];
        this.all_data.forEach(function(tmp) {
            if (tmp.has_item(ig_id)) {
                res.push(tmp.om_terrain);
            }
        });
        return decomposeArray(res);
    }

    has_item(ig_id) {
        for (var t in this.items) {
            if (this.rows_str.indexOf(t) != -1) {
                for (var t2 of decomposeArray(this.items[t])) {
                    if (t2.item && t2.item == ig_id) {
                        return true;
                    }
                }
            }
        }

        for (var t of this.place_items) {
            if (t.item && t.item == ig_id) {
                return true;
            }
        }
        return false;
    }
}