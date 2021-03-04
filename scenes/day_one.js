const { Scenes, Markup } = require('telegraf')
const text = require('../text/dev.norcom.json')
const models = require('../models')
const Question = models.Question

function getStage() {
    return new Promise(async (resolve, reject) => {
        let questions = null
        let arStage = []

        questions = await Question.getByDay(1)
        for(question of questions) {
            let proceedToNextScene = true
            if(question.id === 14) {
                proceedToNextScene = false
            }
            const currentSceneId = 'day_one_scene_' + question.id
            const nextSceneId = 'day_one_scene_' + (question.id + 1)
            const scene = new Scenes.BaseScene(currentSceneId);

            const questionText = question.text;
            const answers = question.dataValues.answers
            const keyboard = []
            for(answer in answers) {
                keyboard.push(Markup.button.callback(answers[answer], answer))
            }

            scene.enter(ctx => {
                ctx.reply(
                    questionText,
                    Markup.keyboard(keyboard).oneTime().resize())
            })
            scene.use(ctx => {
                if(proceedToNextScene) {
                    return ctx.scene.enter(nextSceneId);
                } else {
                    return ctx.scene.leave()
                }
            })

            arStage.push(scene)
        }
        return resolve(new Scenes.Stage(arStage))
    })
}

module.exports = getStage


















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