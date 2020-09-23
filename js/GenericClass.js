class GenericClass {
    static initAllData() {
        this.all_data = [];
        for (var jo of this.all_json) {
            var tmp = new this(jo);
            tmp.init();
            tmp.is_mod = false;
            this.all_data.push(tmp);
        }
        for (var jo of this.all_mod_json) {
            var tmp = new this(jo);
            tmp.init();
            tmp.is_mod = true;
            this.all_data.push(tmp);
        }

        var isCopyFromResolved = false;
        var pre_remains = 0;
        while (!isCopyFromResolved) {
            var remains = 0;
            isCopyFromResolved = true;
            for (var tmp of this.all_data) {
                if (!tmp.valid) {
                    tmp.init();
                }
                if (!tmp.valid) {
                    isCopyFromResolved = false;
                    remains++;
                }
            }
            // Prevent infinite loop by invalid "copy-from".
            if (pre_remains != 0 && remains == pre_remains) {
                break;
            }
            pre_remains = remains;
        }
        console.log(this.all_data);
    }

    static searchData(id) {
        var res = null;
        this.all_data.forEach(function(tmp) {
            if (tmp.id == id && tmp.valid) {
                res = tmp;
            }
        });
        return res;
    }

    constructor(jo) {
        this.json = jo;
    }

    init() {
        if (this.json["copy-from"]) {
            this.loadCopyFrom(this.json["copy-from"]);
            if (!this.copy_from) {
                return;
            }
        }
        this.valid = true;
    }

    loadCopyFrom(id) {
        var base = this.constructor.searchData(id);
        if (base && base.valid) {
            var tmp = deep_copy(base);
            for (var key in base) {
                if (typeof(this[key]) == 'undefined') {
                    this[key] = tmp[key];
                }
            }
            this.copy_from = base;
        }
    }

    static set all_data(val) {
        this._all_data = val;
    }

    static get all_data() {
        return this._all_data;
    }

    static get all_json() {
        return [];
    }

    static get all_mod_json() {
        return [];
    }

    get id() {
        return null;
    }
}