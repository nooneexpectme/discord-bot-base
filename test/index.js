console.log("\033c Console cleaned.");

// Bot settings (NEEDED VALUES)
const
    QueenDecim = require("../dist"),
    BOT_TOKEN = null,
    OWNER_ID = null;

// Commands
const
    CMD_REPLY = require("./commands/reply.js"),
    CMD_ERROR = require("./commands/error.js"),
    CMD_EVAL = require("./commands/eval.js");

// Init QueenDecimClient
const DebugBot = new QueenDecim.Client({
    token: process.argv[2] || BOT_TOKEN,
    prefix: "!",
    ownerId: process.argv[3] || OWNER_ID,
    commands: [CMD_REPLY],
    commandsAutoRegister: true,
    commandsAutoLoad: true
});

// Register dispatcher events
DebugBot.dispatcher
.on(QueenDecim.Events.CONNECTED, () => { console.log("STARTED"); })
.on(QueenDecim.Events.ERROR, error => { console.error("ERROR", error); })
.on(QueenDecim.Events.DISCONNECTED, () => { console.log("DISCONNECTED"); });

// We will use async functions
(async () => {
    // Register and load command manually
   // await DebugBot.commands.register(CMD_EVAL).load();
    // Finally log-in the bot
    return DebugBot.logIn();
})()
.then(() => console.log("OK"))
.catch(console.error);