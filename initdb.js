const {db} = require("./database/db.js");


async function makeTable() {
    db.exec(`CREATE TABLE members
        (
            discord VARCHAR(512) PRIMARY KEY,
            minecraftname VARCHAR(512) NOT NULL,
            minecraftuuid VARCHAR(512) NOT NULL,
            guild boolean DEFAULT TRUE
        )
    `)
}

makeTable();
