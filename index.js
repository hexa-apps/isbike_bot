require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const geolib = require("geolib");

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
    fetch(apiUrl)
      .then((res) => res.json())
      .then((json) => {
        var targetPoint = {
          longitude: msg.location.longitude,
          latitude: msg.location.latitude,
        };
        var stations = stationsList(json.dataList);
        var nearest = geolib.findNearest(targetPoint, stations);
        var lastConnectionCompare =
          new Date() - new Date(nearest.last_connection);
        var timeCompare = timeAgo(lastConnectionCompare);
        message = `İstasyon: ${nearest.name}\nDoluluk: ${nearest.filled}/${
          parseInt(nearest.filled) + parseInt(nearest.empty)
        }\nSon Bağlantı: ${timeCompare}\n\nhttps://www.google.com/maps/search/?api=1&query=${parseFloat(
          nearest.latitude
        )},${parseFloat(nearest.longitude)}`;
        bot.sendMessage(chatId, message);
      });
  } else {
    message = "En yakın istasyonu öğrenmek için lütfen konumunuzu paylaşın";
    bot.sendMessage(chatId, message);
  }
});

function timeAgo(millisecond) {
  var timeCompare = "";
  if (millisecond / (1000 * 60 * 60 * 24) >= 1) {
    timeCompare = `${parseInt(millisecond / (1000 * 60 * 60 * 24))} gün önce`;
  } else if (millisecond / (1000 * 60 * 60) >= 1) {
    timeCompare = `${parseInt(millisecond / (1000 * 60 * 60))} sa önce`;
  } else if (millisecond / (1000 * 60) >= 1) {
    timeCompare = `${parseInt(millisecond / (1000 * 60))} dk önce`;
  } else {
    timeCompare = `${parseInt(millisecond / 1000)} sn önce`;
  }
  return timeCompare;
}

function stationsList(data) {
  var stations = [];
  if (data && data.length > 0) {
    data.forEach((station) => {
      if (
        station.lat.length > 0 &&
        station.lon.length > 0 &&
        station.aktif == 1
      ) {
        stations.push({
          latitude: station.lat,
          longitude: station.lon,
          name: station.adi,
          id: station.guid,
          station_no: station.istasyon_no,
          is_active: station.aktif,
          empty: station.bos,
          filled: station.dolu,
          last_connection: station.sonBaglanti,
        });
      }
    });
  }
  return stations;
}
