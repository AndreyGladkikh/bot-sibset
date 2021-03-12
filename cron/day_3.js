const {Markup} = require('telegraf')
const cron = require('cron')
const CronJob = cron.CronJob
const db = require('../models')
const bot = require('../bot')

const AGENTS_CHUNK_SIZE = 30

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
    keyboard = Markup.inlineKeyboard(keyboard).oneTime().resize()

    return keyboard
}

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
                        await bot.telegram.sendMessage(agent.telegramId, message.text, createKeyboard(message.answers))
                        if (message.answers) {
                            const sceneNumber = messageNumber
                            bot.on('callback_query', async (ctx, next) => {
                                ctx.session.agent = agent
                                ctx.scene.enter(`day_3_scene_${sceneNumber}`)
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

bot.command('310', async (ctx) => {
    try {
        messageNumber = 1
        agents = await db.Agent.findActiveByDay(3)
        questions = await db.Question.findWithAnswersByDayGtNumber(3, messageNumber)

        // console.log(agents)

        await sendMessages(agents, [questions[0], questions[1]])
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('316', async (ctx) => {
    try {
        questions = await db.Question.findWithAnswersByDayGtNumber(3, messageNumber)
        console.log(questions)
        await sendMessages(agents, questions[0])
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('31730', async (ctx) => {
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