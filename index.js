const {Scenes, session, Telegraf, Markup} = require('telegraf')
const cron = require('cron')
const CronJob = cron.CronJob
const models = require('./models')
const Question = models.Question
const Agent = models.Agent
const Test = models.Test
const c = require('./cron/day_2')

const MESSAGES_CHUNK = 30

const token = '1600121759:AAFR1phHGUp879PqUvCGNPRWLsQxrh5opE8'

// Handler factories
const {enter, leave} = Scenes.Stage

const bot = new Telegraf(token)

const stageDayOne = require('./scenes/day_1.js').getStage()
    .then(result => {
        bot.use(session())
        bot.use(result.middleware())

// bot.start((ctx) => {
//     ctx.reply(
//         text.start_text,
//         Markup.keyboard(['Окей, мне понятно'])
//             .oneTime()
//             .resize()
//     )
// })

        bot.command('start', ctx => {
            ctx.scene.enter('day_1_scene_1')
        })

        bot.on('text', ctx => {
            ctx.reply('main ctx')
        })


// bot.command('share', (ctx) => {
//     return ctx.reply(
//         'Поделитесь контактом',
//         Markup.keyboard([
//             Markup.button.contactRequest('Поделиться контактом')
//         ]).oneTime().resize()
//     )
// })

// bot.command('greeter', (ctx) => ctx.scene.enter('greeter'))
// bot.command('echo', (ctx) => ctx.scene.enter('echo'))
// bot.on('message', (ctx) => ctx.reply('Try /echo or /greeter'))
        bot.launch()
    })

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

function sendMessages(messages) {
    for (let i = 0; i < messages.length; i += MESSAGES_CHUNK) {
        messagesChunk = messages.slice(i, i + MESSAGES_CHUNK);
        for(message of messagesChunk) {
            bot.telegram.sendMessage(message.dataValues.telegramId, message.dataValues.questionText)
        }
    }
}

let offset

bot.command('10', async (ctx) => {
    offset = 0
    // const agents = await Agent.findAll({
    //     where: {
    //         day: [2,3],
    //         isActive: true
    //     },
    // })

    try {
        const questions = await models.sequelize.query(`
        select (select text from questions q where q.day = a.day order by priority limit 1 offset ${offset}) as "questionText", *
        from agents a
        `, {
            model: Question,
            mapToModel: true
        });
        offset++

        await sendMessages(questions)
    } catch (e) {
        console.log(e.message)
    }


    // for(agent of agents) {
    //     if(agent.day === 2) {
    //         const questions = await Question.findAll({
    //             where: {
    //                 day: 2
    //             },
    //             order: [['sort', 'asc']],
    //             offset: 0,
    //             limit: 1
    //         })
    //         console.log(questions)
    //     }
    //     if(agent.day === 3) {
    //         const questions = await Question.findAll({
    //             where: {
    //                 day: 3
    //             },
    //             order: [['sort', 'asc']],
    //             offset: 0,
    //             limit: 1
    //         })
    //         console.log(questions)
    //     }
    //
    // }



    // console.log(agents)
    // const reminder = await Question.getByAlias('waiting-for-you-today')
    // ctx.reply(reminder[0].text, Markup.removeKeyboard(true))
})

bot.command('18', async (ctx) => {
    try {
        const questions = await models.sequelize.query(`
        select (select text from questions q where q.day = a.day order by priority limit 1 offset ${offset}) as "questionText", *
        from agents a
        `, {
            model: Question,
            mapToModel: true
        });
        offset++

        await sendMessages(questions)
    } catch (e) {
        console.log(e.message)
    }
})

bot.command('219', async (ctx) => {
    // const call = await Question.getByAlias('call')
    // const call = await Question.findOne({ where: { alias: 'call' } })
    const call = await Question.findAll({ where: { day: 2 }, order: [['sort', 'desc']] })
    console.log(call)
    // ctx.reply(call.text, Markup.keyboard(['Скорее бы так же!']).oneTime().resize())
    // ctx.reply(call[0].text, Markup.keyboard(['Скорее бы так же!']).oneTime().resize())
})

new CronJob('0 0 10 * * *', function () {
    console.log('You will see this message every second');
    bot.telegram.sendMessage(184808957, 'cron')
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 11 * * *', function () {
    console.log('You will see this message every second');
    bot.telegram.sendMessage(184808957, 'cron')
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 16 * * *', function () {
    console.log('You will see this message every second');
    bot.telegram.sendMessage(184808957, 'cron')
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 18 * * *', function () {
    console.log('You will see this message every second');
    bot.telegram.sendMessage(184808957, 'cron')
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 19 * * *', function () {
    console.log('You will see this message every second');
    bot.telegram.sendMessage(184808957, 'cron')
}, null, true, 'Asia/Novosibirsk').start();




/*

const {Telegraf, Scenes: {BaseScene, Stage}, session, Markup} = require('telegraf');
const text = require('./text/dev.norcom.json');

const sceneDayOne = new BaseScene('sceneDayOne')

sceneDayOne.enter(ctx => ctx.reply(text.start_text,
    Markup.keyboard(['Окей, мне понятно'])
        .oneTime()
        .resize())
)
sceneDayOne.on('text', ctx => {
    if(ctx.message.text === 'Окей, мне понятно') {
        ctx.reply('Поделитесь контактом',
            Markup.keyboard([
                Markup.button.contactRequest('Поделиться контактом'),
                'Не делиться контактом'
            ]).oneTime().resize())
    }
    if(ctx.message.text === 'Поделиться контактом') {
        ctx.reply('click')
    }
    // return ctx.scene.enter()
})


// sceneDayOne.leave()


// const greetingStage = new Stage([sceneDayOne()])

const bot = new Telegraf('1600121759:AAFpcr5GCGJQ7XGAADmLMdnWDFtCHd35YVU')

bot.command('quit', (ctx) => {
    ctx.leaveChat()
})

bot.start((ctx) => {
    ctx.reply('foo')
})

bot.command('test', ctx => {
    ctx.scene.enter('sceneDayOne')
})

// bot.telegram.sendMessage(184808957, 'test');

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


 */