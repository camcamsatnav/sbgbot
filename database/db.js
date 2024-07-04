const {FSDB} = require("file-system-db");
const db = new FSDB("./database/members.json", false);

if (!db.has("players")) {
    db.set("players", []);
}

function getMembers() {
    return db;
}

module.exports = {getMembers}