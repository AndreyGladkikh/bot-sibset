const {bot, sendMessages} = require('../bot')
const db = require('../models')
const cron = require('cron')
const CronJob = cron.CronJob

const DAY = 2
const context = {messageNumber: 1, day: DAY}
let messageNumber
let quantity

bot.command('210', async (ctx) => {
    try {
        messageNumber = 1
        quantity = 1
        // context.messageNumber = 1
        // const agents = await db.Agent.findActiveByDay(DAY)
        // const questions = await db.Question.findWithAnswersByDayGtNumber(DAY, context.messageNumber, 1)
        //
        // await sendMessages(agents, questions[0], context)
        await sendMessages(DAY, messageNumber, quantity)
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('218', async (ctx) => {
    try {
        messageNumber += quantity
        quantity = 1
        // context.messageNumber = 1
        // const agents = await db.Agent.findActiveByDay(DAY)
        // const questions = await db.Question.findWithAnswersByDayGtNumber(DAY, context.messageNumber, 1)
        // await sendMessages(agents, questions[0], context)
        await sendMessages(DAY, messageNumber, quantity)
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('219', async (ctx) => {
    try {
        messageNumber += quantity
        // const agents = await db.Agent.findActiveByDay(DAY)
        // const questions = await db.Question.findWithAnswersByDayGtNumber(DAY, context.messageNumber)
        // await sendMessages(agents, questions, context)
        await sendMessages(DAY, messageNumber)
    } catch (e) {
        console.log(e.message)
    }
})

new CronJob('0 0 10 * * *', async () => {

}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 18 * * *', function () {
    console.log('You will see this message every second');
    bot.telegram.sendMessage(184808957, 'cron')
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 19 * * *', function () {
    console.log('You will see this message every second');
    bot.telegram.sendMessage(184808957, 'cron')
}, null, true, 'Asia/Novosibirsk').start();