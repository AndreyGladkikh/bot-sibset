const { Scenes, Markup } = require('telegraf')
const text = require('./text/scenes.json')
const handleAnswer = require('./agent-answers-handler')
const db = require('./models')
const Question = db.Question
const Agent = db.Agent
const Test = db.Test

const SCENE_ALIAS_CONTACT_SHARE = 'contact-share'

const MEDIA_TYPE_PHOTO = 'photo'
const MEDIA_TYPE_AUDIO = 'audio'

const STICKER_ID_GREETING = 'CAACAgIAAxkBAAIRSmBPpPhOGRmQ6l4WRCG7TW6h7WFZAAKhDwAC1dCASq0q2GjCd5-hHgQ'

function getStage() {
    return new Promise(async (resolve, reject) => {
        try {
            const arScene = []
            const questions = await Question.findAllWithAnswers()
            for (let question of questions) {
                const currentSceneId = `day_${question.day}_scene_${question.number}`
                const nextSceneId = `day_${question.day}_scene_${+question.number + 1}`
                const scene = new Scenes.BaseScene(currentSceneId);

                const questionId = question.id;
                let questionText = question.text;
                const questionAnswers = question.answers
                const questionAlias = question.alias
                const questionDay = question.day
                const questionMediaFile = question.mediaFile
                const questionMediaType = question.mediaType
                const questionVerificationRequired = question.verificationRequired
                const rightAnswerId = question.rightAnswerId
                const keyboard = createKeyboard(question)

                if(questionVerificationRequired) {
                    questionText += "\n"
                    let i = 0
                    for (let answer in questionAnswers) {
                        questionText += `\n${++i}. ${questionAnswers[answer]}`
                    }
                }

                scene.enter(async ctx => {
                    const telegramId = ctx?.message?.from?.id || ctx.callbackQuery.from.id

                    ctx.session.questionId = questionId
                    ctx.session.currentSceneIsLast = false
                    ctx.session.agent = ctx.session.agent || await Agent.findByTelegramId(telegramId)

                    if(questionMediaType === MEDIA_TYPE_PHOTO) {
                        await ctx.replyWithPhoto(
                            { source: './public' + questionMediaFile },
                            {
                                caption: questionText,
                                reply_markup: keyboard.oneTime().resize().reply_markup,
                                parse_mode: 'HTML'
                            }
                        )
                    } else if(questionMediaType === MEDIA_TYPE_AUDIO) {
                        await ctx.replyWithAudio(
                            { source: './public' + questionMediaFile },
                            {
                                caption: questionText,
                                reply_markup: keyboard.oneTime().resize().reply_markup,
                                parse_mode: 'HTML'
                            }
                        )
                    } else {
                        if(questionId === 1 && questionDay === 1) {
                            await ctx.replyWithSticker(STICKER_ID_GREETING)
                        }
                        await ctx.reply(
                            questionText,
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
                    if (questionAlias === SCENE_ALIAS_CONTACT_SHARE) {
                        handleAnswer(ctx, question)
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

function createKeyboard(question) {
    let keyboard = []
    if(question.alias === SCENE_ALIAS_CONTACT_SHARE) {
        keyboard = [
            Markup.button.contactRequest(text.button_contact_share)
        ]
        keyboard = Markup.keyboard(keyboard)
    } else {
        if(question.verificationRequired) {
            let i = 0
            for (let answer in question.answers) {
                keyboard.push([Markup.button.callback(`Вариант ${++i}`, answer)])
            }
        } else {
            for (let answer in question.answers) {
                keyboard.push([Markup.button.callback(question.answers[answer], answer)])
            }
        }
        keyboard = Markup.inlineKeyboard(keyboard)
    }

    return keyboard
}

module.exports = {
    getStage: getStage
}