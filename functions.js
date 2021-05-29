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

module.exports = {
  timeAgo,
  stationsList,
};
