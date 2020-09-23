function isString(obj) {
    return typeof(obj) == "string" || obj instanceof String;
}

function isInternalItemgroup(obj) {
    return typeof(obj) == "InternalItemgroup" || obj instanceof InternalItemgroup;
}

class ItemGroupEntry {
    constructor(obj, type = null) {
        if (!type) {
            const cand = ["item", "group"];
            for (const c of cand) {
                if (obj[c]) {
                    this.type = c;
                    break;
                }
            }
        } else {
            this.type = type;
        }
        this.id = obj[this.type];
        this.prob = obj.prob ? obj.prob : 100;
    }

    isItem() {
        return this.type == "item";
    }

    isGroup() {
        return this.type == "group";
    }
}

class InternalItemgroup {
    constructor(subtype = "distribution", prob = 100) {
        this.prob = prob;
        this.subtype = subtype;
        this.cont = [];
    }

    addEntry(obj, def_type = null) {
        var ig = null;
        var jarr = null;
        var prob = obj.prob ? prob : 100;
        if (obj.distribution) {
            ig = new InternalItemgroup("distribution", prob);
            jarr = obj.distribution;
        } else if (obj.collection) {
            ig = new InternalItemgroup("collection", prob);
            jarr = obj.collection;
        }
        if (ig) {
            for (var e of jarr) {
                ig.addEntry(e);
            }
            this.cont.push(ig);
        } else {
            var new_obj = {};
            if (isString(obj)) {
                new_obj[def_type] = obj;
                new_obj.prob = 100;
            } else if (Array.isArray(obj)) {
                new_obj[def_type] = obj[0];
                new_obj.prob = obj[1];
            } else {
                new_obj = obj;
            }
            this.cont.push(new ItemGroupEntry(new_obj));
        }
    }

    itemRate(item_id) {
        var sum_prob = 0;
        var item_prob = 0;
        for (const e of this.cont) {
            sum_prob += e.prob;
            if (isInternalItemgroup(e)) {
                item_prob += e.prob * e.itemRate(item_id);
            } else if (e.isGroup()) {
                const ig = ItemGroupClass.searchData(e.id);
                if (ig) {
                    item_prob += e.prob * ig.itemRate(item_id);
                }
            } else if (e.isItem() && e.id == item_id) {
                item_prob += e.prob;
            }
        }
        if (this.subtype == "collection") {
            return (item_prob / 100);
        } else if (this.subtype == "distribution") {
            return (item_prob / sum_prob);
        }
        return (item_prob / sum_prob);
    }
}

class ItemGroupClass extends GenericClass {
    static get all_json() {
        return itemgroups;
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

    get subtype() {
        return this.json.subtype ? this.json.subtype : "distribution";
    }

    get entries() {
        return this.json.entries ? this.json.entries : [];
    }

    get items() {
        return this.json.items ? this.json.items : [];
    }

    get groups() {
        return this.json.groups ? this.json.groups : [];
    }

    initEntries() {
        this.internal_ig = new InternalItemgroup(this.subtype);

        // Perse entries
        for (const e of this.entries) {
            this.internal_ig.addEntry(e);
        }
        // Perse items
        for (var e of this.items) {
            this.internal_ig.addEntry(e, "item");
        }
        // Perse groups
        for (var e of this.groups) {
            this.internal_ig.addEntry(e, "group");
        }
    }

    itemRate(item_id) {
        return this.internal_ig.itemRate(item_id);
    }

    init() {
        super.init();

        this.initEntries();
    }
}