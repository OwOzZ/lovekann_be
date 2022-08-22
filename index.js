const express = require("express");
const config = require("./config.json");
const crypto = require("crypto");
const request = require("request");
const sha1 = require("node-sha1");

const router = express.Router();

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

app.listen(port, host, function() {
  console.log(`服务器运行在http://${host}:${port}`);
});

function getToken () {
  return new Promise((resolve, reject) => {
    const url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + appSecret + "";
    let option = {
      url: url,
      method: "GET",
      json: true,
      headers: {
        "content-type": "application/json"
      }
    };
    request(option, (err, resp, body) => {
      // console.log("token")
      resolve(body)
    });
  })
};

function sendMessage(accessToken) {
  return new Promise((resolve, reject) => {
    const url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + accessToken;
    const data = {
      value: 'ddddd'
    };
    let option = {
      url: url,
      method: "POST",
      json: true,
      body: data,
      headers: {
        "content-type": "application/json",
      }
    };
    request(option, (err, resp, body) => {
      resolve(body);
    });
  })
}

setTimeout(async () => {
  // token
  const { access_token } = await getToken();
  const msgRes = await sendMessage(access_token);
  console.log("msgRes", msgRes);
}, 1000);

// router.post("/", async(req, resp, next) => {
//   const { access_token } = await getToken();
//   const msgRes = await sendMessage(access_token);
//   resp.sendResult(msgRes, 200, "登录成功");
// });