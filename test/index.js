console.log("\033c Console cleaned.");

// Get packages
const
    QueenDecim = require("../dist"),
    { join } = require("path");

// Bot settings (NEEDED VALUES)
const
    BOT_TOKEN = null,
    OWNER_ID = null;

// Init QueenDecimCore
let DebugBot = new QueenDecim.Client({
    token: process.argv[2] || BOT_TOKEN,
    prefix: "!",
    ownerId: process.argv[3] || OWNER_ID,
    commands: [
        join(__dirname, "commands", "reply.js"),
        join(__dirname, "commands", "error.js"),
        join(__dirname, "commands", "eval.js")
    ],
    commandsAutoRegister: true,
    commandsAutoLoad: true
});

// Register dispatcher events
DebugBot.dispatcher
.on(QueenDecim.Events.CONNECTED, () => { console.log("STARTED"); })
.on(QueenDecim.Events.ERROR, error => { console.error("ERROR", error); })
.on(QueenDecim.Events.DISCONNECTED, () => { console.log("DISCONNECTED"); })

// Finally log-in the bot
DebugBot.logIn()
.then(() => console.log("OK"))
.catch(console.error);