class UncraftClass extends RecipeClass {
    static get all_json() {
        return uncrafts.concat(super.all_json);
    }

    static get all_mod_json() {
        return mod_uncrafts.concat(super.all_mod_json);
    }

    init() {
        super.init();

        if (this.json.type == "recipe" && !this.reversible) {
            this.valid = false;
        }
    }

    static searchDataFromComponent(cmp_key) {
        var list = {};
        var retval = [];
        console.log(cmp_key);
        this.all_data.forEach(function(tmp) {
            if (tmp.valid) {
                tmp.getComponents().forEach(function(cmp_list) {
                    for (var cmp of cmp_list) {
                        if (cmp[0] == cmp_key) {
                            list[tmp.id] = tmp;
                            return;
                        }
                        // 解体レシピは複数材料の候補がある場合は1番目だけ参照する
                        return;
                    }
                })
            }
        });
        for (var key in list) {
            retval.push(list[key]);
        }
        return retval;
    }

}