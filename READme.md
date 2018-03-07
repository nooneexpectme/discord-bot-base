# Discord Bot Base
DiscordBotBase is an unofficial framework written in TypeScript for [discord.js](https://github.com/discordjs/discord.js), it allow you to create a discord's bot with the minimum of lines.

I have never used another framework, so i'm writing this one only with my ideas and "what i think useful".

## Example
```js
const QueenDecim = require("@tanuki/discord-bot-base");

const Client = new QueenDecim.Core({
    token: null,
    owner: null,
    trigger: null
});

Client.logIn().then(() => {
    console.log("I'm ready yuh!");
})
```

## Features
- [x] Startup and global options
- [x] Register simple commands (from files only)
- [x] Error handling
- [ ] Hot reload (only commands)
- [ ] Run multiple commands at the same time
- [ ] Commands groups, alias
- [ ] Web interface
- [ ] Langs (FR/EN)

If you have any ideas, i am open!

## Installation
Our package: `npm i --save @tanuki/discord-bot-base`
Voice support: `npm i --save node-opus`
Faster voice packet encryption/decryption: `npm i --save libsodium.js`

## Links
Repository (master, stable): https://github.com/nooneexpectme/discord-bot-base
Repository (dev, may be unstable): https://github.com/nooneexpectme/discord-bot-base/tree/dev
NPM: https://www.npmjs.com/package/@tanuki/discord-bot-base

## Contributing
Anyone can contribute to this project with **issues** and **pull requests**, i will be happy if you also want to contact me on discord: **Tanuki#0003** (Even you're french! Je le suis aussi).