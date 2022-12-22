const telegrambot = require('./telegrambot')

telegrambot.init()

telegrambot.setWebhook()

telegrambot.sendMessage('telegrambot')
