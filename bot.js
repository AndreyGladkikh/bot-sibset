require('dotenv-flow').config();
const {Scenes, session, Telegraf, Markup} = require('telegraf')
const fs = require('fs')
const scenes = require('./scenes.js')
const text = require('./text/scenes.json')
const db = require('./models')
const Question = db.Question
const Agent = db.Agent
const Test = db.Test

const MESSAGES_PER_SECOND_LIMIT = 30
const MEDIA_TYPE_PHOTO = 'photo'
const MEDIA_TYPE_AUDIO = 'audio'

const SCENE_ALIAS_AGENT_CALL_ANALYZE = 'agent-call-analyze'
const SCENE_ALIAS_CONTACT_SHARE = 'contact-share'
const SCENE_ALIAS_WILL_YOU_COME = 'will-you-come'
const SCENE_ALIAS_WHY_WONT_YOU_COME = 'why-wont-you-come'
const SCENE_ALIAS_FOCUS_ON_SALES = 'focus-on-sales'
const SCENE_ALIAS_CALCULATE_MOTIVATION = 'calculate-motivation'

const bot = new Telegraf(process.env.BOT_TOKEN)

function initializeBot() {
    return new Promise(async (resolve, reject) => {
        const stage = await scenes.getStage()

        bot.use(session())
        bot.use(stage.middleware())

        bot.command('start', ctx => {
            ctx.scene.enter('day_1_scene_1')
        })

        bot.launch()
        return resolve()
    })
}

function sendMessages(agents, messages, context) {
    return new Promise(async (resolve, reject) => {
        if(!Array.isArray(messages)) {
            messages = [messages]
        }
        let stop = false
        for(message of messages) {
            if(!stop) {
                console.log(message)
                context.messageNumber++
                const keyboard = createKeyboard(message.answers)
                for (let i = 0; i < agents.length; i += MESSAGES_PER_SECOND_LIMIT) {
                    agentsChunk = agents.slice(i, i + MESSAGES_PER_SECOND_LIMIT);
                    for (agent of agentsChunk) {
                        if(message.mediaType === MEDIA_TYPE_PHOTO) {
                            await bot.telegram.sendPhoto(
                                agent.telegramId,
                                { source: './public' + message.mediaFile },
                                {caption: message.text, reply_markup: Markup.keyboard(keyboard).oneTime().resize().reply_markup}
                            )
                        } else if(message.mediaType === MEDIA_TYPE_AUDIO) {
                            await bot.telegram.sendAudio(
                                agent.telegramId,
                                { source: './public' + message.mediaFile },
                                {caption: message.text, reply_markup: Markup.keyboard(keyboard).oneTime().resize().reply_markup}
                            )
                        } else {
                            await bot.telegram.sendMessage(agent.telegramId, message.text,
                                Markup.keyboard(keyboard).oneTime().resize())
                        }
                        if (message.answers) {
                            const nextSceneId = `day_${context.day}_scene_${context.messageNumber}`
                            const messageAlias = message.alias
                            await bot.use(async (ctx, next) => {
                                console.log(messageAlias)
                                ctx.session.currentSceneIsLast = false
                                ctx.session.agent = agent
                                // if (messageAlias === SCENE_ALIAS_AGENT_CALL_ANALYZE) {
                                //     ctx.scene.enter(sceneId)
                                // }
                                if (messageAlias === SCENE_ALIAS_WILL_YOU_COME) {
                                    if (ctx.message.text === messageAnswers[rightAnswerId]) {
                                        await ctx.reply(text.bye)
                                        ctx.session.agent.isActive = true
                                        ctx.session.currentSceneIsLast = true
                                    } else {
                                        ctx.session.agent.isActive = false
                                    }
                                }
                                if (messageAlias === SCENE_ALIAS_FOCUS_ON_SALES) {
                                    if (ctx.message.text === messageAnswers[rightAnswerId]) {
                                        ctx.session.agent.isActive = true
                                    } else {
                                        ctx.session.currentSceneIsLast = true
                                        ctx.session.agent.isActive = false
                                        await ctx.reply(text.sorry)
                                    }
                                }
                                if (messageAlias === SCENE_ALIAS_CALCULATE_MOTIVATION) {
                                    ctx.session.currentSceneIsLast = true
                                }
                                if (message.verificationRequired) {
                                    if (ctx.message.text === message.answers[message.rightAnswerId]) {
                                        await ctx.replyWithSticker('CAACAgIAAxkBAAIRSWBPpNVTCNJGM_CcGW04PR8pGiX8AAJ1CwACs954Sq85dnr2IiD9HgQ')
                                        await ctx.reply(text.right_answer)
                                    } else {
                                        await ctx.replyWithSticker('CAACAgIAAxkBAAIRSGBPpHSihII94cMFXyBahOHIijojAAK2DQAC2uB4SgAByauuNDzOAAEeBA')
                                        await ctx.reply(`${text.wrong_answer} "${message.answers[message.rightAnswerId]}"`)
                                    }
                                }
                                return next()
                            })
                            await bot.use(async ctx => {
                                await Test.create({
                                    agentId: ctx.session.agent.id,
                                    questionId: ctx.session.questionId,
                                    answerId: ctx.session.answerId
                                });

                                if (!ctx.session.currentSceneIsLast) {
                                    return ctx.scene.enter(nextSceneId);
                                } else {
                                    ctx.session.agent.lastQuestion = message.id
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

function createKeyboard(questionAnswers) {
    let keyboard = []
    for (answer in questionAnswers) {
        keyboard.push([Markup.button.callback(questionAnswers[answer], answer)])
    }

    return keyboard
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

initializeBot()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

module.exports = {
    bot: bot,
    sendMessages: sendMessages,
    createKeyboard: createKeyboard
}