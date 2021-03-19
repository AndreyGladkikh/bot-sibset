require('dotenv-flow').config();
const { Telegraf } = require('telegraf')
const fs = require('fs')

const bot = new Telegraf(process.env.BOT_TOKEN)

// TLS options
const tlsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/andrgladkikh.online/privkey.pem'),
    cert: fs.readFileSync('server-cert.pem')
}

// Set telegram webhook
// The second argument is necessary only if the client uses a self-signed
// certificate. Including it for a verified certificate may cause things to break.
bot.telegram.setWebhook(`${process.env.URL}:${process.env.PORT}/${process.env.BOT_TOKEN}`)

// Start https webhook
bot.startWebhook(`/${process.env.BOT_TOKEN}`, tlsOptions, process.env.PORT)

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))