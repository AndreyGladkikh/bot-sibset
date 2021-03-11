require('dotenv-flow').config();
const {Scenes, session, Telegraf, Markup} = require('telegraf')

const token = process.env.BOT_TOKEN

const bot = new Telegraf(token)

const stageDayOne = require('./scenes/day_1.js').getStage()
    .then(result => {
        bot.use(session())
        bot.use(result.middleware())

        bot.command('start', ctx => {
            ctx.scene.enter('day_1_scene_1')
        })

        bot.on('text', ctx => {
            ctx.reply('main ctx')
        })
        bot.launch()
    })




// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

module.exports = bot