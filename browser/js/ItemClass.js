var const_type_armor = ["ARMOR", "TOOL_ARMOR"];

var all_item_data = [];

function deep_copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function convert_weight(weight) {
    if (typeof weight == "string") {
        var result1 = weight.match(/[0-9]+/);
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
        var result1 = volume.match(/[0-9]+/); //因为存在"200ml"与"500 ml"
        var result2 = volume.match(/[A-z]+/);
        if (result2[0].toLowerCase() == "l") {
            volume = result1[0] * 4;
        } else if (result2[0].toLowerCase() == "ml") {
            volume = result1[0] / 250;
        } else {
            volume = 0;
        }
    }
    return volume;
}

function isString(obj) {
    return typeof(obj) == "string" || obj instanceof String;
}

class ItemSlot {
    constructor() {}
    setVariable(name, val, set_after_clear = false) {
        if (Array.isArray(this[name])) {
            if (set_after_clear) {
                this[name] = val;
            } else {
                if (!Array.isArray(val)) {
                    val = [val];
                }
                Array.prototype.push.apply(this[name], val);
            }
        } else {
            this[name] = val;
        }
    }
    getVariable(name) {
        if (this[name]) {
            return this[name];
        } else {
            return null;
        }
    }
}

class ItemClass {
    static initAllItemData() {
        for (var item of items) {
            var it = new ItemClass(item);
            it.init();
            it.is_mod_item = false;
        }
        for (var item of mod_items) {
            var it = new ItemClass(item);
            it.init();
            it.is_mod_item = true;
        }
    }

    static searchItemData(id) {
        var res = null;
        all_item_data.forEach(function(it) {
            if (it.item_id == id) {
                res = it;
            }
        });
        return res;
    }

    static allItemData() {
        return all_item_data;
    }

    constructor(jo) {
        this.json = jo;
        this.basic_data = null;
        if (jo["copy-from"]) {
            this.loadCopyFrom(jo["copy-from"]);
        }

        if (jo.id) {
            this.item_id = jo.id;
        } else if (jo.abstract) {
            this.item_id = jo.abstract;
        } else {
            this.item_id = null;
            return;
        }
        all_item_data.push(this);
    }

    init() {
        var jo = this.json;
        this.load_basic_data(jo);
        this.loadArmorData(jo);
        this.loadGunData(jo);
        this.loadBookData(jo);
    }

    setSlotVal(slot, name, val, set_after_clear = false) {
        if (Array.isArray(slot[name])) {
            if (!Array.isArray(val)) {
                val = [val];
            }
            if (set_after_clear) {
                slot[name] = val;
            } else {
                Array.prototype.push.apply(slot[name], val);
            }
        } else {
            slot[name] = val;
        }
    }

    get valid() {
        if (this.item_id == null) {
            return false;
        } else {
            return true;
        }
    }

    loadCopyFrom(id) {
        var base = ItemClass.searchItemData(id);
        if (base) {
            var tmp = deep_copy(base);
            this.basic_data = tmp.basic_data;
            if (tmp.armor_data) {
                this.armor_data = tmp.armor_data;
            }
            if (tmp.gun_data) {
                this.gun_data = tmp.gun_data;
            }
            if (tmp.book_data) {
                this.book_data = tmp.book_data;
            }
            this.copy_from = base;
        }
    }

    load_basic_data(jo) {
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
        for (var key in variables) {
            if (jo[key]) {
                if (key == "material") {
                    this.setSlotVal(this.basic_data, key, jo[key], true);
                } else {
                    this.setSlotVal(this.basic_data, key, jo[key]);
                }
            }
        }

        this.basic_data.weight = convert_weight(this.basic_data.weight);
        this.basic_data.volume = convert_volume(this.basic_data.volume);
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
        for (var key in variables) {
            if (jo[key]) {
                if (key == "valid_mod_locations" || key == "modes") {
                    this.setSlotVal(this.armor_data, key, jo[key], true);
                } else {
                    this.setSlotVal(this.armor_data, key, jo[key]);
                }
            }
        }
        this.armor_data.storage = convert_volume(this.armor_data.storage);
    }

    loadGunData(jo) {
        if (this.getType() == "AMMO" || this.getType() == "GUN") {
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
        for (var key in variables) {
            if (jo[key]) {
                if (key == "valid_mod_locations" || key == "modes") {
                    this.setSlotVal(this.gun_data, key, jo[key], true);
                } else {
                    this.setSlotVal(this.gun_data, key, jo[key]);
                }
            }
        }
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
        for (var key in variables) {
            if (jo[key]) {
                if (key == "valid_mod_locations" || key == "modes") {
                    this.setSlotVal(this.book_data, key, jo[key], true);
                } else {
                    this.setSlotVal(this.book_data, key, jo[key]);
                }
            }
        }
    }

    getJson() {
        return this.json;
    }

    get id() {
        return this.item_id;
    }

    getType() {
        return this.json.type;
    }

    get name() {
        if (!isString(this.basic_data.name)) {
            return this.basic_data.name.str;
        }
        return this.basic_data.name;
    }

    getDescription() {
        return this.basic_data.description;
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

    getBashing() {
        return this.basic_data.bashing;
    }

    getCutting() {
        return this.basic_data.cutting;
    }

    getToHit() {
        return this.basic_data.to_hit;
    }

    getMaterial() {
        return this.basic_data.material;
    }

    getQualities() {
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
                this.material_instance.push(new MaterialClass(mat_id));
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
        this.getFlags().forEach(function(f) {
            if (f == key_flag) {
                return true;
            }
        });
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
            if (m.getElecResist() <= 1) {
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
        string_html += "<h2>" + this.displayNameWithSymbol() + "</h3>";
        string_html += "<p>";
        string_html += "id: " + this.id + "<br>";
        string_html += Tr("容積") + ": " + this.getVolume() * 0.25 + " L<br>";
        string_html += Tr("重量") + ": " + this.getWeight() * 0.001 + " kg<br>";
        string_html += Tr("打撃") + ": " + this.getBashing() + " ";
        if (this.hasFlag("STAB") || this.hasFlag("SPEAR")) {
            string_html += Tr("刺撃") + ": " + this.getCutting() + " ";
        } else {
            string_html += Tr("斬撃") + ": " + this.getCutting() + " ";
        }
        string_html += Tr("命中ボーナス") + ": " + this.getToHit() + "<br>";
        string_html += Tr("攻撃コスト") + ": " + this.getAtkCost() + "<br>";

        string_html += Tr("素材") + ": ";
        for (var mat of this.getMaterialInstance()) {
            if (mat) {
                string_html += mat.getName() + ", ";
            }
        }
        string_html += "<br>";
        if (this.getMinStrength() > 0) {
            string_html += Tr("力の要求") + ": " + this.getMinStrength() + "<br>";
        }

        if (this.getType() == "COMESTIBLE") {
            string_html += Tr("カロリー") + ": " + this.calories + "<br>";
            string_html += Tr("水分") + ": " + this.quench + "<br>";
            string_html += Tr("心情値") + ": " + this.fun + "<br>";
            string_html += Tr("健康值") + ": " + this.healthy + "<br>";
            string_html += Tr("保存期間") + ": " + this.spoils_in + "<br>";
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
        for (var q of this.getQualities()) {
            if (q) {
                if (q[0]) {
                    var s = new ToolqualityClass(q[0]);
                    if (s) {
                        string_html += Tr("レベル $1 の $2 性能を有しています。", q[1], s.getName()) + "<br>";
                    } else {
                        string_html += Tr("レベル $1 の $2 性能を有しています。", q[1], Tr(q[0])) + "<br>";
                    }

                }
            }
        }
        if (this.getTechniques().length > 0) {
            string_html += Tr("技術") + ": ";
            for (var t of this.getTechniques()) {
                if (t) {
                    var tt = new TechniqueClass(t);
                    if (tt) {
                        if (tt.getName()) {
                            string_html += tt.getName() + ": " + tt.getInfo() + "; ";
                        }
                    }
                }
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
            if (flag_id) {
                var flag = new JsonFlagClass(flag_id);
                if (flag) {
                    if (flag.getInfo()) {
                        string_html += flag.getInfo() + "<br>";
                    }
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
                console.log("isarmor");
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
                bash_resist += m.getBashResist();
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
                cut_resist += m.getCutResist();
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
                acid_resist += m.getAcidResist();
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
                fire_resist += m.getFireResist();
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
                var s = new SkillClass(skill);
                if (s) {
                    string_html += Tr("適用スキル") + ": " + s.getName() + "<br>";
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
                            var tempitem = ItemClass.searchItemData(tempmag);
                            string_html += link_to_item(tempitem.getName(), tempitem.getId()) + " , ";
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
                    var s = new SkillClass(this.book_data.skill);
                    if (s) {
                        string_html += Tr("関連スキル") + ": " + s.getName() + "<br>";
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
                string_html += Tr("読書に必要な時間") + ": " + convert_booktime(this.book_data.time) + "m" + "<br>";

            } else {
                if (this.book_data.skill != null) {
                    var s = new SkillClass(this.book_data.skill);
                    if (s) {
                        string_html += Tr("関連スキル") + ": " + s.getName() + "<br>";
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
}