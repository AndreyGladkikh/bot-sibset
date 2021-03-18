const {bot, sendMessages} = require('../bot')
const db = require('../models')
const cron = require('cron')
const CronJob = cron.CronJob

const DAY = 4
let messageNumber

bot.command('411', async (ctx) => {
    try {
        messageNumber = 1
        await sendMessages(DAY, messageNumber)
    } catch (e) {
        console.log(e.message)
    }
})

new CronJob('0 0 11 * * *', async () => {
    try {
        messageNumber = 1
        await sendMessages(DAY, messageNumber)
    } catch (e) {
        console.log(e.message)
    }
}, null, true, 'Asia/Novosibirsk').start();