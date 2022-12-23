require('dotenv').config()
const express = require('express')
const request = require('request')

const app = express()
app.use(express.json())

const BOT_TOKEN = process.env.BOT_TOKEN
const SERVER_URL = process.env.SERVER_URL
const IS_REPLY = process.env.IS_REPLY;

console.log(`BOT_TOKEN=${BOT_TOKEN}`)
console.log(`SERVER_URL=${SERVER_URL}`)

const BOT_URL = `https://api.telegram.org/bot${BOT_TOKEN}`
const API_RECEIVE_MESSAGE = '/receiveMessage'
const API_SEND_MESSAGE = '/sendMessage'

var chat_id;

app.all('/', (req, res) => {
	console.log(`/:body=${req.body}`)
	res.send()
})

app.all(API_RECEIVE_MESSAGE, (req, res) => {
	console.log(`${API_RECEIVE_MESSAGE}:body=${req.body}`)
	res.send()

	chat_id = req.body.message.chat.id

	if (IS_REPLY) {
		sendMessage(req.body.message.text)
	}
})

app.all(API_SEND_MESSAGE, (req, res) => {
	console.log(`${API_SEND_MESSAGE}:body=${req.body}`)
	res.send()

	sendMessage(req.body.message)
})

app.listen()

request(
	{
		url: `${BOT_URL}/setWebhook?url=${SERVER_URL}${API_RECEIVE_MESSAGE}`,
		method: 'GET',
	},
	(error, response, body) => {
		console.log(`setWebhook?url=${SERVER_URL}${API_RECEIVE_MESSAGE}`)
		if (error) {
			console.log(`error=${error}`)
		} else if (response.statusCode === 200) {
			console.log(`responseBody=${body}`)
		} else {
			console.log(`statusCode=${response.statusCode}`)
		}
	}
)

function sendMessage(message) {
	console.log(`sendMessage(${message}) is called`)
	request(
		{
			url: `${BOT_URL}/sendMessage?chat_id=${chat_id}&text=${message}`,
			method: 'GET',
		},
		(error, response, body) => {
			console.log(`sendMessage?text=${message}`)
			if (error) {
				console.log(`error=${error}`)
			} else if (response.statusCode === 200) {
				console.log(`responseBody=${body}`)
			} else {
				console.log(`statusCode=${response.statusCode}`)
			}
		}
	)
}