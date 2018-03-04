# Discord Bot Base
## About
DiscordBotBase is an unofficial framework written in TypeScript for [discord.js](https://github.com/discordjs/discord.js), it allow you to create a discord's bot with the minimum of lines.

## Features
* Startup and global options
* Register simple commands (from class & files)
* Hot reload (commands from files only)

## Installation
1. Install [NodeJS](https://nodejs.org/en/).
2. Install [TypeScript](https://www.typescriptlang.org/index.html#download-links).
3. Execute `npm install` where you have the `package.json`.

## Set-up first project
1. Build and start watching of `src/` with `tsc -p src`.
2. Create a `tests/` folder and put an `index.js` with the following content:
```js
const DiscordBotBase = require("../dist");
const FirstBot = new DiscordBotBase.Core({
    token: null,
    trigger: "!"
});
```
3. And create your first command:
```js
FirstBot.commands.register("example", "Example command", class {
    async run(message, args){
        console.log("args", args);
        // console.log("message", message);
        message.reply("Reply from example command.");
    }
});
```
4. Run your bot with:
```sh
$ node tests
```

## Contribution
Anyone can contribute to this project and i will be happy if you also want to contact me on discord: **Tanuki#0003**.