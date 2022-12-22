require('dotenv').config()
const express = require('express')
const request = require('request')

const app = express()
app.use(express.json())

const BOT_TOKEN = process.env.BOT_TOKEN
const SERVER_URL = process.env.SERVER_URL
const IS_TEST = process.env.IS_TEST;

console.log(`BOT_TOKEN=${BOT_TOKEN}`)
console.log(`SERVER_URL=${SERVER_URL}`)

const BOT_URL = `https://api.telegram.org/bot${BOT_TOKEN}`
const API_SEND_REPLY = '/sendReply'
const API_SEND_MESSAGE = '/sendMessage'

var chat_id;

function init() {
	app.all('/', (req, res) => {
		console.log(`${req.body}`)
		res.send()

		setWebhook()
	})

	app.all(API_SEND_REPLY, (req, res) => {
		console.log(`${req.body}`)
		res.send()

		chat_id = req.body.message.chat.id

		if (IS_TEST) {
			sendMessage(req.body.message.text)
		}
	})

	app.all(API_SEND_MESSAGE, (req, res) => {
		console.log(`${req.body}`)
		res.send()

		if (IS_TEST) {
			sendMessage('message')
		} else {
			sendMessage(req.body.message)
		}
	})

	app.listen()
}

function setWebhook() {
	request(
		{
			url: `${BOT_URL}/setWebhook?url=${SERVER_URL}${API_SEND_REPLY}`,
			method: 'GET',
		},
		(error, response, body) => {
			console.log(`setWebhook`)
			if (error) {
				console.log(error)
			} else if (response.statusCode === 200) {
				console.log(body)
			} else {
				console.log(response.statusCode)
			}
		}
	);
}

function sendMessage(message) {
	request(
		{
			url: `${BOT_URL}/sendMessage?chat_id=${chat_id}&text=${message}`,
			method: 'GET',
		},
		(error, response, body) => {
			console.log(`sendMessage`)
			if (error) {
				console.log(error)
			} else if (response.statusCode === 200) {
				console.log(body)
			} else {
				console.log(response.statusCode)
			}
		}
	);
}

module.exports = { init, setWebhook, sendMessage }