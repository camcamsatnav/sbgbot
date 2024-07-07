const sqlite3 = require('sqlite3')

// you would have to import / invoke this in another file
let db = new sqlite3.Database('./database/members.db', (err) => {
        if (err) {
          console.error(err.message);
        }
      });

function getMemberByDiscord(discord) {
    return new Promise((resolve) => {
        db.get(`SELECT * FROM members WHERE discord = '${discord}'`, (err, row) => {
            resolve(row);
        })
    })
}

function addMember(discord, minecraftname, minecraftuuid, guild) {
    return new Promise(async (resolve) => {
        const update = await getMemberByDiscord(discord)
        if (update) {
            db.run(`UPDATE members SET minecraftname = ?, minecraftuuid = ?, guild = ? WHERE discord = ?`, [minecraftname, minecraftuuid, guild, discord], (err) => {
                resolve(err);
            });
        } else {
            db.run(`INSERT INTO members (discord, minecraftname, minecraftuuid, guild) VALUES (?, ?, ?, ?)`, [discord, minecraftname, minecraftuuid, guild], (err) => {
                resolve(err);
            });   
        }
    })
}

function getGuildMembers() {
    return new Promise((resolve) => {
        const temp = [];
        db.each(`SELECT * FROM members WHERE guild = 1`, (err, row) => {
            temp.push(row);
        })
        resolve(temp);
    })
}

function printall() {
    db.each(`SELECT * FROM members`, (err, row) => {
        console.log(row);
    })
}


module.exports = {db, getMemberByDiscord, addMember, printall, getGuildMembers}