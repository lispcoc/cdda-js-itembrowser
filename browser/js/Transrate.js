var TranstateTable = [
  {
    id: "装備データ",
    msg: "Armor Data"
  },
  {
    id: "射撃データ",
    msg: "Ranged Data"
  },
  {
    id: "レシピ",
    msg: "Recipe"
  },
  {
    id: "レシピはありません。",
    msg: "There is no recipe."
  },
  {
    id: "適用スキル",
    msg: "Skill used"
  },
  {
    id: "必要スキル",
    msg: "Required skills"
  },
  {
    id: "完了まで",
    msg: "Time to complete"
  },
  {
    id: "分",
    msg: "minutes"
  },
  {
    id: "レベル $1 の $2 性能",
    msg: "Tool with $2 quality of $1."
  },
  {
    id: "(充填量: $1)",
    msg: "($1 charges)"
  },
  {
    id: "$1 個の $2",
    msg: "$1x $2"
  },
  {
    id: " または ",
    msg: " or "
  },
  {
    id: "難易度",
    msg: "Difficulty"
  }
];

function Tr(id) {
  var val = [];
  var msg = id;
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      val.push(arguments[i]);
    }
  }
  for (var t of TranstateTable) {
    if (t.id == id) {
      msg = t.msg;
      break;
    }
  }
  var num = 1;
  for (var v of val) {
    msg = msg.replace("$" + num, v);
    console.log(v);
    num++;
  }
  return msg;
}
