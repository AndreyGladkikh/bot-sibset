const {Markup} = require('telegraf')
const cron = require('cron')
const CronJob = cron.CronJob
const db = require('../models')
const bot = require('../bot')

const AGENTS_CHUNK_SIZE = 30
const SCENE_ALIAS_AGENT_CALL_ANALYZE = 'agent-call-analyze'

let messageNumber = 0
let agents
let questions

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createKeyboard(questionAnswers) {
    let keyboard = []
    for (answer in questionAnswers) {
        keyboard.push([Markup.button.callback(questionAnswers[answer], answer)])
    }

    return keyboard
}

// function sendMessages(messages) {
//     return new Promise(async (resolve, reject) => {
//         dance:
//         for (let i = 0; i < messages.length; i += MESSAGES_CHUNK_SIZE) {
//             messagesChunk = messages.slice(i, i + MESSAGES_CHUNK_SIZE);
//             for (message of messagesChunk) {
//                 await bot.telegram.sendMessage(message.telegramId, message.text, createKeyboard(message.answers))
//                 if(message.answers) {
//                     bot.on('callback_query', async (ctx, next) => {
//                         ctx.scene.enter(`day_2_scene_${+number + 1}`)
//                     })
//                     break dance
//                 }
//             }
//             await delay(1000)
//         }
//         return resolve()
//     })
// }

function sendMessages(agents, messages) {
    return new Promise(async (resolve, reject) => {
        if(!Array.isArray(messages)) {
            messages = [messages]
        }
        let stop = false
        for(message of messages) {
            if(!stop) {
                messageNumber++
                for (let i = 0; i < agents.length; i += AGENTS_CHUNK_SIZE) {
                    agentsChunk = agents.slice(i, i + AGENTS_CHUNK_SIZE);
                    for (agent of agentsChunk) {
                        await bot.telegram.sendMessage(agent.telegramId, message.text,
                            Markup.keyboard(createKeyboard(message.answers)).oneTime().resize())
                        if (message.answers) {
                            const sceneNumber = messageNumber
                            const messageAlias = message.alias
                            bot.use(async (ctx, next) => {
                                if (messageAlias === SCENE_ALIAS_AGENT_CALL_ANALYZE) {
                                    ctx.session.agent = agent
                                    ctx.scene.enter(`day_2_scene_${sceneNumber}`)
                                }
                            })
                            stop = true
                        }
                    }
                    await delay(1000)
                }
            }
            await delay(1000)
        }
        return resolve()
    })
}

bot.command('210', async (ctx) => {
    try {
        messageNumber = 1
        agents = await db.Agent.findActiveByDay(2)
        questions = await db.Question.findWithAnswersByDayGtNumber(2, messageNumber)

        await sendMessages(agents, questions[0])

        // const question = await db.Question.findByAlias('good-morning');

        // const q = await db.Question.findWithAnswersByDayAndNumber(2, number);

        // const questions = await db.sequelize.query(`
        // select (select text from questions q where q.day = a.day order by priority limit 1 offset ${offset}) as "questionText",
        //  (select json_object_agg(id, text) from answers a where a."questionId" = q.id order by priority) as "questionAnswers",*
        // from agents a
        // where day = 2
        // `, {type: db.sequelize.QueryTypes.SELECT});
        // messageNumber++

        // await sendMessages(q)
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('218', async (ctx) => {
    try {
        questions = await db.Question.findWithAnswersByDayGtNumber(2, messageNumber)
        await sendMessages(agents, questions[0])
        // messageNumber++
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('219', async (ctx) => {
    try {
        questions = await db.Question.findWithAnswersByDayGtNumber(2, messageNumber)
        await sendMessages(agents, questions)
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