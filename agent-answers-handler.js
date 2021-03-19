const { Markup } = require('telegraf')
const db = require('./models')
const Message = db.Message
const Agent = db.Agent
const Test = db.Test
const text = require('./text/scenes.json')

const MESSAGE_ALIAS_CONTACT_SHARE = 'contact-share'
const MESSAGE_ALIAS_WILL_YOU_COME = 'will-you-come'
const MESSAGE_ALIAS_WHY_WONT_YOU_COME = 'why-wont-you-come'
const MESSAGE_ALIAS_FOCUS_ON_SALES = 'focus-on-sales'
const MESSAGE_ALIAS_CALCULATE_MOTIVATION = 'calculate-motivation'
const MESSAGE_ALIAS_HOW_YOU_FEEL = 'how-you-feel'
const MESSAGE_ALIAS_TODAY_IS_A_GREAT_DAY = 'today-is-a-great-day'

const STICKER_ID_RIGHT_ANSWER = 'CAACAgIAAxkBAAIRSWBPpNVTCNJGM_CcGW04PR8pGiX8AAJ1CwACs954Sq85dnr2IiD9HgQ'
const STICKER_ID_WRONG_ANSWER = 'CAACAgIAAxkBAAIRSGBPpHSihII94cMFXyBahOHIijojAAK2DQAC2uB4SgAByauuNDzOAAEeBA'
const STICKER_ID_GOODBYE = 'CAACAgIAAxkBAAIRR2BPo8b3TA6EvESexah3gHIWLFFIAAIoAAMXEJ0H4p8QoS2fE6keBA'



const handle = async (ctx, message) => {
    const telegramId = ctx?.message?.from?.id || ctx.callbackQuery.from.id
    const nextSceneId = `day_${message.day}_scene_${+message.number + 1}`

    ctx.session.stop = false
    ctx.session.currentMessageIsLastInTheDay = await Message.findIdOfTheLastByDay(message.day) === message.id
    ctx.session.messageId = message.id
    ctx.session.answerId = ctx?.callbackQuery?.data
    ctx.session.agent = ctx.session.agent || await Agent.findByTelegramId(telegramId)

    if (ctx?.message?.contact) {
        ctx.session.agent = ctx.session.agent ||
            await Agent.create({
                telegramId: ctx.message.from.id,
                phone: ctx.message.contact.phone_number,
                nickname: ctx.message.from.username,
                day: 1,
                isActive: true,
            });
        ctx.session.answerId = message.right_answer_id
        await ctx.reply('Спасибо!', Markup.removeKeyboard())
    }

    if (message.alias === MESSAGE_ALIAS_WILL_YOU_COME) {
        if (ctx.callbackQuery.data === String(message.right_answer_id)) {
            await ctx.reply(text.bye)
            ctx.session.agent.isActive = true
            ctx.session.currentMessageIsLastInTheDay = true
        } else {
            ctx.session.agent.isActive = false
        }
    }

    if (message.alias === MESSAGE_ALIAS_WHY_WONT_YOU_COME) {
        await ctx.reply(text.sorry)
    }

    if (message.alias === MESSAGE_ALIAS_CALCULATE_MOTIVATION) {
        ctx.session.stop = true
    }

    if (message.alias === MESSAGE_ALIAS_FOCUS_ON_SALES) {
        ctx.session.stop = true
    }

    if (message.alias === MESSAGE_ALIAS_HOW_YOU_FEEL) {
        if (ctx.callbackQuery.data !== String(message.right_answer_id)) {
            ctx.session.agent.isActive = false
            return ctx.scene.enter(`day_3_scene_17`);
        }
    }

    if (message.alias === MESSAGE_ALIAS_TODAY_IS_A_GREAT_DAY) {
        ctx.session.currentMessageIsLastInTheDay = true
    }

    if (message.verification_required) {
        const answerId = Number(ctx.callbackQuery.data)
        await ctx.reply(`Твой ответ: ${message.answers[answerId]}`)
        if (answerId === message.right_answer_id) {
            await ctx.replyWithSticker(STICKER_ID_RIGHT_ANSWER)
            await ctx.reply(text.right_answer)
        } else {
            await ctx.replyWithSticker(STICKER_ID_WRONG_ANSWER)
            await ctx.reply(`${text.wrong_answer} "${message.answers[message.right_answer_id]}"`)
        }
    }

    if (ctx.session.agent) {
        await Test.create({
            agentId: ctx.session.agent.id,
            messageId: ctx.session.messageId,
            answerId: ctx.session.answerId
        });
    }

    if (!(ctx.session.stop || ctx.session.currentMessageIsLastInTheDay)) {
        // await bot.sendMessage(Question.findWithAnswersByDayGtNumber(message.day, +message.number + 1, 1))
        return ctx.scene.enter(nextSceneId);
    } else {
        ctx.session.agent.lastQuestion = message.id
        if(ctx.session.agent.isActive && ctx.session.currentMessageIsLastInTheDay) {
            ctx.session.agent.day++
            await ctx.replyWithSticker(STICKER_ID_GOODBYE)
        }
        await ctx.session.agent.save()
        return ctx.scene.leave()
    }
}

module.exports = handle