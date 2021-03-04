const { Telegraf, Markup } = require('telegraf');
const text = require('./text/dev.norcom.json');

const bot = new Telegraf('1600121759:AAFpcr5GCGJQ7XGAADmLMdnWDFtCHd35YVU')

bot.command('quit', (ctx) => {
    ctx.leaveChat()
})

bot.start((ctx) => {
    ctx.reply(
        text.start_text,
        Markup.keyboard(['Окей, мне понятно'])
        .oneTime()
        .resize()
    )
})

bot.command('share', (ctx) => {
    return ctx.reply(
        'Поделитесь контактом',
        Markup.keyboard([
            Markup.button.contactRequest('Поделиться контактом')
        ]).oneTime().resize()
    )
})

bot.on('text', (ctx) => {
    console.log(ctx.message)
    ctx.reply(`reply`)
})

// bot.telegram.sendMessage(184808957, 'test');

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))























/*
const { Scenes, session, Telegraf } = require('telegraf')
const cron = require('cron')
const CronJob = cron.CronJob

const token = '1600121759:AAFpcr5GCGJQ7XGAADmLMdnWDFtCHd35YVU'

// Handler factories
const { enter, leave } = Scenes.Stage

// Greeting scene
const greetingScene = new Scenes.BaseScene('greeting')
greetingScene.enter((ctx) => ctx.reply(
    text.start_text,
    Markup.keyboard(['Окей, мне понятно'])
        .oneTime()
        .resize()
))
greetingScene.leave((ctx) => ctx.reply('Bye'))
greetingScene.hears('hi', enter('greeter'))
greetingScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'))

// Greeter scene
const greeterScene = new Scenes.BaseScene('greeter')
greeterScene.enter((ctx) => ctx.reply('Hi'))
greeterScene.leave((ctx) => ctx.reply('Bye'))
greeterScene.hears('hi', enter('greeter'))
greeterScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'))

// Echo scene
const echoScene = new Scenes.BaseScene('echo')
echoScene.enter((ctx) => ctx.reply('echo scene'))
echoScene.leave((ctx) => ctx.reply('exiting echo scene'))
echoScene.command('back', leave())
echoScene.on('text', (ctx) => ctx.reply(ctx.message.text))
echoScene.on('message', (ctx) => ctx.reply('Only text messages please'))

const bot = new Telegraf(token)

const stageDayOne = new Scenes.Stage([greetingScene, echoScene])

const stage = new Scenes.Stage([greeterScene, echoScene], {
    ttl: 10,
})
bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => {
    ctx.reply(
        text.start_text,
        Markup.keyboard(['Окей, мне понятно'])
            .oneTime()
            .resize()
    )
})
bot.command('share', (ctx) => {
    return ctx.reply(
        'Поделитесь контактом',
        Markup.keyboard([
            Markup.button.contactRequest('Поделиться контактом')
        ]).oneTime().resize()
    )
})

bot.command('greeter', (ctx) => ctx.scene.enter('greeter'))
bot.command('echo', (ctx) => ctx.scene.enter('echo'))
bot.on('message', (ctx) => ctx.reply('Try /echo or /greeter'))
bot.launch()

new CronJob('0 0 10 * * *', function() {
    console.log('You will see this message every second');
    bot.telegram.sendMessage(184808957, 'cron')
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 11 * * *', function() {
    console.log('You will see this message every second');
    bot.telegram.sendMessage(184808957, 'cron')
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 16 * * *', function() {
    console.log('You will see this message every second');
    bot.telegram.sendMessage(184808957, 'cron')
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 18 * * *', function() {
    console.log('You will see this message every second');
    bot.telegram.sendMessage(184808957, 'cron')
}, null, true, 'Asia/Novosibirsk').start();

new CronJob('0 0 19 * * *', function() {
    console.log('You will see this message every second');
    bot.telegram.sendMessage(184808957, 'cron')
}, null, true, 'Asia/Novosibirsk').start();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
*/



























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