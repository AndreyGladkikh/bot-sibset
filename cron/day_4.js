const {Markup} = require('telegraf')
const cron = require('cron')
const CronJob = cron.CronJob
const db = require('../models')
const bot = require('../bot')

const AGENTS_CHUNK_SIZE = 30
const SCENE_ALIAS_AGENT_CALL_ANALYZE = 'agent-call-analyze'
const SCENE_ALIAS_WILL_YOU_COME = 'will-you-come'

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
                        if(questionMediaType === MEDIA_TYPE_PHOTO) {
                            bot.telegram.sendPhoto(
                                agent.telegramId,
                                { source: './public' + questionMediaFile },
                                {caption: questionText, reply_markup: Markup.keyboard(keyboard).oneTime().resize().reply_markup}
                            )
                        } else if(questionMediaType === MEDIA_TYPE_AUDIO) {
                            bot.telegram.sendAudio(
                                agent.telegramId,
                                { source: './public' + questionMediaFile },
                                {caption: questionText, reply_markup: Markup.keyboard(keyboard).oneTime().resize().reply_markup}
                            )
                        } else {
                            await bot.telegram.sendMessage(agent.telegramId, message.text,
                                Markup.keyboard(createKeyboard(message.answers)).oneTime().resize())
                        }
                        if (message.answers) {
                            const nextSceneId = `day_4_scene_${messageNumber}`
                            const messageAlias = message.alias
                            const messageAnswers = message.answers
                            const rightAnswerId = message.rightAnswerId
                            bot.use(async (ctx, next) => {
                                ctx.session.agent = agent
                                if (messageAlias === SCENE_ALIAS_WILL_YOU_COME) {
                                    if (ctx.message.text === messageAnswers[rightAnswerId]) {
                                        await ctx.reply(text.bye)
                                        ctx.session.agent.isActive = true
                                        ctx.session.currentSceneIsLast = true
                                    } else {
                                        ctx.session.agent.isActive = false
                                    }
                                }
                            })
                            bot.use(async ctx => {
                                await Test.create({
                                    agentId: ctx.session.agent.id,
                                    questionId: ctx.session.questionId,
                                    answerId: ctx.session.answerId
                                });

                                if (!ctx.session.currentSceneIsLast) {
                                    return ctx.scene.enter(nextSceneId);
                                } else {
                                    ctx.session.agent.lastQuestion = questionId
                                    await ctx.session.agent.save()

                                    return ctx.scene.leave()
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

bot.command('4-11', async (ctx) => {
    try {
        messageNumber = 1
        agents = await db.Agent.findActiveByDay(4)
        questions = await db.Question.findWithAnswersByDayGtNumber(4, messageNumber)

        await sendMessages(agents, questions[0])
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