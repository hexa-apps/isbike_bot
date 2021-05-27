require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const turf = require("@turf/turf");

const token = process.env.TOKEN;
const apiUrl = process.env.URL;

const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  let message = "Received your message";
  if (msg.location) {
    var targetPoint = turf.point([msg.location.longitude, msg.location.latitude]);
    message = `${msg.location.latitude}, ${msg.location.longitude}`;
  }

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, message);
});
