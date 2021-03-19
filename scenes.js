const { Scenes, Markup } = require('telegraf')
const text = require('./text/scenes.json')
const handleAnswer = require('./agent-answers-handler')
const db = require('./models')
const Message = db.Message
const Agent = db.Agent
const Test = db.Test

const MESSAGE_ALIAS_CONTACT_SHARE = 'contact-share'

const MEDIA_TYPE_PHOTO = 'photo'
const MEDIA_TYPE_AUDIO = 'audio'

const STICKER_ID_GREETING = 'CAACAgIAAxkBAAIRSmBPpPhOGRmQ6l4WRCG7TW6h7WFZAAKhDwAC1dCASq0q2GjCd5-hHgQ'

function getStage() {
    return new Promise(async (resolve, reject) => {
        try {
            const arScene = []
            const messages = await Message.findAllWithAnswers()
            for (let message of messages) {
                const currentSceneId = `day_${message.day}_scene_${message.number}`
                const scene = new Scenes.BaseScene(currentSceneId);

                let messageText = message.text;
                const keyboard = createKeyboard(message)

                if(message.verification_required) {
                    messageText += "\n"
                    let i = 0
                    for (let answer in message.answers) {
                        messageText += `\n${++i}. ${message.answers[answer]}`
                    }
                }

                scene.enter(async ctx => {
                    const telegramId = ctx?.message?.from?.id || ctx.callbackQuery.from.id

                    ctx.session.messageId = message.id
                    ctx.session.currentSceneIsLast = false
                    ctx.session.agent = ctx.session.agent || await Agent.findByTelegramId(telegramId)

                    if(message.media_file_type === MEDIA_TYPE_PHOTO) {
                        await ctx.replyWithPhoto(
                            { source: './public' + message.media_file_path },
                            {
                                caption: messageText,
                                reply_markup: keyboard.oneTime().resize().reply_markup,
                                parse_mode: 'HTML'
                            }
                        )
                    } else if(message.media_file_type === MEDIA_TYPE_AUDIO) {
                        await ctx.replyWithAudio(
                            { source: './public' + message.media_file_path },
                            {
                                caption: messageText,
                                reply_markup: keyboard.oneTime().resize().reply_markup,
                                parse_mode: 'HTML'
                            }
                        )
                    } else {
                        if(message.number === 1 && message.day === 1) {
                            await ctx.replyWithSticker(STICKER_ID_GREETING)
                        }
                        await ctx.reply(
                            messageText,
                            {
                                reply_markup: keyboard.oneTime().resize().reply_markup,
                                parse_mode: 'HTML'
                            })
                    }
                })

                scene.on('text', (ctx, next) => {
                    ctx.reply(text.scene_answer_forbidden)
                })

                scene.use(async (ctx, next) => {
                    if (message.alias === MESSAGE_ALIAS_CONTACT_SHARE) {
                        await handleAnswer(ctx, message)
                    }

                    return next()
                })

                arScene.push(scene)
            }
            return resolve(new Scenes.Stage(arScene))
        } catch(e) {
            console.log(e.message)
        }
    })
}

function createKeyboard(message) {
    let keyboard = []
    if(message.alias === MESSAGE_ALIAS_CONTACT_SHARE) {
        keyboard = [
            Markup.button.contactRequest(text.button_contact_share)
        ]
        keyboard = Markup.keyboard(keyboard)
    } else {
        if(message.verification_required) {
            let i = 0
            for (let answer in message.answers) {
                keyboard.push([Markup.button.callback(`Вариант ${++i}`, answer)])
            }
        } else {
            for (let answer in message.answers) {
                keyboard.push([Markup.button.callback(message.answers[answer], answer)])
            }
        }
        keyboard = Markup.inlineKeyboard(keyboard)
    }

    return keyboard
}

module.exports = {
    getStage: getStage
}