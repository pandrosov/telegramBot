require('dotenv').config();
const mongoose = require('mongoose')
const helpers = require('./helpers');
const TestBot = require('node-telegram-bot-api');
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard');
const database = require('../database.json');

const MONGODB_URL = process.env.MONGODB_URL
const TOKEN = process.env.TELEGRAMBOT;

helpers.logStart();

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connected to DB"))
    .catch(err => console.log(err))

require('./models/film.model')

const Film = mongoose.model('films')

// database.films.forEach(f => new Film(f).save())

const bot = new TestBot(TOKEN, {
    polling: true
})

bot.on('message', msg => {
    const chatId = helpers.getChatId(msg)

    switch (msg.text) {
        case kb.home.favourite:
            break
        case kb.home.films:
            bot.sendMessage(chatId, 'Выберите жанр:', {
                reply_markup: {
                    keyboard: keyboard.films
                }
            })
            break
        case kb.film.random:
            sendFilmsByQuery(chatId, {})
            break
        case kb.film.comedy:
            sendFilmsByQuery(chatId, {type: 'comedy'})
            break
        case kb.film.action:
            sendFilmsByQuery(chatId, {type: 'comedy'})
            break
        case kb.home.cinemas:
            break
        case kb.back:
            bot.sendMessage(chatId, 'Выберите жанр:', {
                reply_markup: {
                    keyboard: keyboard.home
                }
            })
            break
    }
})

bot.onText(/\/start/, msg => {
    const greeting = `Здравствуйте, ${msg.from.first_name} \n Выберите команду для продолжения работы!`;

    bot.sendMessage(helpers.getChatId(msg), greeting, {
        reply_markup: {
            keyboard: keyboard.home
        }
    })
})

// ============================

function sendFilmsByQuery(chatId, query) {
    Film.find(query).then(films => {
        
        const html = films.map((f,i) => {
            return `<b>${i + 1}</b> ${f.name} - /f${f.uuid}`
        }).join('\n')

        bot.sendMessage(chatId, html, {
            parse_mode: 'HTML'
        })
    })
}