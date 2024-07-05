const {FSDB} = require("file-system-db");
const db = new FSDB("./database/members.json", false);

//makes the player array if not run before
if (!db.has("players")) {
    db.set("players", []);
}

function getMembers() {
    return db;
}

module.exports = {getMembers}