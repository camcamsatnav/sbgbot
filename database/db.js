const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./database/members.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

/**
 * Get member by discord
 * @param {string} discord
 * @returns {Object} {discord: string, minecraftname: string, minecraftuuid: string, guild: boolean}
 */
function getMemberByDiscord(discord) {
    return new Promise((resolve) => {
        db.get(`SELECT * FROM members WHERE discord = '${discord}'`, (err, row) => {
            resolve(row);
        });
    });
}

/**
 * Get member by UUID
 * @param {string} uuid
 * @returns {Object} {discord: string, minecraftname: string, minecraftuuid: string, guild: boolean
 */
function getMemberByUUID(uuid) {
    return new Promise((resolve) => {
        db.get(`SELECT * FROM members WHERE minecraftuuid = '${uuid}'`, (err, row) => {
            resolve(row);
        });
    });
}

/**
 * Add member to database
 * @param {string} discord
 * @param {string} minecraftname
 * @param {string} minecraftuuid
 * @param {boolean} guild
 * @returns {Error} if error
 */
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
    });
}

/**
 * Get all guild members
 * @returns {Object[]} {discord: string, minecraftname: string, minecraftuuid: string, guild: boolean}
 */
function getGuildMembers() {
    return new Promise((resolve) => {
        db.all(`SELECT * FROM members WHERE guild = 1`, (err, row) => {
            resolve(row)
        });
    });
}

/**
 * Change a member to guild member
 * @param {string} discord
 * @returns {Error} if error
 */
function addGuildMember(discord) {
    return new Promise(async (resolve) => {
        const verified = await getMemberByDiscord(discord);
        if (!verified) {
            resolve("User not verified");
        } else {
            db.run(`UPDATE members SET guild = 1 WHERE discord = ?`, [discord], (err) => {
                resolve(err);
            });
        }
    });
}

/**
 * Change a member to not guild member
 * @param {string} discord
 * @returns {Error} if error
 */
function removeGuildMember(discord) {
    return new Promise(async (resolve) => {
        const verified = await getMemberByDiscord(discord);
        if (!verified) {
            resolve("User not verified");
        } else {
            db.run(`UPDATE members SET guild = 0 WHERE discord = ?`, [discord], (err) => {
                resolve(err);
            });
        }
    });
}

/**
 * Print all members
 */
function printall() {
    db.each(`SELECT * FROM members`, (err, row) => {
        console.log(row);
    });
}


module.exports = {
    db,
    getMemberByDiscord,
    addMember,
    printall,
    getGuildMembers,
    removeGuildMember,
    addGuildMember,
    getMemberByUUID
};