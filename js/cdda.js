function deep_copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function isDefined(obj) {
    return !(typeof obj === "undefined");
}