const { Telegraf, Markup } = require('telegraf');
const text = require('./text/dev.norcom.json');

const bot = new Telegraf('1600121759:AAFpcr5GCGJQ7XGAADmLMdnWDFtCHd35YVU')

bot.command('quit', (ctx) => {
    ctx.leaveChat()
})

bot.start((ctx) => {
    ctx.reply(text.start_text)
})

bot.on('text', (ctx) => {
    ctx.reply(`Hello Andrey`)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
