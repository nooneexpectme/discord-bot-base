console.log('\033c Console cleaned.')

// Bot settings (NEEDED VALUES)
const
    { Client, Events } = require('../dist'),
    BOT_TOKEN = null,
    OWNER_ID = null

// Init QueenDecimClient
const QueenDecim = new Client({
    token: process.argv[2] || BOT_TOKEN,
    prefix: '!',
    ownerId: process.argv[3] || OWNER_ID
})

// Register commands
QueenDecim.registry.command
    .register(require.resolve('./commands/admin/error.js'))
    .register(require.resolve('./commands/admin/eval.js'))
    .register(require.resolve('./commands/debug/reply.js'))

// Register dispatcher events
QueenDecim.dispatcher
    .on(Events.CONNECTED, () => { console.log('STARTED') })
    .on(Events.ERROR, error => { console.error('ERROR', error) })
    .on(Events.DISCONNECTED, () => { console.log('DISCONNECTED') });

// Log the bot
QueenDecim.logIn()
    .then(() => console.log('Application done'))
    .catch(console.error)