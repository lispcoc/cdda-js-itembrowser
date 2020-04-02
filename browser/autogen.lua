json = require "json"
supported_lang = {"ja", "zh_CN"}

--lang_file = "../lang/mo/ja/LC_MESSAGES/cataclysm-dda.mo"
----lang_file = "../lang/mo/zh_CN/LC_MESSAGES/cataclysm-dda.mo"

local gettext = require("gettext")

types = {}

recipe_type = "recipe"
flag_type = "json_flag"
item_action_type = "item_action"
ITEM_CATEGORY_type = "ITEM_CATEGORY"
material_type = "material"
technique_type = "technique" 
skill_type = "skill"
tool_quality_type = "tool_quality"
requirement_type = "requirement"
ammunition_type = "ammunition_type"
itemgroups_type = "item_group"
mapgen_type = "mapgen"
overmap_terrain_type = "overmap_terrain"
palette_type = "palette"

item_types = {
  "AMMO",
  "GENERIC",
  "GUN",
  "ARMOR",
  "BIONIC_ITEM",
  "COMESTIBLE",
  "CONTAINER",
  "TOOL",
  "MIGRATION",
  "GUNMOD",
  "TOOLMOD",
  "TOOL_ARMOR",
  "BOOK",
  "MAGAZINE",
  "ENGINE",
  "WHEEL",
  "PET_ARMOR"
}

function is_new_type(t)
  for key, val in ipairs(types) do
    if val == t then
      return false
    end
  end
  table.insert(types, t)
  return true
end

function is_item_type(t)
  for _, val in ipairs(item_types) do
    if val == t then
      return true
    end
  end
  return false
end

function is_recipe_type(t)
  if t == recipe_type then
    return true
  end
  return false
end

function is_requirement_type(t)
  if t == requirement_type then
    return true
  end
  return false
end

function is_material_type(t)
  if t == material_type then
    return true
  end
  return false
end

function is_flag_type(t)
  if t == flag_type then
    return true
  end
  return false
end

function is_technique_type(t)
  if t == technique_type then
    return true
  end
  return false
end

function is_skill_type(t)
  if t == skill_type then
    return true
  end
  return false
end

function is_tool_quality_type(t)
  if t == tool_quality_type then
    return true
  end
  return false
end

function is_ammunition_type(t)
  if t == ammunition_type then
    return true
  end
  return false
end

function is_itemgroups_type(t)
  if t == itemgroups_type then
    return true
  end
  return false
end

function is_mapgen_type(t)
  if t == mapgen_type then
    return true
  end
  return false
end

function is_overmap_terrain_type(t)
  if t == overmap_terrain_type then
    return true
  end
  return false
end

function is_palette_type(t)
  if t == palette_type then
    return true
  end
  return false
end

function translate_table(lang_data, t)
  return t
end

local items = {}
local mod_items = {}
local recipes = {}
local mod_recipes = {}
local requirements = {}
local mod_requirements = {}
local materials = {}
local mod_materials = {}
local flags = {}
local mod_flags = {}
local techniques = {} 
local mod_techniques = {} 
local skills = {}
local mod_skills = {}
local tool_qualitys = {}
local mod_tool_qualitys = {}
local ammunition_types = {}
local mod_ammunition_types = {}
local itemgroups = {}
local mapgens = {}
local overmap_terrains = {}
local palettes = {}

local list = io.open("rsc/list.txt")
local filepath = list:read()

io.output("rsc/lang.js")
io.write("var translate_table = {};")

for key, val in pairs(supported_lang) do
  local lang_file = "../lang/mo/" .. val .."/LC_MESSAGES/cataclysm-dda.mo"

  local fd, err = io.open(lang_file, "rb")
  if not fd then
    print("Error: Language file is not found. (" .. lang_file .. ")")
    return nil, err
  end
  local raw_lang_data = fd:read("*all")
  fd:close()
  local lang_data = assert(gettext.parseData(raw_lang_data))
  io.write("translate_table[\"" .. val .. "\"] = ")
  io.write(json.encode(lang_data))
  io.write(";\n")
end

while filepath do
  local jsonfile = io.open(filepath)
  if jsonfile then
    print("Processing : " .. filepath)
    local data = json.decode(jsonfile:read("*a"))
    for key, val in pairs(data) do
      if type(val) == "table" then
        local type_val = val["type"]
        local new_val
        if is_item_type(type_val) then
          -- langage update
          new_val = translate_table(lang_data, val)
          table.insert(items, new_val)
        elseif is_recipe_type(type_val) then
          new_val = translate_table(lang_data, val)
          table.insert(recipes, new_val)
        elseif is_requirement_type(type_val) then
          new_val = translate_table(lang_data, val)
          table.insert(requirements, new_val)
        elseif is_material_type(type_val) then
          new_val = translate_table(lang_data, val)
          table.insert(materials, new_val)
        elseif is_flag_type(type_val) then
          new_val = translate_table(lang_data, val)
          table.insert(flags, new_val)
        elseif is_technique_type(type_val) then
          new_val = translate_table(lang_data, val)
          table.insert(techniques, new_val)	
        elseif is_skill_type(type_val) then
          new_val = translate_table(lang_data, val)
          table.insert(skills, new_val)
        elseif is_tool_quality_type(type_val) then
          new_val = translate_table(lang_data, val)
          table.insert(tool_qualitys, new_val)
        elseif is_ammunition_type(type_val) then
          new_val = translate_table(lang_data, val)
          table.insert(ammunition_types, new_val)
        elseif is_itemgroups_type(type_val) then
          table.insert(itemgroups, translate_table(lang_data, val)) 
        elseif is_mapgen_type(type_val) then
          table.insert(mapgens, translate_table(lang_data, val))
        elseif is_overmap_terrain_type(type_val) then
          table.insert(overmap_terrains, translate_table(lang_data, val))
        elseif is_palette_type(type_val) then
          table.insert(palettes, translate_table(lang_data, val))
        end
      end
    end
  end
  io.close(jsonfile)
  filepath = list:read()
end
io.close(list)

local valid_mod = nil
local modlist = io.open("modlist.json")
if modlist then
  valid_mod = json.decode(modlist:read("*a"))
end
io.close(modlist)
local mod_path = {}

list = io.open("rsc/list_mod.txt")
filepath = list:read()

while filepath do
  if string.match(filepath, "[\\/]modinfo.json$") then
    local jsonfile = io.open(filepath)
    if jsonfile then
      local data = json.decode(jsonfile:read("*a"))
      for _, val in pairs(data) do
        if type(val) == "table" then
          if val["type"] == "MOD_INFO" then
            mod_path[val["ident"]] = string.match(filepath, "(.+)[\\/]+modinfo.json$")
          end
        end
      end
    end
    io.close(jsonfile)
  end
  filepath = list:read()
end
io.close(list)

for _, mod_ident in pairs(valid_mod) do
  if mod_path[mod_ident] == nil then
    print("[Warning]: MOD is not found. (" .. mod_ident .. ")")
  else
    list = io.open("rsc/list_mod.txt")
    filepath = list:read()
    while filepath do
      if mod_path[mod_ident] == string.sub(filepath, 1, string.len(mod_path[mod_ident])) then
        local jsonfile = io.open(filepath)
        if jsonfile then
          print("Processing : " .. filepath)
          local data = json.decode(jsonfile:read("*a"))
          for key, val in pairs(data) do
            if type(val) == "table" then
              local type_val = val["type"]
              local new_val
              if is_item_type(type_val) then
                -- langage update
                new_val = translate_table(lang_data, val)
                table.insert(mod_items, new_val)
              elseif is_recipe_type(type_val) then
                new_val = translate_table(lang_data, val)
                table.insert(mod_recipes, new_val)
              elseif is_requirement_type(type_val) then
                new_val = translate_table(lang_data, val)
                table.insert(mod_requirements, new_val)
              elseif is_material_type(type_val) then
                new_val = translate_table(lang_data, val)
                table.insert(mod_materials, new_val)
              elseif is_flag_type(type_val) then
                new_val = translate_table(lang_data, val)
                table.insert(mod_flags, new_val)
              elseif is_technique_type(type_val) then
                new_val = translate_table(lang_data, val)
                table.insert(mod_techniques, new_val)
              elseif is_skill_type(type_val) then
                new_val = translate_table(lang_data, val)
                table.insert(mod_skills, new_val)
              elseif is_tool_quality_type(type_val) then
                new_val = translate_table(lang_data, val)
                table.insert(mod_tool_qualitys, new_val)
              elseif is_ammunition_type(type_val) then
                new_val = translate_table(lang_data, val)
                table.insert(mod_ammunition_types, new_val)		  
              end
            end
          end
        end
        io.close(jsonfile)
      end
      filepath = list:read()
    end
    io.close(list)
  end
end

io.output("rsc/data.js")

io.write("var items = ")
io.write(json.encode(items))
io.write(";\n")

io.write("var mod_items = ")
io.write(json.encode(mod_items))
io.write(";\n")

io.write("var recipes = ")
io.write(json.encode(recipes))
io.write(";\n")

io.write("var mod_recipes = ")
io.write(json.encode(mod_recipes))
io.write(";\n")

io.write("var requirements = ")
io.write(json.encode(requirements))
io.write(";\n")

io.write("var mod_requirements = ")
io.write(json.encode(mod_requirements))
io.write(";\n")

io.write("var materials = ")
io.write(json.encode(materials))
io.write(";\n")

io.write("var mod_materials = ")
io.write(json.encode(mod_materials))
io.write(";\n")

io.write("var techniques = ")
io.write(json.encode(techniques))
io.write(";\n")

io.write("var mod_techniques = ")
io.write(json.encode(mod_techniques))
io.write(";\n")

io.write("var skills = ")
io.write(json.encode(skills))
io.write(";\n")

io.write("var mod_skills = ")
io.write(json.encode(mod_skills))
io.write(";\n")	

io.write("var tool_qualitys = ")
io.write(json.encode(tool_qualitys))
io.write(";\n")

io.write("var mod_tool_qualitys = ")
io.write(json.encode(mod_tool_qualitys))
io.write(";\n")	

io.write("var ammunition_types = ")
io.write(json.encode(ammunition_types))
io.write(";\n")

io.write("var mod_ammunition_types = ")
io.write(json.encode(mod_ammunition_types))
io.write(";\n")	

io.write("var flags = ")
io.write(json.encode(flags))
io.write(";\n")

io.write("var mod_flags = ")
io.write(json.encode(mod_flags))
io.write(";\n")

io.write("var itemgroups = ")
io.write(json.encode(itemgroups))
io.write(";\n")

io.write("var mapgens = ")
io.write(json.encode(mapgens))
io.write(";\n")

io.write("var overmap_terrains = ")
io.write(json.encode(overmap_terrains))
io.write(";\n")

io.write("var palettes = ")
io.write(json.encode(palettes))
io.write(";\n")
