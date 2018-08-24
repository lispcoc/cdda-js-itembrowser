var const_type_armor = "ARMOR";

function deep_copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function convert_volume(volume) {
  if (typeof volume == "string") {
    var result = volume.match(/(\d+)(\w+)/);
    if (result[2].toLowerCase() == "l") {
      volume = result[1] * 4;
    } else if (result[2].toLowerCase() == "ml") {
      volume = result[1] / 250;
    } else {
      volume = 0;
    }
  }
  return volume;
}

function load_from_json(data, slot, jo, base_slot) {
  slot[data.name] = data.failsafe;
  if (base_slot) {
    slot[data.name] = base_slot[data.name];
  }
  if (jo[v.name]) {
    slot[data.name] = jo[data.name];
  }
}

function load_list_from_json(data, slot, jo, base_slot) {
  slot[data.name] = data.failsafe;
  if (base_slot) {
    slot[data.name] = base_slot[data.name];
  }
  if (jo[data.name]) {
    if (data.set_after_clear) {
      slot[data.name] = data.failsafe;
    }
    var tmp = jo[data.name];
    if (!Array.isArray(tmp)) {
      tmp = [tmp];
    }
    Array.prototype.push.apply(slot[data.name], tmp);
  }
}

function internal_get_item_from_id(key_id, num = 0) {
  for (var item of mod_items) {
    if (item.id || item.abstract) {
      if (item.id == key_id || item.abstract == key_id) {
        if (num == 0) {
          return item;
        }
        num--;
      }
    }
  }
  for (var item of items) {
    if (item.id || item.abstract) {
      if (item.id == key_id || item.abstract == key_id) {
        if (num == 0) {
          return item;
        }
        num--;
      }
    }
  }
  return null;
}

ItemClass = function(item_id, nested = 0) {
  this.id = item_id;
  this.json = internal_get_item_from_id(this.id, nested);
  this.nested = nested;
  this.valid = this.json != null;
  if (this.valid) {
    this.init();
  }
};

ItemClass.prototype.getJson = function() {
  return this.json;
};

ItemClass.prototype.getId = function() {
  return this.id;
};

ItemClass.prototype.getType = function() {
  return this.json.type;
};

ItemClass.prototype.getCopyFrom = function() {
  if (this.json["copy-from"]) {
    if (this.json["copy-from"] == this.getId()) {
      return new ItemClass(this.json["copy-from"], this.nested + 1);
    }
    return new ItemClass(this.json["copy-from"], 0);
  }
  return null;
};

ItemClass.prototype.init = function() {
  var base = this.getCopyFrom();
  var variables = [
    { name: "category", failsafe: "" },
    { name: "weight", failsafe: 0 },
    { name: "volume", failsafe: 0 },
    { name: "price", failsafe: 0 },
    { name: "price_postapoc", failsafe: 0 },
    { name: "stackable", failsafe: false },
    { name: "integral_volume", failsafe: 0 },
    { name: "bashing", failsafe: 0 },
    { name: "cutting", failsafe: 0 },
    { name: "to_hit", failsafe: 0 },
    { name: "container", failsafe: "" },
    { name: "rigid", failsafe: false },
    { name: "min_strength", failsafe: 0 },
    { name: "min_dexterity", failsafe: 0 },
    { name: "min_intelligence", failsafe: 0 },
    { name: "min_perception", failsafe: 0 },
    { name: "magazine_well", failsafe: 0 },
    { name: "explode_in_fire", failsafe: false },
    { name: "name", failsafe: "No name" },
    { name: "description", failsafe: "" },
    { name: "symbol", failsafe: "" },
    { name: "color", failsafe: "white" },
    { name: "phase", failsafe: "SOLID" }
  ];
  var lists = [
    { name: "emits", failsafe: [] },
    { name: "material", failsafe: [], set_after_clear: true },
    { name: "flags", failsafe: [] },
    { name: "qualities", failsafe: [] },
    { name: "techniques", failsafe: [] }
  ];

  for (v of variables) {
    load_from_json(v, this, this.json, base);
  }

  for (v of lists) {
    load_list_from_json(v, this, this.json, base);
  }

  this["volume"] = convert_volume(this["volume"]);

  this.initArmorData();
  this.initGunData();
};

ItemClass.prototype.initArmorData = function() {
  var slot_name = "armor_data";
  this[slot_name] = null;

  var base = this.getCopyFrom();
  var variables = [
    { name: "encumbrance", failsafe: 0 },
    { name: "coverage", failsafe: 0 },
    { name: "material_thickness", failsafe: 0 },
    { name: "environmental_protection", failsafe: 0 },
    { name: "environmental_protection_with_filter", failsafe: 0 },
    { name: "warmth", failsafe: 0 },
    { name: "storage", failsafe: 0 },
    { name: "power_armor", failsafe: false }
  ];
  var lists = [{ name: "covers", failsafe: [] }];

  var jo = null;
  if (this.getType() == const_type_armor) {
    jo = this.json;
  } else if (this.json[slot_name]) {
    jo = this.json[slot_name];
  }
  if (jo == null) {
    return;
  }

  var slot = {};
  var base_slot = base ? base[slot_name] : null;

  for (v of variables) {
    load_from_json(v, slot, jo, base_slot);
  }

  for (v of lists) {
    load_list_from_json(v, slot, jo, base_slot);
  }

  slot["storage"] = convert_volume(slot["storage"]);

  this[slot_name] = slot;
};

ItemClass.prototype.initGunData = function() {
  var slot_name = "gun_data";
  this[slot_name] = null;

  var base = this.getCopyFrom();
  var variables = [
    { name: "skill", failsafe: null },
    { name: "ammo", failsafe: null },
    { name: "range", failsafe: 0 },
    { name: "ranged_damage", failsafe: 0 },
    { name: "pierce", failsafe: 0 },
    { name: "dispersion", failsafe: 0 },
    { name: "sight_dispersion", failsafe: 30 },
    { name: "recoil", failsafe: 0 },
    { name: "handling", failsafe: 0 },
    { name: "durability", failsafe: false },
    { name: "burst", failsafe: false },
    { name: "loudness", failsafe: 0 },
    { name: "clip_size", failsafe: 0 },
    { name: "reload", failsafe: 0 },
    { name: "reload_noise", failsafe: "click." },
    { name: "reload_noise_volume", failsafe: 0 },
    { name: "barrel_length", failsafe: 0 },
    { name: "ups_charges", failsafe: 0 }
  ];
  var lists = [
    { name: "built_in_mods", failsafe: [] },
    { name: "default_mods", failsafe: [] },
    { name: "ammo_effects", failsafe: [] },
    { name: "valid_mod_locations", failsafe: [], set_after_clear: true },
    { name: "modes", failsafe: [], set_after_clear: true }
  ];

  var jo = null;
  if (this.getType() == "GUN") {
    jo = this.json;
  } else if (this.json[slot_name]) {
    jo = this.json[slot_name];
  }
  if (jo == null) {
    return;
  }

  var slot = {};
  var base_slot = base ? base[slot_name] : null;

  for (v of variables) {
    load_from_json(v, slot, jo, base_slot);
  }

  for (v of lists) {
    load_list_from_json(v, slot, jo, base_slot);
  }

  this[slot_name] = slot;
};

ItemClass.prototype.getName = function() {
  return this.name;
};

ItemClass.prototype.getDescription = function() {
  return this.description;
};

ItemClass.prototype.getSymbol = function() {
  return this.symbol;
};

ItemClass.prototype.getSymbolColor = function() {
  // todo: 背景色に対応する
  return this.color;
};

ItemClass.prototype.getVolume = function() {
  return this.volume;
};

ItemClass.prototype.getWeight = function() {
  return this.weight;
};

ItemClass.prototype.getBashing = function() {
  return this.bashing;
};

ItemClass.prototype.getCutting = function() {
  return this.cutting;
};

ItemClass.prototype.getToHit = function() {
  return this.to_hit;
};

ItemClass.prototype.getMaterial = function() {
  return this.material;
};

ItemClass.prototype.getQualities = function() {
  return this.qualities;
};

ItemClass.prototype.getAtkCost = function() {
  return Math.floor(65 + 4 * this.getVolume() + this.getWeight() / 60);
};

ItemClass.prototype.getMaterialInstance = function() {
  if (!this.material_instance) {
    this.material_instance = [];
    var tmp_materials = this.getMaterial();
    for (mat_id of tmp_materials) {
      this.material_instance.push(new MaterialClass(mat_id));
    }
  }
  return this.material_instance;
};

ItemClass.prototype.getFlags = function() {
  return this.flags;
};

ItemClass.prototype.hasFlag = function(key_flag) {
  for (f of this.getFlags()) {
    if (f == key_flag) {
      return true;
    }
  }
  return false;
};

ItemClass.prototype.isConductive = function() {
  if (this.hasFlag("CONDUCTIVE")) {
    return true;
  }
  if (this.hasFlag("NONCONDUCTIVE")) {
    return false;
  }
  for (m of this.getMaterialInstance()) {
    if (m.getElecResist() <= 1) {
      return true;
    }
  }
  return false;
};

ItemClass.prototype.displayNameWithSymbol = function() {
  var string_html =
    "<font color=" +
    this.getSymbolColor() +
    ">" +
    this.getSymbol() +
    "</font> " +
    this.getName();

  return string_html;
};

ItemClass.prototype.dumpBasicData = function() {
  var string_html = "";
  string_html += "<h2>" + this.displayNameWithSymbol() + "</h3>";
  string_html += "<p>";
  string_html += "id: " + this.getId() + "<br>";
  string_html += "容積: " + this.getVolume() * 0.25 + " L<br>";
  string_html += "重量: " + this.getWeight() * 0.001 + " kg<br>";
  string_html += "打撃: " + this.getBashing() + " ";
  string_html += "斬撃: " + this.getCutting() + " ";
  string_html += "命中ボーナス: " + this.getToHit() + "<br>";
  string_html += "攻撃コスト: " + this.getAtkCost() + "<br>";

  string_html += "素材: ";
  for (var mat of this.getMaterialInstance()) {
    if (mat) {
      string_html += mat.getName() + ", ";
    }
  }
  string_html += "<br>";

  for (var q of this.getQualities()) {
    if (q) {
      if (q[0]) {
        string_html += "レベル " + q[1] + " の " + q[0] + " 性能<br>";
      }
    }
  }

  string_html += "技術: ";
  for (var t of this.techniques) {
    if (t) {
      string_html += t + ", ";
    }
  }
  string_html += "<br>";

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
  if (this.isConductive()) {
    string_html += "このアイテムは導電体です。<br>";
  } else {
    string_html += "このアイテムは絶縁体です。<br>";
  }

  return string_html;
};

ItemClass.prototype.getArmorData = function() {
  return this.armor_data;
};

ItemClass.prototype.isArmor = function() {
  if (this.getArmorData() != null) {
    return true;
  }
  return false;
};

ItemClass.prototype.getCovers = function() {
  var covers = [];
  if (this.isArmor()) {
    covers = this.getArmorData().covers;
  }
  return covers;
};

ItemClass.prototype.getStorage = function() {
  var storage = 0;
  if (this.isArmor()) {
    storage = this.getArmorData().storage;
  }
  return storage;
};

ItemClass.prototype.getEncumbrance = function() {
  var encumbrance = 0;
  if (this.isArmor()) {
    encumbrance = this.getArmorData().encumbrance;
  }
  return encumbrance;
};

ItemClass.prototype.getWarmth = function() {
  var warmth = 0;
  if (this.isArmor()) {
    var warmth = this.getArmorData().warmth;
  }
  return warmth;
};

ItemClass.prototype.getCoverage = function() {
  var coverage = 0;
  if (this.isArmor()) {
    coverage = this.getArmorData().coverage;
  }
  return coverage;
};

ItemClass.prototype.getEnvironmentalProtection = function() {
  var environmental_protection = 0;
  if (this.isArmor()) {
    environmental_protection = this.getArmorData().environmental_protection;
  }
  return environmental_protection;
};

ItemClass.prototype.getMaterialThickness = function() {
  var material_thickness = 0;
  if (this.isArmor()) {
    material_thickness = this.getArmorData().material_thickness;
  }
  return material_thickness;
};

ItemClass.prototype.getBashResist = function() {
  var bash_resist = 0;
  if (this.isArmor()) {
    for (m of this.getMaterialInstance()) {
      bash_resist += m.getBashResist();
    }
    bash_resist /= this.getMaterialInstance().length;
    bash_resist *= this.getMaterialThickness();
    bash_resist = Math.round(bash_resist);
  }
  return bash_resist;
};

ItemClass.prototype.getCutResist = function() {
  var cut_resist = 0;
  if (this.isArmor()) {
    for (m of this.getMaterialInstance()) {
      cut_resist += m.getCutResist();
    }
    cut_resist /= this.getMaterialInstance().length;
    cut_resist *= this.getMaterialThickness();
    cut_resist = Math.round(cut_resist);
  }
  return cut_resist;
};

ItemClass.prototype.getAcidResist = function() {
  var acid_resist = 0;
  if (this.isArmor()) {
    for (m of this.getMaterialInstance()) {
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
};

ItemClass.prototype.getFireResist = function() {
  var fire_resist = 0;
  if (this.isArmor()) {
    for (m of this.getMaterialInstance()) {
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
};

ItemClass.prototype.dumpArmorData = function() {
  var string_html = "";
  if (this.isArmor()) {
    string_html += "着用部位: ";
    for (var part of this.getCovers()) {
      string_html += part + ", ";
    }
    string_html += "<br>";
    string_html += "収納: " + this.getStorage() * 0.25 + " L<br>";
    string_html += "動作制限: " + this.getEncumbrance() + " ";
    string_html += "暖かさ: " + this.getWarmth() + " ";
    string_html += "被覆率: " + this.getCoverage() + " %<br>";
    string_html += "打撃防御: " + this.getBashResist() + " ";
    string_html += "斬撃防御: " + this.getCutResist() + " <br>";
    string_html += "耐酸防御: " + this.getAcidResist() + " ";
    string_html += "耐火防御: " + this.getFireResist() + " <br>";
    string_html += "環境防護: " + this.getEnvironmentalProtection() + "<br>";
  }
  return string_html;
};

ItemClass.prototype.isGun = function() {
  if (this.gun_data) {
    return true;
  }
  return false;
};

ItemClass.prototype.dumpGunData = function() {
  var string_html = "";
  if (this.gun_data) {
    string_html += "適用スキル: " + this.gun_data.skill + "<br>";
    string_html += "弾薬: " + this.gun_data.ammo + "<br>";
    string_html += "射程距離: " + this.gun_data.range + "<br>";
    string_html += "ダメージ: ";
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
    string_html += "貫通力: " + this.gun_data.pierce + "<br>";
    string_html += "分散率: " + this.gun_data.dispersion + "<br>";
    string_html += "照準分散: " + this.gun_data.sight_dispersion + "<br>";
    string_html += "反動: " + this.gun_data.recoil + "<br>";
    string_html += "操作性: " + this.gun_data.handling + "<br>";
    string_html += "耐久: " + this.gun_data.durability + "<br>";
    string_html += "発砲音: " + this.gun_data.loudness + "<br>";
    string_html += "リロード時間: " + this.gun_data.reload + "<br>";
    string_html += "リロード音: " + this.gun_data.reload_noise_volume + "<br>";
    string_html += "銃身の長さ: " + this.gun_data.barrel_length + "<br>";
    string_html += "消費電力: " + this.gun_data.ups_charges + "<br>";
    string_html += "MOD: ";
    for (var loc of this.gun_data.valid_mod_locations) {
      string_html += loc + ", ";
    }
    string_html += "<br>";
    string_html += "MODES: ";
    for (var mode of this.gun_data.modes) {
      string_html += mode[1] + "(" + mode[2] + "発), ";
    }
    string_html += "<br>";
  }
  return string_html;
};
