var TranstateTable = {};

function Tr(id) {
  var val = [];
  var msg = id;
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      val.push(arguments[i]);
    }
  }
  if (!env_lang) {
    env_lang = "ja";
  }
  if (TranstateTable[env_lang]) {
    for (var t of TranstateTable[env_lang]) {
      if (t.id == id) {
        msg = t.msg;
        break;
      }
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
