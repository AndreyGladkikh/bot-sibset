const cron = require('cron')
const CronJob = cron.CronJob
const db = require('../models')
const bot = require('../bot')

const MESSAGES_CHUNK_SIZE = 30

let number
let agents
let questions

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sendMessages(messages) {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < messages.length; i += MESSAGES_CHUNK_SIZE) {
            messagesChunk = messages.slice(i, i + MESSAGES_CHUNK_SIZE);
            for (message of messagesChunk) {
                await bot.telegram.sendMessage(message.telegramId, message.text)
            }
            await delay(1000)
        }
        return resolve()
    })
}

bot.command('10', async (ctx) => {
    try {
        number = 1
        agents = await db.Agent.findActiveByDay(2)
        questions = await db.Question.findWithAnswersByDay(2)

        // const question = await db.Question.findByAlias('good-morning');

        const q = await db.Question.findWithAnswersByDayAndNumber(2, number);

        console.log(q)

        // const questions = await db.sequelize.query(`
        // select (select text from questions q where q.day = a.day order by priority limit 1 offset ${offset}) as "questionText",
        //  (select json_object_agg(id, text) from answers a where a."questionId" = q.id order by priority) as "questionAnswers",*
        // from agents a
        // where day = 2
        // `, {type: db.sequelize.QueryTypes.SELECT});
        number++

        await sendMessages(q)
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('18', async (ctx) => {
    try {
        const q = await db.Question.findWithAnswersByDayAndNumber(2, number);

        // const questions = await db.sequelize.query(`
        // select (select text from questions q where q.day = a.day order by priority limit 1 offset ${offset}) as "questionText",
        //  (select json_object_agg(id, text) from answers a where a."questionId" = q.id order by priority) as "questionAnswers",*
        // from agents a
        // where day = 2
        // `, {type: db.sequelize.QueryTypes.SELECT});
        // offset++

        number++
        await sendMessages(q)
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('19', async (ctx) => {
    try {
        const q = await db.Question.findWithAnswersByDayAndNumber(2, number);

        number++
        await sendMessages(q)

        // const questions = await db.sequelize.query(`
        // select (select text from questions q where q.day = a.day order by priority offset ${offset}) as "questionText",
        //  (select json_object_agg(id, text) from answers a where a."questionId" = q.id order by priority) as "questionAnswers",*
        // from agents a
        // where day = 2
        // `, {type: db.sequelize.QueryTypes.SELECT});
        // offset++
        //
        // await sendMessages(questions)
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