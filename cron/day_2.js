const {bot, sendMessages} = require('../bot')
const db = require('../models')
const cron = require('cron')
const CronJob = cron.CronJob

const DAY = 2
let messageNumber
let quantity

bot.command('210', async (ctx) => {
    try {
        messageNumber = 1
        quantity = 1
        await sendMessages(DAY, messageNumber, null, quantity)
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('218', async (ctx) => {
    try {
        messageNumber += quantity
        quantity = 1
        await sendMessages(DAY, messageNumber, null, quantity)
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('219', async (ctx) => {
    try {
        messageNumber += quantity
        await sendMessages(DAY, messageNumber)
    } catch (e) {
        console.log(e.message)
    }
})

new CronJob('0 0 10 * * *', async () => {
    try {
        messageNumber = 1
        quantity = 1
        await sendMessages(DAY, messageNumber, null, quantity)
    } catch (e) {
        console.log(e.message)
    }
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 18 * * *', async function () {
    try {
        messageNumber += quantity
        quantity = 1
        await sendMessages(DAY, messageNumber, null, quantity)
    } catch (e) {
        console.log(e.message)
    }
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 19 * * *', async function () {
    try {
        messageNumber += quantity
        await sendMessages(DAY, messageNumber)
    } catch (e) {
        console.log(e.message)
    }
}, null, true, 'Asia/Novosibirsk').start();