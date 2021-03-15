const { Scenes, Markup } = require('telegraf')
const text = require('../text/scenes.json')
const db = require('../models')
const Question = db.Question
const Agent = db.Agent
const Test = db.Test

const SCENE_ALIAS_CONTACT_SHARE = 'contact-share'
const SCENE_ALIAS_WILL_YOU_COME = 'will-you-come'
const SCENE_ALIAS_WHY_WONT_YOU_COME = 'why-wont-you-come'

const MEDIA_TYPE_PHOTO = 'photo'
const MEDIA_TYPE_AUDIO = 'audio'

function getStage() {
    return new Promise(async (resolve, reject) => {
        try {
            const arScene = []
            const questions = await Question.findAllWithAnswers()
            for (question of questions) {
                const currentSceneId = `day_${question.day}_scene_${question.number}`
                const nextSceneId = `day_${question.day}_scene_${+question.number + 1}`
                const scene = new Scenes.BaseScene(currentSceneId);

                const questionId = question.id;
                const questionText = question.text;
                const questionAnswers = question.answers
                const questionAlias = question.alias
                const questionMediaFile = question.mediaFile
                const questionMediaType = question.mediaType
                const questionVerificationRequired = question.verificationRequired
                const rightAnswerId = question.rightAnswerId
                const keyboard = createKeyboard(question, questionAnswers)

                scene.enter(ctx => {
                    ctx.session.questionId = questionId
                    ctx.session.currentSceneIsLast = false

                    if(questionMediaType === MEDIA_TYPE_PHOTO) {
                        ctx.replyWithPhoto(
                            { source: './public' + questionMediaFile },
                            {caption: questionText, reply_markup: Markup.keyboard(keyboard).oneTime().resize().reply_markup}
                        )
                    } else if(questionMediaType === MEDIA_TYPE_AUDIO) {
                        ctx.replyWithAudio(
                            { source: './public' + questionMediaFile },
                            {caption: questionText, reply_markup: Markup.keyboard(keyboard).oneTime().resize().reply_markup}
                        )
                    } else {
                        ctx.reply(
                            questionText,
                            Markup.keyboard(keyboard).oneTime().resize())
                    }
                })

                scene.use((ctx, next) => {
                    if (!Object.values(questionAnswers).includes(ctx.message.text) && !ctx.message.contact) {
                        ctx.reply(text.scene_answer_forbidden)
                        return
                    }

                    ctx.session.answerId = Object.keys(questionAnswers).find(questionId => questionAnswers[questionId] === ctx.message.text)

                    return next()
                })

                scene.use(async (ctx, next) => {
                    if (questionAlias === SCENE_ALIAS_CONTACT_SHARE) {
                        if (ctx.message.contact) {
                            ctx.session.agent = await Agent.findByPhone(ctx.message.contact.phone_number) ||
                                await Agent.create({
                                    telegramId: ctx.message.from.id,
                                    phone: ctx.message.contact.phone_number,
                                    nickname: ctx.message.from.username,
                                    day: 1,
                                    isActive: true,
                                });
                        }
                    } else if (questionAlias === SCENE_ALIAS_WILL_YOU_COME) {
                        if (ctx.message.text === questionAnswers[rightAnswerId]) {
                            await ctx.reply(text.bye)
                            ctx.session.agent.isActive = true
                            ctx.session.currentSceneIsLast = true
                        } else {
                            ctx.session.agent.isActive = false
                        }
                    } else if (questionAlias === SCENE_ALIAS_WHY_WONT_YOU_COME) {
                        await ctx.reply(text.sorry)
                        ctx.session.currentSceneIsLast = true
                    } else {
                        if (questionVerificationRequired) {
                            if (ctx.message.text === questionAnswers[rightAnswerId]) {
                                await ctx.reply(text.right_answer)
                            } else {
                                await ctx.reply(`${text.wrong_answer} "${questionAnswers[rightAnswerId]}"`)
                            }
                        }
                    }

                    return next()
                })

                scene.use(async ctx => {
                    if (ctx.session.agent) {
                        await Test.create({
                            agentId: ctx.session.agent.id,
                            questionId: ctx.session.questionId,
                            answerId: ctx.session.answerId
                        });
                    }

                    if (!ctx.session.currentSceneIsLast) {
                        return ctx.scene.enter(nextSceneId);
                    } else {
                        ctx.session.agent.lastQuestion = questionId
                        if(ctx.session.agent.isActive) {
                            ctx.session.agent.day = 2
                        }
                        await ctx.session.agent.save()

                        return ctx.scene.leave()
                    }
                })

                arScene.push(scene)
            }
            return resolve(new Scenes.Stage(arScene))
        } catch(e) {
            console.log(e.message)
        }
    })
}

function createKeyboard(question, questionAnswers) {
    let keyboard = []
    if(question.alias === SCENE_ALIAS_CONTACT_SHARE) {
        keyboard = [
            Markup.button.contactRequest(text.button_contact_share)
        ]
    } else {
        for (answer in questionAnswers) {
            keyboard.push([Markup.button.callback(questionAnswers[answer], answer)])
        }
    }

    return keyboard
}

module.exports = {
    getStage: getStage
}