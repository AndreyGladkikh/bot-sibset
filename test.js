const {Scenes, session, Telegraf} = require('telegraf')
const cron = require('cron')
const CronJob = cron.CronJob

const token = '1600121759:AAFpcr5GCGJQ7XGAADmLMdnWDFtCHd35YVU'

// Handler factories
const {enter, leave} = Scenes.Stage

const bot = new Telegraf(token)

const stageDayOne = require('./scenes/day_one.js')()
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
            ctx.scene.enter('day_one_scene_1')
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