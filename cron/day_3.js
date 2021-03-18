const {bot, sendMessages} = require('../bot')
const db = require('../models')
const cron = require('cron')
const CronJob = cron.CronJob

const DAY = 3
let messageNumber
let quantity

bot.command('310', async (ctx) => {
    try {
        messageNumber = 1
        quantity = 2
        await sendMessages(DAY, messageNumber, null, quantity)
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('316', async (ctx) => {
    try {
        messageNumber += quantity
        await sendMessages(DAY, messageNumber)
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('31730', async (ctx) => {
    try {
        await sendMessages(DAY, 15)
    } catch (e) {
        console.log(e.message)
    }
})

new CronJob('0 0 10 * * *', async () => {
    try {
        messageNumber = 1
        quantity = 2
        await sendMessages(DAY, messageNumber, null, quantity)
    } catch (e) {
        console.log(e.message)
    }
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 16 * * *', async function () {
    try {
        messageNumber += quantity
        await sendMessages(DAY, messageNumber)
    } catch (e) {
        console.log(e.message)
    }
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 30 17 * * *', async function () {
    try {
        await sendMessages(DAY, 15)
    } catch (e) {
        console.log(e.message)
    }
}, null, true, 'Asia/Novosibirsk').start();