var const_type_armor = ["ARMOR", "TOOL_ARMOR"];

var all_item_data = [];

function deep_copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function convert_weight(weight) {
    if (typeof weight == "string") {
        var result1 = parseInt(weight.match(/[0-9]+/));
        var result2 = weight.match(/[A-z]+/);
        if (result2[0].toLowerCase() == "kg") {
            weight = result1 * 1000;
        } else if (result2[0].toLowerCase() == "g") {
            weight = result1;
        } else {
            weight = 0;
        }
    }
    return weight;
}

function convert_volume(volume) {
    if (typeof volume == "string") {
        var result1 = parseInt(volume.match(/[0-9]+/)); //因为存在"200ml"与"500 ml"
        var result2 = volume.match(/[A-z]+/);
        if (result2[0].toLowerCase() == "l") {
            volume = result1 * 4;
        } else if (result2[0].toLowerCase() == "ml") {
            volume = result1 / 250;
        } else {
            volume = 0;
        }
    }
    return volume;
}

function isString(obj) {
    return typeof(obj) == "string" || obj instanceof String;
}

class ItemClass extends GenericClass {
    static get all_json() {
        return items;
    }

    static get all_mod_json() {
        return mod_items;
    }

    get id() {
        if (this.json.id) {
            return this.json.id;
        } else if (this.json.abstract) {
            return this.json.abstract;
        }
        return null;
    }

    init() {
        super.init();

        if (this.valid) {
            this.loadBasicData(this.json);
            this.loadAmmoData(this.json);
            this.loadArmorData(this.json);
            this.loadGunData(this.json);
            this.loadBookData(this.json);

            this.search_cache = {};
        }
    }

    loadSlot(jo, slot, set_after_clear = []) {
        for (var key in jo) {
            var val = jo[key];
            if (Array.isArray(slot[key])) {
                if (!Array.isArray(val)) {
                    val = [val];
                }
                if (set_after_clear.indexOf(key) >= 0) {
                    slot[key] = val;
                } else {
                    Array.prototype.push.apply(slot[key], val);
                }
            } else {
                slot[key] = val;
            }
        }
    }

    applyRelativeSetting(jo, slot) {
        if (jo["proportional"]) {
            for (var key in jo["proportional"]) {
                slot[key] = slot[key] * jo["proportional"][key];
            }
        }
    }

    loadBasicData(jo) {
        var variables = {
            category: "",
            weight: 0,
            volume: 0,
            price: 0,
            price_postapoc: 0,
            stackable: false,
            integral_volume: 0,
            bashing: 0,
            cutting: 0,
            to_hit: 0,
            container: 0,
            rigid: false,
            min_strength: 0,
            min_dexterity: 0,
            min_intelligence: 0,
            min_perception: 0,
            magazine_well: 0,
            explode_in_fire: 0,
            name: "No name",
            description: "",
            symbol: "",
            color: "white",
            phase: "SOLID",
            capacity: null,
            calories: 0,
            quench: 0,
            fun: 0,
            healthy: 0,
            spoils_in: null,
            emits: [],
            material: [],
            flags: [],
            qualities: [],
            techniques: [],
            ammo_type: [],
            __dummy: 0
        };
        if (!this.basic_data) {
            this.basic_data = variables;
        }
        this.loadSlot(jo, this.basic_data, ["material"]);
        this.basic_data.weight = convert_weight(this.basic_data.weight);
        this.basic_data.volume = convert_volume(this.basic_data.volume);
        this.applyRelativeSetting(jo, this.basic_data);
    }

    loadArmorData(jo) {
        if (this.getType() == "ARMOR" || this.getType() == "TOOL_ARMOR") {
            jo = this.json;
        } else if (this.json["armor_data"]) {
            jo = this.json["armor_data"];
        } else {
            return;
        }

        var variables = {
            encumbrance: 0,
            coverage: 0,
            material_thickness: 0,
            environmental_protection: 0,
            environmental_protection_with_filter: 0,
            warmth: 0,
            storage: 0,
            power_armor: false,
            covers: [],
            __dummy: 0
        };
        if (!this.armor_data) {
            this.armor_data = variables;
        }
        this.loadSlot(jo, this.armor_data, []);
        this.armor_data.storage = convert_volume(this.armor_data.storage);
        this.applyRelativeSetting(jo, this.basic_data);
    }

    loadAmmoData(jo) {
        if (this.getType() == "AMMO") {
            jo = this.json;
        } else if (this.json["ammo_data"]) {
            jo = this.json["ammo_data"];
        } else {
            return;
        }

        var variables = {
            ammo_type: "",
            casing: "",
            drop: "",
            drop_chance: 0.0,
            drop_active: true,
            damage: 0,
            pierce: 0,
            range: 0,
            dispersion: 0,
            recoil: 0,
            count: 1,
            loudness: 0,
            effects: [],
            prop_damage: 0.0,
            show_stats: true,
            __dummy: 0
        };
        if (!this.ammo_data) {
            this.ammo_data = variables;
        }
        this.loadSlot(jo, this.ammo_data, []);
        this.applyRelativeSetting(jo, this.ammo_data);
    }

    loadGunData(jo) {
        if (this.getType() == "GUN") {
            jo = this.json;
        } else if (this.json["gun_data"]) {
            jo = this.json["gun_data"];
        } else {
            return;
        }

        var variables = {
            skill: null,
            range: 0,
            ranged_damage: 0,
            pierce: 0,
            dispersion: 0,
            sight_dispersion: 30,
            recoil: 0,
            handling: 0,
            durability: true,
            burst: null,
            loudness: 0,
            clip_size: null,
            reload: 0,
            reload_noise: "click.",
            reload_noise_volume: 0,
            barrel_length: 0,
            ups_charges: 0,
            magazines: null,
            built_in_mods: [],
            default_mods: [],
            ammo_effects: [],
            valid_mod_locations: [],
            modes: [],
            ammo: [],
            __dummy: 0
        };
        if (!this.gun_data) {
            this.gun_data = variables;
        }
        this.loadSlot(jo, this.gun_data, ["valid_mod_locations", "modes"]);
        this.applyRelativeSetting(jo, this.gun_data);
    }

    loadBookData(jo) {
        if (this.getType() == "BOOK") {
            jo = this.json;
        } else if (this.json["book_data"]) {
            jo = this.json["book_data"];
        } else {
            return;
        }

        var variables = {
            intelligence: 0,
            skill: null,
            required_level: 0,
            max_level: 0,
            fun: 30,
            chapters: 1,
            time: 0,
            martial_art: null,
            relative: null,
            __dummy: 0
        };
        if (!this.book_data) {
            this.book_data = variables;
        }
        this.loadSlot(jo, this.book_data, ["valid_mod_locations", "modes"]);
        this.applyRelativeSetting(jo, this.book_data);
    }

    getJson() {
        return this.json;
    }

    getType() {
        return this.json.type;
    }

    get type() {
        return this.json.type;
    }

    get name() {
        if (!isString(this.basic_data.name)) {
            return __(this.basic_data.name.str);
        }
        return __(this.basic_data.name);
    }

    getDescription() {
        return __(this.basic_data.description);
    }

    getSymbol() {
        return this.basic_data.symbol;
    }

    getSymbolColor() {
        return this.basic_data.color;
    }

    getMinStrength() {
        return this.basic_data.min_strength;
    }

    getVolume() {
        return this.basic_data.volume;
    }

    getWeight() {
        return this.basic_data.weight;
    }

    get bashing() {
        return this.basic_data.bashing;
    }

    get cutting() {
        return this.basic_data.cutting;
    }

    get to_hit() {
        return this.basic_data.to_hit;
    }

    getMaterial() {
        return this.basic_data.material;
    }

    get qualities() {
        return this.basic_data.qualities;
    }

    getAtkCost() {
        return Math.floor(65 + 4 * this.getVolume() + this.getWeight() / 60);
    }

    getMaterialInstance() {
        if (!this.material_instance) {
            this.material_instance = [];
            var tmp_materials = this.getMaterial();
            for (var mat_id of tmp_materials) {
                this.material_instance.push(MaterialClass.searchData(mat_id));
            }
        }
        return this.material_instance;
    }

    getTechniques() {
        return this.basic_data.techniques;
    }

    getFlags() {
        return this.basic_data.flags;
    }

    get ammo_type() {
        return this.basic_data.ammo_type;
    }

    hasFlag(key_flag) {
        for (var f of this.getFlags()) {
            if (f == key_flag) {
                return true;
            }
        }
        return false;
    }

    isConductive() {
        if (this.hasFlag("CONDUCTIVE")) {
            return true;
        }
        if (this.hasFlag("NONCONDUCTIVE")) {
            return false;
        }
        for (var m of this.getMaterialInstance()) {
            if (m.elec_resist <= 1) {
                return true;
            }
        }
        return false;
    }

    displayNameWithSymbol() {
        var string_html =
            "<font color=" +
            this.getSymbolColor() +
            ">" +
            this.getSymbol() +
            "</font> " +
            this.name;
        return string_html;
    }

    dumpBasicData() {
        var string_html = "";
        string_html += "<h2>" + this.displayNameWithSymbol() + "</h2>";
        string_html += "<p>";
        string_html += "id: " + this.id + "<br>";
        string_html += Tr("容積") + ": " + this.getVolume() * 0.25 + " L<br>";
        string_html += Tr("重量") + ": " + this.getWeight() * 0.001 + " kg<br>";
        string_html += Tr("打撃") + ": " + this.bashing + " ";
        if (this.hasFlag("STAB") || this.hasFlag("SPEAR")) {
            string_html += Tr("刺撃") + ": " + this.cutting + " ";
        } else {
            string_html += Tr("斬撃") + ": " + this.cutting + " ";
        }
        string_html += Tr("命中ボーナス") + ": " + this.to_hit + "<br>";
        string_html += Tr("攻撃コスト") + ": " + this.getAtkCost() + "<br>";

        string_html += Tr("素材") + ": ";
        for (var mat of this.getMaterialInstance()) {
            string_html += mat.name + ", ";
        }
        string_html += "<br>";
        if (this.getMinStrength() > 0) {
            string_html += Tr("力の要求") + ": " + this.getMinStrength() + "<br>";
        }

        if (this.getType() == "COMESTIBLE") {
            string_html += Tr("カロリー") + ": " + this.basic_data.calories + "<br>";
            string_html += Tr("水分") + ": " + this.basic_data.quench + "<br>";
            string_html += Tr("心情値") + ": " + this.basic_data.fun + "<br>";
            string_html += Tr("健康值") + ": " + this.basic_data.healthy + "<br>";
            string_html += Tr("保存期間") + ": " + this.basic_data.spoils_in + "<br>";
        }
        if (this.capacity != null) {
            string_html += Tr("弾容量") + ": " + this.capacity + "<br>";
        }
        if (this.getType() == "AMMO" || this.getType() == "MAGAZINE") {
            if (this.ammo_type.length == 0) {
                string_html += Tr("弾薬") + ": " + this.ammo_type + "<br>";
            } else {
                string_html += Tr("弾薬") + ": ";
                for (var tempammo of this.ammo_type) {
                    if (tempammo) {
                        var am = new AmmunitiontypeClass(tempammo);
                        if (am) {
                            string_html += am.getName() + ", ";
                        } else {
                            string_html += am.id + ", ";
                        }
                    }
                }
                string_html += "<br>";
            }

        }
        for (var q of this.qualities) {
            if (q[0]) {
                var s = ToolqualityClass.searchData(q[0]);
                if (s) {
                    string_html += Tr("レベル $1 の $2 性能を有しています。", q[1], s.name) + "<br>";
                } else {
                    string_html += Tr("レベル $1 の $2 性能を有しています。", q[1], Tr(q[0])) + "<br>";
                }
            }
        }
        if (this.getTechniques().length > 0) {
            string_html += Tr("技術") + ": ";
            for (var t of this.getTechniques()) {
                var tmp = TechniqueClass.searchData(t);
                string_html += tmp.name + ": " + tmp.info + "; ";
            }
            string_html += "<br>";
        }
        string_html += "Flags: ";
        for (var flag_id of this.getFlags()) {
            if (flag_id) {
                string_html += flag_id + ", ";
            }
        }
        string_html += "<br>";

        for (var flag_id of this.getFlags()) {
            var flag = JsonFlagClass.searchData(flag_id);
            if (flag) {
                if (flag.info) {
                    string_html += flag.info + "<br>";
                }
            }
        }
        if (this.hasFlag("REACH3")) {
            string_html += Tr("この武器は3マス先まで攻撃できます。") + "<br>";
        } else if (this.hasFlag("REACH_ATTACK")) {
            string_html += Tr("この武器は2マス先まで攻撃できます。") + "<br>";
        }
        if (this.isConductive()) {
            string_html += Tr("このアイテムは導電体です。") + "<br>";
        } else {
            string_html += Tr("このアイテムは絶縁体です。") + "<br>";
        }

        return string_html;
    }

    getArmorData(key = null, def = 0) {
        if (key == null) {
            return def;
        } else {
            if (this.isArmor()) {
                var res = this.armor_data[key];
                if (res != null) {
                    return res;
                }
            }
            return def;
        }
    }

    isArmor() {
        return this.armor_data ? true : false;
    }

    getCovers() {
        return this.getArmorData("covers", []);
    }

    getStorage() {
        return this.getArmorData("storage", 0);
    }

    getEncumbrance() {
        return this.getArmorData("encumbrance", 0);
    }

    getWarmth() {
        return this.getArmorData("warmth", 0);
    }

    getCoverage() {
        return this.getArmorData("coverage", 0);
    }

    getEnvironmentalProtection() {
        return this.getArmorData("environmental_protection", 0);
    }

    getMaterialThickness() {
        return this.getArmorData("material_thickness", 0);
    }

    getBashResist() {
        var bash_resist = 0;
        if (this.isArmor()) {
            for (var m of this.getMaterialInstance()) {
                bash_resist += m.bash_resist;
            }
            bash_resist /= this.getMaterialInstance().length;
            bash_resist *= this.getMaterialThickness();
            bash_resist = Math.round(bash_resist);
        }
        return bash_resist;
    }

    getCutResist() {
        var cut_resist = 0;
        if (this.isArmor()) {
            for (var m of this.getMaterialInstance()) {
                cut_resist += m.cut_resist;
            }
            cut_resist /= this.getMaterialInstance().length;
            cut_resist *= this.getMaterialThickness();
            cut_resist = Math.round(cut_resist);
        }
        return cut_resist;
    }

    getAcidResist() {
        var acid_resist = 0;
        if (this.isArmor()) {
            for (var m of this.getMaterialInstance()) {
                acid_resist += m.acid_resist;
            }
            acid_resist /= this.getMaterialInstance().length;
            if (this.getEnvironmentalProtection() < 10) {
                acid_resist *= this.getEnvironmentalProtection();
                acid_resist /= 10;
            }
            acid_resist = Math.round(acid_resist);
        }
        return acid_resist;
    }

    getFireResist() {
        var fire_resist = 0;
        if (this.isArmor()) {
            for (var m of this.getMaterialInstance()) {
                fire_resist += m.fire_resist;
            }
            fire_resist /= this.getMaterialInstance().length;
            if (this.getEnvironmentalProtection() < 10) {
                fire_resist *= this.getEnvironmentalProtection();
                fire_resist /= 10;
            }
            fire_resist = Math.round(fire_resist);
            return fire_resist;
        }
        return fire_resist;
    }

    dumpArmorData() {
        var string_html = "";
        if (this.isArmor()) {
            string_html += Tr("着用部位") + ": ";
            for (var part of this.getCovers()) {
                string_html += part + ", ";
            }
            string_html += "<br>";
            string_html += Tr("収納") + ": " + this.getStorage() * 0.25 + " L<br>";
            string_html += Tr("動作制限") + ": " + this.getEncumbrance() + " ";
            string_html += Tr("暖かさ") + ": " + this.getWarmth() + " ";
            string_html += Tr("被覆率") + ": " + this.getCoverage() + " %<br>";
            string_html += Tr("打撃防御") + ": " + this.getBashResist() + " ";
            string_html += Tr("斬撃防御") + ": " + this.getCutResist() + " <br>";
            string_html += Tr("耐酸防御") + ": " + this.getAcidResist() + " ";
            string_html += Tr("耐火防御") + ": " + this.getFireResist() + " <br>";
            string_html += Tr("環境防護") + ": " + this.getEnvironmentalProtection() + "<br>";
        }
        return string_html;
    }

    isGun() {
        return this.gun_data ? true : false;
    }

    dumpGunData() {
        var string_html = "";
        if (this.isGun()) {
            var skill = this.gun_data.skill;
            var ammo = this.gun_data.ammo;
            if (skill != null) {
                var s = SkillClass.searchData(skill);
                if (s) {
                    string_html += Tr("適用スキル") + ": " + s.name + "<br>";
                }
            }

            string_html += Tr("弾容量") + ": " + this.gun_data.clip_size + "<br>";

            if (ammo.length == 0) {
                string_html += Tr("弾薬") + ": " + ammo + "<br>";
            } else {
                string_html += Tr("弾薬") + ": ";
                for (var tmp of ammo) {
                    if (tmp) {
                        var am = new AmmunitiontypeClass(tmp);
                        if (am) {
                            string_html += am.getName() + ", ";
                        } else {
                            string_html += am.id + ", ";
                        }
                    }
                }
                string_html += "<br>";
            }
            if (this.gun_data.magazines != null) {
                for (var mag of this.gun_data.magazines) {
                    string_html += Tr("弾夹") + ": ";
                    if (mag[1]) {
                        for (var tempmag of mag[1]) {
                            var tempitem = ItemClass.searchData(tempmag);
                            string_html += link_to_item(tempitem.name, tempitem.id) + " , ";
                        }
                    }

                }
                string_html += "<br>";
            }

            string_html += Tr("射程距離") + ": " + this.gun_data.range + "<br>";
            string_html += Tr("ダメージ") + ": ";
            if (typeof this.gun_data.ranged_damage != "object") {
                string_html += this.gun_data.ranged_damage;
            } else {
                string_html +=
                    this.gun_data.ranged_damage.damage_type +
                    "(" +
                    this.gun_data.ranged_damage.amount +
                    ")";
            }
            string_html += "<br>";
            string_html += Tr("貫通力") + ": " + this.gun_data.pierce + "<br>";
            string_html += Tr("分散率") + ": " + this.gun_data.dispersion + "<br>";
            string_html += Tr("照準分散") + ": " + this.gun_data.sight_dispersion + "<br>";
            string_html += Tr("反動") + ": " + this.gun_data.recoil + "<br>";
            string_html += Tr("操作性") + ": " + this.gun_data.handling + "<br>";
            string_html += Tr("耐久") + ": " + this.gun_data.durability + "<br>";
            string_html += Tr("発砲音") + ": " + this.gun_data.loudness + "<br>";
            string_html += Tr("リロード時間") + ": " + this.gun_data.reload + "<br>";
            string_html += Tr("リロード音") + ": " + this.gun_data.reload_noise_volume + "<br>";
            string_html += Tr("銃身の長さ") + ": " + this.gun_data.barrel_length + "<br>";
            string_html += Tr("消費電力") + ": " + this.gun_data.ups_charges + "<br>";
            string_html += Tr("MOD") + ": ";
            for (var loc of this.gun_data.valid_mod_locations) {
                string_html += Tr(loc[0]) + "," + loc[1] + " ; ";
            }
            string_html += "<br>";
            string_html += Tr("MODES") + ": ";


            for (var mode of this.gun_data.modes) {
                string_html += mode[1] + "(" + mode[2] + Tr("発") + "), ";
            }
            if (this.gun_data.modes.length == 0) {
                if (this.gun_data.burst != null) {
                    string_html += "burst" + "(" + this.gun_data.burst + Tr("発") + "), ";
                } else {
                    string_html += Tr("手動/半自動") + "(1" + Tr("発") + "), ";
                }
            }
            string_html += "<br>";

        }
        return string_html;
    }

    getBookRelative() {
        if (this.book_data != null) {
            if (this.book_data.relative != null) {
                var temprelative = JSON.parse(JSON.stringify((this.book_data.relative)))
                if (temprelative.intelligence == null) {
                    temprelative.intelligence = 0;
                }
                if (temprelative.required_level == null) {
                    temprelative.required_level = 0;
                }
                if (temprelative.max_level == null) {
                    temprelative.max_level = 0;
                }
                if (temprelative.fun == null) {
                    temprelative.fun = 0;
                }
                if (temprelative.chapters == null) {
                    temprelative.chapters = 0;
                }
                if (temprelative.time == null) {
                    temprelative.time = 0;
                }
                return temprelative;
            } else {
                return null;
            }
        }
    }

    isBook() {
        return this.book_data ? true : false;
    }

    dumpBookData() {
        var string_html = "";
        if (this.isBook()) {
            if (this.getBookRelative() == null) {
                if (this.book_data.skill != null) {
                    var s = SkillClass.searchData(this.book_data.skill);
                    if (s) {
                        string_html += Tr("関連スキル") + ": " + s.name + "<br>";
                        string_html += Tr("読むのに必要なスキル") + ": " + this.book_data.required_level + "<br>";
                        string_html += Tr("訓練可能なスキルレベル") + ": " + this.book_data.max_level + "<br>";
                    }
                }
                string_html += Tr("必要な知性") + ": " + this.book_data.intelligence + "<br>";
                string_html += Tr("心情値") + ": " + this.book_data.fun + "<br>";
                string_html += Tr("章の数") + ": " + this.book_data.chapters + "<br>";
                if (this.book_data.martial_art != null) {
                    string_html += Tr("武道を学ぶことができます") + ": " + this.book_data.martial_art + "<br>";
                }
                string_html += Tr("読書に必要な時間") + ": " + this.book_data.time + "<br>";

            } else {
                if (this.book_data.skill != null) {
                    var s = SkillClass.searchData(this.book_data.skill);
                    if (s) {
                        string_html += Tr("関連スキル") + ": " + s.name + "<br>";
                        string_html += Tr("読むのに必要なスキル") + ": " + (this.book_data.required_level + this.getBookRelative().required_level) + "<br>";
                        string_html += Tr("訓練可能なスキルレベル") + ": " + (this.book_data.max_level + this.getBookRelative().max_level) + "<br>";
                    }
                }
                string_html += Tr("必要な知性") + ": " + (this.book_data.intelligence + this.getBookRelative().intelligence) + "<br>";
                string_html += Tr("心情値") + ": " + (this.book_data.fun + this.getBookRelative().fun) + "<br>";
                string_html += Tr("章の数") + ": " + (this.book_data.chapters + this.getBookRelative().chapters) + "<br>";
                if (this.book_data.martial_art != null) {
                    string_html += Tr("武道を学ぶことができます") + ": " + this.book_data.martial_art + "<br>";
                }
                string_html += Tr("読書に必要な時間") + ": " + (convert_booktime(this.book_data.time) + this.getBookRelative().time) + "m" + "<br>";
            }
        }
        return string_html;
    }

    //
    // Search related functions
    //
    stringQualities() {
        if (isDefined(this.search_cache.str_qualities)) {
            return this.search_cache.str_qualities;
        }
        var res = '';
        for (var q of this.qualities) {
            if (q[0]) {
                var s = ToolqualityClass.searchData(q[0]);
                if (s) {
                    res += s.name;
                } else {
                    res += __(q[0]);
                }
            }
        }
        this.search_cache.str_qualities = res;
        return res;
    }

    stringComponents() {
        if (isDefined(this.search_cache.str_components)) {
            return this.search_cache.str_components;
        }
        var res = '';
        var cmp_names = {};
        for (const r of RecipeClass.all_data) {
            if (r.result == this.id) {
                const cmps = r.getComponents();
                for (const c1 of cmps) {
                    for (const c2 of c1) {
                        const it = ItemClass.searchData(c2[0]);
                        cmp_names[it.name] = 1;
                    }
                }
            }
        }
        for (const name in cmp_names) {
            res += name;
        }
        this.search_cache.str_components = res;
        return res;
    }

    stringUsedSkill() {
        if (isDefined(this.search_cache.str_used_skill)) {
            return this.search_cache.str_used_skill;
        }
        var res = '';
        var cmp_names = {};
        for (const r of RecipeClass.all_data) {
            if (r.result == this.id) {
                const s = SkillClass.searchData(r.getSkillUsed());
                if (s) {
                    cmp_names[s.name] = 1;
                }
            }
        }
        for (const name in cmp_names) {
            res += name;
        }
        this.search_cache.str_used_skill = res;
        return res;
    }

    stringReqSkill() {
        if (isDefined(this.search_cache.str_req_skill)) {
            return this.search_cache.str_req_skill;
        }
        var res = '';
        var cmp_names = {};
        for (const r of RecipeClass.all_data) {
            if (r.result == this.id) {
                for (const req of r.getSkillsRequired()) {
                    const s = SkillClass.searchData(req[0]);
                    if (s) {
                        cmp_names[s.name] = 1;
                    }
                }
            }
        }
        for (const name in cmp_names) {
            res += name;
        }
        this.search_cache.str_req_skill = res;
        return res;
    }

    stringReqQuality() {
        if (isDefined(this.search_cache.str_req_quality)) {
            return this.search_cache.str_req_quality;
        }
        var res = '';
        var names = {};
        for (const r of RecipeClass.all_data) {
            if (r.result == this.id) {
                for (const req of r.getQualities()) {
                    const t = ToolqualityClass.searchData(req.id);
                    if (t) {
                        names[t.name] = 1;
                    }
                }
            }
        }
        for (const name in names) {
            res += name;
        }
        this.search_cache.str_req_quality = res;
        return res;
    }

    stringReqTool() {
        if (isDefined(this.search_cache.str_req_tool)) {
            return this.search_cache.str_req_tool;
        }
        var res = '';
        var names = {};
        for (const r of RecipeClass.all_data) {
            if (r.result == this.id) {
                for (const req_set of r.getTools()) {
                    for (const req of req_set) {
                        const t = ItemClass.searchData(req[0]);
                        if (t) {
                            names[t.name] = 1;
                        }
                    }
                }
            }
        }
        for (const name in names) {
            res += name;
        }
        this.search_cache.str_req_tool = res;
        return res;
    }
}