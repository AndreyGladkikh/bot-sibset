const { Scenes, Markup } = require('telegraf')
const text = require('../text/scenes.json')
const models = require('../models')
const Question = models.Question
const Agent = models.Agent
const Test = models.Test

const SCENE_ALIAS_CONTACT_SHARE = 'contact-share'
const SCENE_ALIAS_WILL_YOU_COME = 'will-you-come'
const SCENE_ALIAS_WHY_WONT_YOU_COME = 'why-wont-you-come'
const SCENE_ID_PREFIX = 'day_2_scene_'

function getStage() {
    return new Promise(async (resolve, reject) => {
        try {
            const arScene = []
            questions = await Question.getByDay(2)
            for (question of questions) {
                const currentSceneId = SCENE_ID_PREFIX + question.id
                const nextSceneId = SCENE_ID_PREFIX + (question.id + 1)
                const scene = new Scenes.BaseScene(currentSceneId);

                const questionId = question.dataValues.id;
                const questionText = question.dataValues.text;
                const questionAnswers = question.dataValues.answers
                const questionAlias = question.dataValues.alias
                const questionVerifyingRequired = question.dataValues.verifyingrequired
                const rightAnswerId = question.dataValues.right_answer_id
                const keyboard = createKeyboard(question, questionAnswers)

                scene.enter(ctx => {
                    ctx.session.questionId = questionId
                    ctx.session.currentSceneIsLast = false

                    ctx.reply(
                        questionText,
                        Markup.keyboard(keyboard).oneTime().resize())
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
                        if (questionVerifyingRequired) {
                            if (ctx.message.text === questionAnswers[rightAnswerId]) {
                                await ctx.reply(text.right_answer)
                            } else {
                                await ctx.reply(text.wrong_answer + questionAnswers[rightAnswerId])
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
            keyboard.push(Markup.button.callback(questionAnswers[answer], answer))
        }
    }

    return keyboard
}

module.exports = {
    getStage: getStage
}


















/*
const sceneContactShare = new Scenes.BaseScene('contactShare');
const sceneGreeting = new Scenes.BaseScene('greeting');
const sceneBriefing = new Scenes.BaseScene('briefing');

sceneContactShare.enter(ctx => {
    ctx.reply(
        'Поделитесь контактом',
        Markup.keyboard([
            Markup.button.contactRequest('Поделиться контактом'),
            'Не делиться контактом'
        ]).oneTime().resize())
})
sceneContactShare.use(ctx => {
    // todo PHONE NUMBER
    console.log(ctx.message.contact.phone_number)
    return ctx.scene.enter('greeting');
})



sceneGreeting.enter((ctx) => {
    ctx.reply(text.start_text, Markup.inlineKeyboard([
        Markup.button.callback('Окей, мне понятно', 'ok')
    ]));
});
sceneGreeting.action('ok', (ctx) => {
    return ctx.scene.enter('briefing')
    // return ctx.scene.enter('SOME_OTHER_SCENE_ID');
});



sceneBriefing.enter(ctx => {
    ctx.reply(text.briefing_text, Markup.inlineKeyboard([
        Markup.button.callback('Хорошо', 'ok')
    ]))
    ctx.replyWithPhoto('../img/sibset_building.png')
})

// sceneGreeting.leave((ctx) => {
//     ctx.reply('Thank you for your time!');
// });

// What to do if user entered a raw message or picked some other option?
// greetingScene.use((ctx) => ctx.replyWithMarkdown('Please choose either Movie or Theater'));

const stageDayOne = new Scenes.Stage([sceneContactShare, sceneGreeting, sceneBriefing])

module.exports = stageDayOne
*/