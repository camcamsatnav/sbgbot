# sbgbot

sbgbot is a simple discordJS bot to handle basic needs in the sbg discord server

## Usage

Clone the repository

```
git clone https://github.com/camcamsatnav/sbgbot.git
```
```
cd sbgbot
```

Install dependencies

```bash
npm i
```

## Setup
### Config.json
token- discord bot token\
clientId - discord bot clientid\
guildId - discord server id\
verifiedRole - discord role id to give when verified\
guildRole - discord role id to give when a member application is accepted\
staffRole - discord role id of staff\
applicationPingRole - discord role to ping when user applies\
requirement - skyblock level requirement to apply\
wsKey - websocket key for automatic inviting to hypixel guild\
hypixelAPI - hypixel api key
### Running
make sure you have a category in the server called [Tickets]
```js
node deploy-command.js
```
```js
node initdb.js
```
```js
node main.js
```

Then run /applysetup in the channel you want people to apply from


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.
