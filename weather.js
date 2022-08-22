const { accuWeather } = require("./constant");
const request = require("request");
/**
 * 
 * @param {*} location eg: suzhou
 * @returns 
 */
function getLocationKey (location) {
  return new Promise((resolve, reject) => {
    const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${accuWeather.appKey}&q=${location}`;
    request(url, (err, resp, body) => {
      if (body) {
        const result = JSON.parse(body);
        resolve(result);
      }
    })
  });
}

function getCurrentCondition(locationKey) {
  return new Promise((resolve, reject) => {
    const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${accuWeather.appKey}&language=zh-cn`;
    request(url, (err, resp, body) => {
      if (body) {
        const result = JSON.parse(body);
        resolve(result);
      }
    })
  });
}

module.exports = {
  getLocationKey,
  getCurrentCondition
}