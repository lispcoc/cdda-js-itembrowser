var const_type_armor = 'ARMOR';

function internal_get_item_from_id (key_id, num = 0) {
  for (var item of mod_items) {
    if (item.id || item.abstract) {
      if (item.id == key_id || item.abstract == key_id) {
        if(num == 0){
          return item;
        }
        num--;
      }
    }
  }
  for (var item of items) {
    if (item.id || item.abstract) {
      if (item.id == key_id || item.abstract == key_id) {
        if(num == 0){
          return item;
        }
        num--;
      }
    }
  }
  return null;
}

ItemClass = function (item_id, nested = 0) {
  this.id = item_id;
  this.json = internal_get_item_from_id (this.id, nested);
  this.nested = nested;
};

ItemClass.prototype.getJson = function () {
  return this.json;
};

ItemClass.prototype.getId = function () {
  return this.id;
};

ItemClass.prototype.getType = function () {
  return this.json.type;
};

ItemClass.prototype.getCopyFrom = function () {
  if (this.json['copy-from']) {
    if (this.json['copy-from'] == this.getId ()) {
      return new ItemClass (this.json['copy-from'], this.nested + 1);
    }
    return new ItemClass (this.json['copy-from']);
  }
  return null;
};

ItemClass.prototype.getName = function () {
  if (!this.name) {
    var copy_from = this.getCopyFrom();
    if (this.json.name) {
      this.name = this.json.name;
    } else if (copy_from) {
      this.name = copy_from.getName ();
    } else {
      this.name = 'No name';
    }
  }
  return this.name;
};

ItemClass.prototype.getDescription = function () {
  if (!this.description) {
    var copy_from = this.getCopyFrom();
    if (this.json.description) {
      this.description = this.json.description;
    } else if (copy_from) {
      this.description = copy_from.getDescription ();
    } else {
      this.description = 'No description.';
    }
  }
  return this.description;
};

ItemClass.prototype.getSymbol = function () {
  if (!this.symbol) {
    var copy_from = this.getCopyFrom();
    if (this.json.symbol) {
      this.symbol = this.json.symbol;
    } else if (copy_from) {
      this.symbol = copy_from.getSymbol ();
    } else {
      this.symbol = ' ';
    }
  }
  return this.symbol;
};

ItemClass.prototype.getSymbolColor = function () {
  // todo: 背景色に対応する
  if (!this.color) {
    var copy_from = this.getCopyFrom();
    if (this.json.color) {
      this.color = this.json.color;
    } else if (copy_from) {
      this.color = copy_from.getSymbolColor ();
    } else {
      this.color = 'white';
    }
  }
  return this.color;
};

ItemClass.prototype.getVolume = function () {
  if (!this.volume) {
    var copy_from = this.getCopyFrom();
    if (this.json.volume) {
      this.volume = this.json.volume;
    } else if (copy_from) {
      this.volume = copy_from.getVolume ();
    } else {
      this.volume = 0;
    }
  }
  // Convert to int
  if (typeof this.volume == 'string') {
    var result = this.volume.match (/(\d+)(\w)/);
    console.log (result);
    if (result[2] == 'L') {
      this.volume = Math.floor (result[1] * 4);
    } else if (result[2] == 'mL') {
      this.volume = Math.floor (result[1] / 250);
    } else {
      this.volume = 0;
    }
  }
  return this.volume;
};

ItemClass.prototype.getWeight = function () {
  if (!this.weight) {
    var copy_from = this.getCopyFrom();
    if (this.json.weight) {
      this.weight = this.json.weight;
    } else if (copy_from) {
      this.weight = copy_from.getWeight ();
    } else {
      this.weight = 0;
    }
  }
  return this.weight;
};

ItemClass.prototype.getBashing = function () {
  if (!this.bashing) {
    var copy_from = this.getCopyFrom();
    if (this.json.bashing) {
      this.bashing = this.json.bashing;
    } else if (copy_from) {
      this.bashing = copy_from.getBashing ();
    } else {
      this.bashing = 0;
    }
  }
  return this.bashing;
};

ItemClass.prototype.getCutting = function () {
  if (!this.cutting) {
    var copy_from = this.getCopyFrom();
    if (this.json.cutting) {
      this.cutting = this.json.cutting;
    } else if (copy_from) {
      this.cutting = copy_from.getCutting ();
    } else {
      this.cutting = 0;
    }
  }
  return this.cutting;
};

ItemClass.prototype.getToHit = function () {
  if (!this.to_hit) {
    var copy_from = this.getCopyFrom();
    if (this.json.to_hit) {
      this.to_hit = this.json.to_hit;
    } else if (copy_from) {
      this.to_hit = copy_from.getToHit ();
    } else {
      this.to_hit = 0;
    }
  }
  return this.to_hit;
};

ItemClass.prototype.getAtkCost = function () {
  return Math.floor (65 + 4 * this.getVolume () + this.getWeight () / 60);
};

ItemClass.prototype.getMaterialId = function () {
  if (!this.material_id) {
    var copy_from = this.getCopyFrom();
    this.material_id = [];
    if (this.json.material) {
      this.material_id = this.json.material;
    } else if (copy_from) {
      this.material_id = copy_from.getMaterialId ();
    } else {
      this.material_id = [];
    }
    if (!Array.isArray (this.material_id)) {
      this.material_id = [this.material_id];
    }
  }
  return this.material_id;
};

ItemClass.prototype.getMaterial = function () {
  if (!this.material) {
    this.material = [];
    var tmp_materials = this.getMaterialId ();
    for (mat_id of tmp_materials) {
      this.material.push (new MaterialClass (mat_id));
    }
  }
  return this.material;
};

ItemClass.prototype.getQualities = function () {
  if (!this.qualities) {
    var copy_from = this.getCopyFrom();
    if (this.json.qualities) {
      this.qualities = this.json.qualities;
    } else if (copy_from) {
      this.qualities = copy_from.getQualities ();
    } else {
      this.qualities = [[]];
    }
  }
  if (!Array.isArray (this.qualities[0])) {
    this.qualities = [this.qualities];
  }
  return this.qualities;
};

ItemClass.prototype.getFlags = function () {
  if (!this.flags) {
    var copy_from = this.getCopyFrom();
    if (this.json.flags) {
      this.flags = this.json.flags;
    } else if (copy_from) {
      this.flags = copy_from.getFlags ();
    } else {
      this.flags = [];
    }
  }
  if (!Array.isArray (this.flags)) {
    this.flags = [this.flags];
  }
  return this.flags;
};

ItemClass.prototype.hasFlag = function (key_flag) {
  for (f of this.getFlags ()) {
    if (f == key_flag) {
      return true;
    }
  }
  return false;
};

//
// ARMOR
//

ItemClass.prototype.getArmorDataJson = function () {
  var copy_from = this.getCopyFrom();
  if (this.getType () == const_type_armor) {
    return this.json;
  } else if (this.json.armor_data) {
    return this.json.armor_data;
  } else if (copy_from) {
    return copy_from.getArmorDataJson ();
  }
  return null;
};

ItemClass.prototype.isArmor = function () {
  if (this.getArmorDataJson () != null) {
    return true;
  }
  return false;
};

ItemClass.prototype.getCovers = function () {
  this.covers = [];
  if (this.isArmor ()) {
    var copy_from = this.getCopyFrom();
    var armor_data = this.getArmorDataJson ();
    if (armor_data.covers) {
      this.covers = armor_data.covers;
    } else if (copy_from) {
      return copy_from.getCovers ();
    }
  }
  return this.covers;
};

ItemClass.prototype.getStorage = function () {
  this.storage = 0;
  if (this.isArmor ()) {
    var copy_from = this.getCopyFrom();
    var armor_data = this.getArmorDataJson ();
    if (armor_data.storage) {
      this.storage = armor_data.storage;
    } else if (copy_from) {
      return copy_from.getStorage ();
    }
  }
  return this.storage;
};

ItemClass.prototype.getEncumbrance = function () {
  this.encumbrance = 0;
  if (this.isArmor ()) {
    var copy_from = this.getCopyFrom();
    var armor_data = this.getArmorDataJson ();
    if (armor_data.encumbrance) {
      this.encumbrance = armor_data.encumbrance;
    } else if (copy_from) {
      return copy_from.getEncumbrance ();
    }
  }
  return this.encumbrance;
};

ItemClass.prototype.getWarmth = function () {
  this.warmth = 0;
  if (this.isArmor ()) {
    var copy_from = this.getCopyFrom();
    var armor_data = this.getArmorDataJson ();
    if (armor_data.warmth) {
      this.warmth = armor_data.warmth;
    } else if (copy_from) {
      return copy_from.getWarmth ();
    }
  }
  return this.warmth;
};

ItemClass.prototype.getCoverage = function () {
  this.coverage = 0;
  if (this.isArmor ()) {
    var copy_from = this.getCopyFrom();
    var armor_data = this.getArmorDataJson ();
    if (armor_data.coverage) {
      this.coverage = armor_data.coverage;
    } else if (copy_from) {
      return copy_from.getCoverage ();
    }
  }
  return this.coverage;
};

ItemClass.prototype.getEnvironmentalProtection = function () {
  this.environmental_protection = 0;
  if (this.isArmor ()) {
    var copy_from = this.getCopyFrom();
    var armor_data = this.getArmorDataJson ();
    if (armor_data.environmental_protection) {
      this.environmental_protection = armor_data.environmental_protection;
    } else if (copy_from) {
      return copy_from.getEnvironmentalProtection ();
    }
  }
  return this.environmental_protection;
};

ItemClass.prototype.getMaterialThickness = function () {
  this.material_thickness = 0;
  if (this.isArmor ()) {
    var copy_from = this.getCopyFrom();
    var armor_data = this.getArmorDataJson ();
    if (armor_data.material_thickness) {
      this.material_thickness = armor_data.material_thickness;
    } else if (copy_from) {
      return copy_from.getMaterialThickness ();
    }
  }
  return this.material_thickness;
};

ItemClass.prototype.getBashResist = function () {
  this.bash_resist = 0;
  if (this.isArmor ()) {
    for (m of this.getMaterial ()) {
      this.bash_resist += m.getBashResist ();
    }
    this.bash_resist /= this.getMaterial ().length;
    this.bash_resist *= this.getMaterialThickness ();
    this.bash_resist = Math.round (this.bash_resist);
  }
  return this.bash_resist;
};

ItemClass.prototype.getCutResist = function () {
  this.cut_resist = 0;
  if (this.isArmor ()) {
    for (m of this.getMaterial ()) {
      this.cut_resist += m.getCutResist ();
    }
    this.cut_resist /= this.getMaterial ().length;
    this.cut_resist *= this.getMaterialThickness ();
    this.cut_resist = Math.round (this.cut_resist);
  }
  return this.cut_resist;
};

ItemClass.prototype.getAcidResist = function () {
  this.acid_resist = 0;
  if (this.isArmor ()) {
    for (m of this.getMaterial ()) {
      this.acid_resist += m.getAcidResist ();
    }
    this.acid_resist /= this.getMaterial ().length;
    if (this.getEnvironmentalProtection () < 10) {
      this.acid_resist *= this.getEnvironmentalProtection ();
      this.acid_resist /= 10;
    }
    this.acid_resist = Math.round (this.acid_resist);
  }
  return this.acid_resist;
};

ItemClass.prototype.getFireResist = function () {
  this.fire_resist = 0;
  if (this.isArmor ()) {
    for (m of this.getMaterial ()) {
      this.fire_resist += m.getFireResist ();
    }
    this.fire_resist /= this.getMaterial ().length;
    if (this.getEnvironmentalProtection () < 10) {
      this.fire_resist *= this.getEnvironmentalProtection ();
      this.fire_resist /= 10;
    }
    this.fire_resist = Math.round (this.fire_resist);
  }
  return this.fire_resist;
};

ItemClass.prototype.isConductive = function () {
  if (this.hasFlag ('CONDUCTIVE')) {
    return true;
  }
  if (this.hasFlag ('NONCONDUCTIVE')) {
    return false;
  }
  for (m of this.getMaterial ()) {
    if (m.getElecResist () <= 1) {
      return true;
    }
  }
  return false;
};

ItemClass.prototype.dumpBasicData = function () {
  var string_html = '';
  string_html +=
    '<h2><font color=' +
    this.getSymbolColor () +
    '>' +
    this.getSymbol () +
    '</font> ' +
    this.getName () +
    '</h3>';
  string_html += '<p>';
  string_html += 'id: ' + this.getId () + '<br>';
  string_html += '容積: ' + this.getVolume () * 0.25 + ' L<br>';
  string_html += '重量: ' + this.getWeight () * 0.001 + ' kg<br>';
  string_html += '打撃: ' + this.getBashing () + ' ';
  string_html += '斬撃: ' + this.getCutting () + ' ';
  string_html += '命中ボーナス: ' + this.getToHit () + '<br>';
  string_html += '攻撃コスト: ' + this.getAtkCost () + '<br>';

  string_html += '素材: ';
  for (var mat of this.getMaterial ()) {
    if (mat) {
      string_html += mat.getName () + ', ';
    }
  }
  string_html += '<br>';

  for (var q of this.getQualities ()) {
    if (q) {
      if (q[0]) {
        string_html += 'レベル ' + q[1] + ' の ' + q[0] + ' 性能<br>';
      }
    }
  }

  string_html += 'Flags: ';
  for (var flag_id of this.getFlags ()) {
    if (flag_id) {
      string_html += flag_id + ', ';
    }
  }
  string_html += '<br>';

  for (var flag_id of this.getFlags ()) {
    if (flag_id) {
      var flag = new JsonFlagClass (flag_id);
      if (flag) {
        if (flag.getInfo ()) {
          string_html += flag.getInfo () + '<br>';
        }
      }
    }
  }
  if (this.isConductive ()) {
    string_html += 'このアイテムは導電体です。<br>';
  } else {
    string_html += 'このアイテムは絶縁体です。<br>';
  }

  return string_html;
};

ItemClass.prototype.dumpArmorData = function () {
  var string_html = '';
  if (this.isArmor ()) {
    string_html += '着用部位: ';
    for (var part of this.getCovers ()) {
      string_html += part + ', ';
    }
    string_html += '<br>';
    string_html += '収納: ' + this.getStorage () * 0.25 + ' L<br>';
    string_html += '動作制限: ' + this.getEncumbrance () + ' ';
    string_html += '暖かさ: ' + this.getWarmth () + ' ';
    string_html += '被覆率: ' + this.getCoverage () + ' %<br>';
    string_html += '打撃防御: ' + this.getBashResist () + ' ';
    string_html += '斬撃防御: ' + this.getCutResist () + ' <br>';
    string_html += '耐酸防御: ' + this.getAcidResist () + ' ';
    string_html += '耐火防御: ' + this.getFireResist () + ' <br>';
    string_html += '環境防護: ' + this.getEnvironmentalProtection () + '<br>';
  }
  return string_html;
};
