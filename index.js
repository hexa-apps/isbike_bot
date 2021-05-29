require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const geolib = require("geolib");
const functions = require("./functions.js");

const token = process.env.TOKEN;
const apiUrl = process.env.URL;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  let message = "Received your message";
  if (msg.location) {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((json) => {
        var targetPoint = {
          longitude: msg.location.longitude,
          latitude: msg.location.latitude,
        };
        var stations = functions.stationsList(json.dataList);
        var nearest = geolib.findNearest(targetPoint, stations);
        var now = new Date();
        var lastConnectionCompare = now - new Date(nearest.last_connection);
        var timeCompare = functions.timeAgo(lastConnectionCompare);
        message = `İstasyon: ${nearest.name}\nDoluluk: ${nearest.filled}/${
          parseInt(nearest.filled) + parseInt(nearest.empty)
        }\nSon Bağlantı: ${timeCompare}\n\nhttps://www.google.com/maps/search/?api=1&query=${parseFloat(
          nearest.latitude
        )},${parseFloat(nearest.longitude)}`;
        console.log("istasyon no: " + nearest.station_no);
        console.log("sorgu zamanı: " + now);
        console.log(
          "mesafe: " + geolib.getDistance(targetPoint, nearest, 0.01)
        );
        bot.sendMessage(chatId, message);
      });
  } else {
    message = "En yakın istasyonu öğrenmek için lütfen konumunuzu paylaşın";
    bot.sendMessage(chatId, message);
  }
});
