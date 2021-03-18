require('dotenv-flow').config();
const {Scenes, session, Telegraf, Markup} = require('telegraf')
const fs = require('fs')
const scenes = require('./scenes.js')
const text = require('./text/scenes.json')
const handleAnswer = require('./agent-answers-handler')
const db = require('./models')
const Question = db.Question
const Agent = db.Agent
const Test = db.Test

const MESSAGES_PER_SECOND_LIMIT = 30
const MEDIA_TYPE_PHOTO = 'photo'
const MEDIA_TYPE_AUDIO = 'audio'

const STICKER_ID_GREETING = 'CAACAgIAAxkBAAIRSmBPpPhOGRmQ6l4WRCG7TW6h7WFZAAKhDwAC1dCASq0q2GjCd5-hHgQ'

const bot = new Telegraf(process.env.BOT_TOKEN)

function initializeBot() {
    return new Promise(async (resolve, reject) => {
        const stage = await scenes.getStage()
        const questions = await Question.findAllWithAnswers()

        bot.use(session())
        bot.use(stage.middleware())

        bot.command('start', async ctx => {
            // ctx.scene.enter('day_1_scene_1')
            const message = await Question.findWithAnswersByDayGtNumber(1, 1, 1)
            await sendMessage(message[0], ctx.message.from.id)
        })

        bot.on('callback_query',async(ctx, next) => {
            const question = questions.find((element, index, array) => {
                return element.answers && String(ctx.callbackQuery.data) in element.answers
            })
            if(question) {
                await handleAnswer(ctx, question)
            }
        })

        bot.launch()
        return resolve()
    })
}

function sendMessages(day, fromMessageNumber, quantity) {
    return new Promise(async (resolve, reject) => {
        const agents = await db.Agent.findActiveByDay(day)
        let messages = await db.Question.findWithAnswersByDayGtNumber(day, fromMessageNumber, quantity)

        if(!Array.isArray(messages)) {
            messages = [messages]
        }
        let stop = false
        for(let message of messages) {
            if(!stop) {
                // context.messageNumber++
                for (let i = 0; i < agents.length; i += MESSAGES_PER_SECOND_LIMIT) {
                    const agentsChunk = agents.slice(i, i + MESSAGES_PER_SECOND_LIMIT);
                    for (let agent of agentsChunk) {
                        await sendMessage(message, agent.telegramId)
                    }
                    if (message.answers) {
                        stop = true
                    }
                    await delay(1000)
                }
            }
            await delay(1000)
        }
        return resolve()
    })
}

function sendMessage(message, telegramId) {
    return new Promise(async (resolve, reject) => {
        const keyboard = createKeyboard(message)

        let messageText = message.text
        if(message.verificationRequired) {
            messageText += "\n"
            let i = 0
            for (let answer in questionAnswers) {
                messageText += `\n${++i}. ${questionAnswers[answer]}`
            }
        }

        if(message.mediaType === MEDIA_TYPE_PHOTO) {
            await bot.telegram.sendPhoto(
                telegramId,
                { source: './public' + message.mediaFile },
                {
                    caption: messageText,
                    reply_markup: keyboard.oneTime().resize().reply_markup,
                    parse_mode: 'HTML'
                }
            )
        } else if(message.mediaType === MEDIA_TYPE_AUDIO) {
            await bot.telegram.sendAudio(
                telegramId,
                { source: './public' + message.mediaFile },
                {
                    caption: messageText,
                    reply_markup: keyboard.oneTime().resize().reply_markup,
                    parse_mode: 'HTML'
                }
            )
        } else {
            if(+message.number === 1 && +message.day === 1) {
                await bot.telegram.sendSticker(telegramId, STICKER_ID_GREETING)
            }
            await bot.telegram.sendMessage(telegramId, messageText,
                {
                    reply_markup: keyboard.oneTime().resize().reply_markup,
                    parse_mode: 'HTML'
                })
        }
        return resolve()
    })
}

function createKeyboard(message) {
    let keyboard = []

    if(message.verificationRequired) {
        let i = 0
        for (let answer in message.answers) {
            keyboard.push([Markup.button.callback(`Вариант ${++i}`, answer)])
        }
    } else {
        for (let answer in message.answers) {
            keyboard.push([Markup.button.callback(message.answers[answer], answer)])
        }
    }

    return Markup.inlineKeyboard(keyboard)
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
    sendMessage: sendMessage,
    createKeyboard: createKeyboard
}