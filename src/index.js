const express = require("express");
const sha1 = require("node-sha1");
const { getToken, sendMessage } = require("./wx");
const { getLocationKey, getCurrentCondition } = require("./weather");
const schedule = require("node-schedule");
const { getSpecialDayData } = require("./special-day");

const host = "0.0.0.0";
const port = 7500;

const app = express();

app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Metheds", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("X-Powered-By", "nodejs"); 
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get("/", async(req, res) => {
  const token = config.token;
  const signature = req.query.signature;
	const nonce = req.query.nonce; 
	const timestamp = req.query.timestamp;
  const str = [token, timestamp, nonce].sort().join('');

  const sha = sha1(str);

  if (sha === signature) {
		const echostr = req.query.echostr;
    res.send(echostr + "");
	} else {
		res.send("验证失败");
	}
});

function constructMessage(weatherInfo) {
  var weatherTips = "";
  const realTemperature = weatherInfo.RealFeelTemperature.Metric.Value;
  if ( realTemperature > 35) {
    weatherTips = "气温过高，宝贝崽注意防暑降温哟";
  } else if (realTemperature < 15) {
    weatherTips = "气温寒冷，宝贝崽注意防寒保暖哟";
  }

  if ((weatherInfo.WeatherIcon >= 12 && weatherInfo.WeatherIcon <= 18) || (weatherInfo.WeatherIcon >= 39 && weatherInfo.WeatherIcon <= 42)) {
    weatherTips += "，外面在下雨，出门记得带伞！！"
  }

  const specialDayInfo = getSpecialDayData();
  return {
    "first": {
      "value": "muaaaaa, 亲一个先😙😙",
      "color": "#EC407A"
    },
    "keyword1":{
      "value": `今天${realTemperature}度，${weatherInfo.WeatherText}`,
      "color":"#039BE5"
    },
    "keyword2":{
      "value": weatherTips,
      "color":"#039BE5"
    },
    "keyword3":{
      "value": `我们谈恋爱已经${specialDayInfo.inloveDayDiff}天啦，今天也要继续相爱呀💕🎉🌹`,
      "color":"#EC407A"
    },
    "keyword4":{
      "value": `距离你生日还有${specialDayInfo.birthdayDayDiff}天，好期待，那天我要抱着你🤗`,
      "color":"#EC407A"
    },
    "remark":{
      "value":"❤愿我如星君如月，夜夜流光相皎洁❤",
      "color":"#EC407A"
    }
  }
}

function scheduleTask() {
  let rule = new schedule.RecurrenceRule();
  rule.hour = 8;
  rule.minute = 0;
  rule.second = 0;
  let job = schedule.scheduleJob(rule, async() => {
    const location = await getLocationKey("suzhou");
    const suzhouJS = location.filter(item => item.AdministrativeArea.LocalizedName === "Jiangsu")[0];
    const weather = await getCurrentCondition(suzhouJS.Key);

    const message = constructMessage(weather[0]);
    const { access_token } = await getToken();

    await sendMessage(access_token, message);
  });
}

app.listen(port, host, () => {
  scheduleTask();
});
