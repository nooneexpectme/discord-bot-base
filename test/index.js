console.log("\033c Console cleaned.")

// Bot settings (NEEDED VALUES)
const
    { Client, Events } = require("../dist"),
    BOT_TOKEN = null,
    OWNER_ID = null

// Commands
const
    CMD_REPLY = require("./commands/reply.js"),
    CMD_ERROR = require("./commands/error.js"),
    CMD_EVAL = require("./commands/eval.js")

// Init QueenDecimClient
const QueenDecim = new Client({
    token: process.argv[2] || BOT_TOKEN,
    prefix: "!",
    ownerId: process.argv[3] || OWNER_ID,
    commands: [ CMD_REPLY ],
    commandsAutoRegister: true,
    commandsAutoLoad: true
})

// Register dispatcher events
QueenDecim.dispatcher
.on(Events.CONNECTED, () => { console.log("STARTED") })
.on(Events.ERROR, error => { console.error("ERROR", error) })
.on(Events.DISCONNECTED, () => { console.log("DISCONNECTED") });

// We will use async functions
(async () => {
    // Register and load command manually
    // await DebugBot.commands.register(CMD_EVAL).load()
    // Finally log-in the bot
    return QueenDecim.logIn()
})()
.then(() => console.log("OK"))
.catch(console.error)