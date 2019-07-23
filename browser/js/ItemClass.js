var const_type_armor = ["ARMOR","TOOL_ARMOR"];

function deep_copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function convert_volume(volume) {
  if (typeof volume == "string") {
    var result1 = volume.match(/[0-9]+/);//因为存在"200ml"与"500 ml"
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
    { name: "phase", failsafe: "SOLID" },
	{ name: "capacity", failsafe: null },
	{ name: "calories", failsafe: 0 },
    { name: "quench", failsafe: 0 },
    { name: "fun", failsafe: 0 },
    { name: "healthy", failsafe: 0 },
    { name: "spoils_in", failsafe: null }
  ];
  var lists = [
    { name: "emits", failsafe: [] },
    { name: "material", failsafe: [], set_after_clear: true },
    { name: "flags", failsafe: [] },
    { name: "qualities", failsafe: [] },
    { name: "techniques", failsafe: [] },
	{ name: "ammo_type", failsafe: [] }
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
  this.initBookData();
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
  for (var typearmor of const_type_armor) {
  if (this.getType() == typearmor) {
    jo = this.json;
  } else if (this.json[slot_name]) {
    jo = this.json[slot_name];
  }
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
    { name: "range", failsafe: 0 },
    { name: "ranged_damage", failsafe: 0 },
    { name: "pierce", failsafe: 0 },
    { name: "dispersion", failsafe: 0 },
    { name: "sight_dispersion", failsafe: 30 },
    { name: "recoil", failsafe: 0 },
    { name: "handling", failsafe: 0 },
    { name: "durability", failsafe: false },
    { name: "burst", failsafe: null },
	{ name: "loudness", failsafe: 0 },
    { name: "clip_size", failsafe: null },
    { name: "reload", failsafe: 0 },
    { name: "reload_noise", failsafe: "click." },
    { name: "reload_noise_volume", failsafe: 0 },
    { name: "barrel_length", failsafe: 0 },
    { name: "ups_charges", failsafe: 0 },
	{ name: "magazines", failsafe: null }
  ];
  var lists = [
    { name: "built_in_mods", failsafe: [] },
    { name: "default_mods", failsafe: [] },
    { name: "ammo_effects", failsafe: [] },
    { name: "valid_mod_locations", failsafe: [], set_after_clear: true },
    { name: "modes", failsafe: [], set_after_clear: true },{ name: "ammo", failsafe: [] }
    
  ];

  var jo = null;
  if (this.getType() == "AMMO"||this.getType() == "GUN") {
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
ItemClass.prototype.getminstrength = function() {
  return this.min_strength;
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

ItemClass.prototype.getTechniques = function() {
  return this.techniques;
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
  string_html += Tr("容積") + ": " + this.getVolume() * 0.25 + " L<br>";
  string_html += Tr("重量") + ": " + this.getWeight() * 0.001 + " kg<br>";
  string_html += Tr("打撃") + ": " + this.getBashing() + " ";
   if (this.hasFlag("STAB") ||this.hasFlag("SPEAR") ) {
    string_html += Tr("刺撃") + ": " + this.getCutting() + " ";
  } 
   else {
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
if(this.getminstrength()>0){
  string_html += Tr("力の要求") + ": " + this.getminstrength() + "<br>";
}

  if (this.getType() == "COMESTIBLE") {
string_html += Tr("カロリー") + ": " + this.calories + "<br>";
string_html += Tr("水分") + ": " + this.quench + "<br>";		
string_html += Tr("心情値") + ": " + this.fun + "<br>";		
string_html += Tr("健康值") + ": " + this.healthy + "<br>";		
string_html += Tr("保存期間") + ": " + this.spoils_in + "<br>";				  
  }
       		if (this.capacity!=null){
       string_html += Tr("弾容量") + ": " + this.capacity + "<br>";			
		}
  if (this.getType() == "AMMO"||this.getType() == "MAGAZINE") {
       		if (this.ammo_type.length == 0){
       string_html += Tr("弾薬") + ": " + this.ammo_type + "<br>";			
		}
		else {
			string_html += Tr("弾薬") + ": " ;		
			for (var tempammo of this.ammo_type) {
		  if (tempammo) {		
	        var am = new AmmunitiontypeClass(tempammo);
             if (am) {
              string_html += am.getName() + ", ";
			  }
			  else  {
               string_html += am.id + ", ";
                 }
		}
		}
					string_html +=  "<br>";
		  }

  } 
  for (var q of this.getQualities()) {
    if (q) {
      if (q[0]) {
			   var s = new ToolqualityClass(q[0]);
             if (s) {
			  string_html += Tr("レベル $1 の $2 性能を有しています。", q[1], s.getName()) + "<br>";	 
              }
			  else  {
                string_html += Tr("レベル $1 の $2 性能を有しています。", q[1], Tr(q[0])) + "<br>";
                 }		  

      }
    }
  }
if(this.getTechniques().length>0){
  string_html += Tr("技術") + ": ";
  for (var t of this.getTechniques()) {
    if (t) {
      var tt = new TechniqueClass(t);
      if (tt) {
        if (tt.getName()) {
          string_html += tt.getName() + ": "+ tt.getInfo() + "; ";
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
   if (this.hasFlag("REACH3") ) {
    string_html += Tr("この武器は3マス先まで攻撃できます。") + "<br>";
  } 
   else if (this.hasFlag("REACH_ATTACK") ){
     string_html += Tr("この武器は2マス先まで攻撃できます。") + "<br>";
    } 
  if (this.isConductive()) {
    string_html += Tr("このアイテムは導電体です。") + "<br>";
  } else {
    string_html += Tr("このアイテムは絶縁体です。") + "<br>";
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
};

ItemClass.prototype.isGun = function() {
  if (this.gun_data) {
    return true;
  }
  return false;
};

ItemClass.prototype.dumpGunData = function() {
  var string_html = "";
   if (this.gun_data!=null) {
	if (this.gun_data.skill!=null) {
     var s = new SkillClass(this.gun_data.skill);
     if (s) {
       string_html += Tr("適用スキル") + ": " + s.getName() + "<br>";
        } 
		}
		
       string_html += Tr("弾容量") + ": " + this.gun_data.clip_size + "<br>";	
	   
		if (this.gun_data.ammo.length == 0){
       string_html += Tr("弾薬") + ": " + this.gun_data.ammo + "<br>";			
		}
		else {
			string_html += Tr("弾薬") + ": " ;		
			  for (var tempammo of this.gun_data.ammo) {
				      if (tempammo) {
	        var am = new AmmunitiontypeClass(tempammo);
             if (am) {
              string_html +=  am.getName() + ", ";
			  }
			  else  {
               string_html += am.id + ", ";
                 }
			  }
			  }
			string_html +=  "<br>";
		  }
	if (this.gun_data.magazines!=null){	  
    for (var mag of this.gun_data.magazines) {
		string_html += Tr("弾夹")+ ": " ;
		if (mag[1]){
			 for (var tempmag of mag[1]) {
			var tempitem = new ItemClass(tempmag);
		string_html += link_to_item(tempitem.getName(), tempitem.getId()) +  " , ";	
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
      string_html += Tr(loc[0]) + ","+loc[1]+ " ; ";
    }
    string_html += "<br>";
    string_html += Tr("MODES") + ": ";

	
    for (var mode of this.gun_data.modes) {
      string_html += mode[1] + "(" + mode[2] + Tr("発") + "), ";
    }
	if (this.gun_data.modes.length == 0) {
		if (this.gun_data.burst != null) {
		string_html += "burst" + "(" + this.gun_data.burst + Tr("発") + "), ";
	}		
	else{
		string_html += Tr("手動/半自動")+ "(1" + Tr("発")+ "), ";
	}
	}	
    string_html += "<br>";

  }
  return string_html;
};

 ItemClass.prototype.initBookData = function() {
  var slot_name = "book_data";
  this[slot_name] = null;

  var base = this.getCopyFrom();
  var variables = [
    { name: "intelligence", failsafe: 0 },
    { name: "skill", failsafe: null },
    { name: "required_level", failsafe: 0 },
    { name: "max_level", failsafe: 0 },
    { name: "fun", failsafe: 0 },
    { name: "chapters", failsafe: 1 },
    { name: "time", failsafe: 0 },
    { name: "martial_art", failsafe: null },
	{ name: "relative", failsafe: null }
  ];
  var lists = [
    
	];

  var jo = null;
  if (this.getType() == "BOOK") {
  //if (this.getType() == "BOOK"||this.getType() == "GENERIC") {
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
  //slot["time"] = convert_booktime(slot["time"]);
  this[slot_name] = slot;
};

function convert_booktime(temptime) {
	var time=temptime
  if (typeof time == "string") {
    var result1 = time.match(/[0-9]+/);
	var result2 = time.match(/[A-z]+/);
    if (result2[0].toLowerCase() == "m") {
      time = result1[0]*1;
    } else if (result2[0].toLowerCase() == "h") {
      time = result1[0] * 60;
    } else {
      time = 0;
    }
  }
  return time;
}



 ItemClass.prototype.getBookRelative = function() {
    if (this.book_data!= null) {

if(this.book_data.relative!= null){
 var temprelative=JSON.parse(JSON.stringify((this.book_data.relative)))	
   if (temprelative.intelligence== null){temprelative.intelligence=0;}
    if (temprelative.required_level== null){temprelative.required_level=0;} 
    if (temprelative.max_level== null){temprelative.max_level=0;} 
    if (temprelative.fun== null){temprelative.fun=0;} 
    if (temprelative.chapters== null){temprelative.chapters=0;}
	if (temprelative.time== null){temprelative.time=0;}
   return temprelative;
	}
	else{
	return null;	
	}
	
	}

};

ItemClass.prototype.isBook = function() {
  if (this.book_data!= null) {
    return true;
  }
  return false;
};

ItemClass.prototype.dumpBookData = function() {
  var string_html = "";
   if (this.isBook()) {
if(this.getBookRelative()==null){	   
	if (this.book_data.skill!=null) {
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
		if(this.book_data.martial_art!=null){
		string_html += Tr("武道を学ぶことができます") + ": " + this.book_data.martial_art + "<br>";
		}
		string_html += Tr("読書に必要な時間") + ": " + convert_booktime(this.book_data.time)+"m" + "<br>";
	
}
else{
	if (this.book_data.skill!=null) {
     var s = new SkillClass(this.book_data.skill);
     if (s) {
       string_html += Tr("関連スキル") + ": " + s.getName() + "<br>";
	   string_html += Tr("読むのに必要なスキル") + ": " + (this.book_data.required_level+this.getBookRelative().required_level) + "<br>";
	    string_html += Tr("訓練可能なスキルレベル") + ": " + (this.book_data.max_level+this.getBookRelative().max_level) + "<br>";
        } 
		}
		string_html += Tr("必要な知性") + ": " + (this.book_data.intelligence+this.getBookRelative().intelligence) + "<br>";	
        string_html += Tr("心情値") + ": " + (this.book_data.fun +this.getBookRelative().fun)+ "<br>";	
	    string_html += Tr("章の数") + ": " + (this.book_data.chapters+this.getBookRelative().chapters) + "<br>";
		if(this.book_data.martial_art!=null){
		string_html += Tr("武道を学ぶことができます") + ": " + this.book_data.martial_art + "<br>";
		}
		string_html += Tr("読書に必要な時間") + ": " +  (convert_booktime(this.book_data.time)+this.getBookRelative().time)+"m"+ "<br>";	
}
  }
  return string_html;
};