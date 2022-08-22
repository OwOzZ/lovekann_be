const express = require("express");
const sha1 = require("node-sha1");
const { getToken, sendMessage } = require("./wx");
const {  getLocationKey, getCurrentCondition } = require("./weather");

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

function constructInfo(weatherInfo) {
  return {
    "first": {
      "value": "💗亲爱的晨祎宝贝上午好💗",
      "color": "#EC407A"
    },
    "keyword1":{
      "value": `今天${weatherInfo.Temperature.Metric.Value}度，${weatherInfo.WeatherText}，要注意防暑哟`,
      "color":"#173177"
    },
    "remark":{
      "value":"今天又是爱你的一天呢",
      "color":"#EC407A"
    }
  }
}

app.listen(port, host, () => {
  // console.log(`服务器运行在http://${host}:${port}`);
});

setTimeout(async () => {
  const location = await getLocationKey("suzhou");
  const weather = await getCurrentCondition(location[0].Key);

  const message = constructInfo(weather[0]);

  const { access_token } = await getToken();
  await sendMessage(access_token, message);
}, 100);

// getLocationKey("suzhou");


// setTimeout(async () => {
//   await getToken();
// }, 100);
