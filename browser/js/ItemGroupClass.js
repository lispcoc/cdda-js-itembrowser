
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

function internal_get_itemgroup_from_id(key_id, num = 0) {
  for (var itemgroup of itemgroups) {
    if (itemgroup.id || itemgroup.abstract) {
      if (itemgroup.id == key_id || itemgroup.abstract == key_id) {
        if (num == 0) {
          return itemgroup;
        }
        num--;
      }
    }
  }
  return null;
}

itemgroupClass = function(itemgroup_id, nested = 0) {
  this.id = itemgroup_id;
  this.json = internal_get_itemgroup_from_id(this.id, nested);
  this.nested = nested;
  this.valid = this.json != null;
  if (this.valid) {
    this.init();
  }
};

itemgroupClass.prototype.getJson = function() {
  return this.json;
};

itemgroupClass.prototype.getId = function() {
  return this.id;
};

itemgroupClass.prototype.getType = function() {
  return this.json.type;
};

itemgroupClass.prototype.getCopyFrom = function() {
  if (this.json["copy-from"]) {
    if (this.json["copy-from"] == this.getId()) {
      return new itemgroupClass(this.json["copy-from"], this.nested + 1);
    }
    return new itemgroupClass(this.json["copy-from"], 0);
  }
  return null;
};

itemgroupClass.prototype.init = function() {
  var base = this.getCopyFrom();
  var variables = [
    { name: "magazine", failsafe: 0 },
    { name: "ammo", failsafe: 0 }
  ];
  var lists = [
    { name: "items", failsafe: [] }
  ];

  for (v of variables) {
    load_from_json(v, this, this.json, base);
  }

  for (v of lists) {
    load_list_from_json(v, this, this.json, base);
  }
  


  this.initArmorData();
  this.initGunData();
  this.initBookData();
};

itemgroupClass.prototype.getName = function() {
  return this.name;
};

itemgroupClass.prototype.getDescription = function() {
  return this.description;
};


itemgroupClass.prototype.getFlags = function() {
  return this.flags;
};

itemgroupClass.prototype.hasFlag = function(key_flag) {
  for (f of this.getFlags()) {
    if (f == key_flag) {
      return true;
    }
  }
  return false;
};


itemgroupClass.prototype.displayNameWithSymbol = function() {
  var string_html =
    "<font color=" +
    this.getSymbolColor() +
    ">" +
    this.getSymbol() +
    "</font> " +
    this.getName();

  return string_html;
};

itemgroupClass.prototype.dumpBasicData = function() {
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

itemgroupClass.prototype.getArmorData = function() {
  return this.armor_data;
};

itemgroupClass.prototype.isArmor = function() {
  if (this.getArmorData() != null) {
    return true;
  }
  return false;
};

itemgroupClass.prototype.getCovers = function() {
  var covers = [];
  if (this.isArmor()) {
    covers = this.getArmorData().covers;
  }
  return covers;
};
