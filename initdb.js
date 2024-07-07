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



// db.run(`INSERT INTO members (discord, minecraftname, minecraftuuid, guild) VALUES (?, ?, ?, ?)`, ["camcamsatnav", "camcamsatnav", "6994c547f53e4107ace4a0bb48609bb5", true]);
