const {bot, sendMessages} = require('../bot')
const db = require('../models')
const cron = require('cron')
const CronJob = cron.CronJob

const DAY = 3
const context = {messageNumber: 1, day: DAY}

bot.command('310', async (ctx) => {
    try {
        context.messageNumber = 1
        const agents = await db.Agent.findActiveByDay(DAY)
        const questions = await db.Question.findWithAnswersByDayGtNumber(DAY, context.messageNumber)

        await sendMessages(agents, [questions[0], questions[1]], context)
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('316', async (ctx) => {
    console.log(context)
    try {
        const agents = await db.Agent.findActiveByDay(DAY)
        const questions = await db.Question.findWithAnswersByDayGtNumber(DAY, context.messageNumber)

        await sendMessages(agents, questions, context)
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('31730', async (ctx) => {
    context.messageNumber = 15
    try {
        const agents = await db.Agent.findActiveByDay(DAY)
        const questions = await db.Question.findWithAnswersByDayGtNumber(DAY, context.messageNumber)

        await sendMessages(agents, questions, context)
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