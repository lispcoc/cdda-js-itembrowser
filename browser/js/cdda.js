function get_item_from_id(key_id) {
  for (var item of items) {
    if (item["id"] || item["abstract"]) {
      if (item["id"] == key_id || item["abstract"] == key_id) {
        //perse copy-from
        if (item["copy-from"]) {
          var parent_item = get_item_from_id(item["copy-from"]);
          for (var member in parent_item) {
            // コピー先に定義がなければコピー元を参照
            if (!item[member]) {
              item[member] = parent_item[member];
            }
          }
        }
        return item;
      }
    }
  }
  return null;
}

function get_recipe_from_id(key_id) {
  for (var recipe of recipes) {
    if (recipe["result"] || recipe["abstract"]) {
      if (recipe["result"] == key_id || recipe["abstract"] == key_id) {
        //perse copy-from
        if (recipe["copy-from"]) {
          var parent_recipe = get_recipe_from_id(recipe["copy-from"]);
          for (var member in parent_recipe) {
            // コピー先に定義がなければコピー元を参照
            if (!recipe[member]) {
              recipe[member] = parent_recipe[member];
            }
          }
        }
        return recipe;
      }
    }
  }
  return null;
}

function get_requirement_from_id(key_id) {
  for (var requirement of requirements) {
    if (requirement["id"]) {
      if (requirement["id"] == key_id) {
        return requirement;
      }
    }
  }
  return null;
}

function conv_to_array(obj) {
  if (!Array.isArray(obj)) {
    var new_array = [obj];
    return new_array;
  }
  return obj;
}
