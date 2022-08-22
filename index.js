const express = require("express");
// const config = require("./config.json");
const crypto = require("crypto");
const request = require("request");
const sha1 = require("node-sha1");
const constant = require("./constant");

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
    const url = `https://api.weixin.qq.com/cgi-bin/token
                 ?grant_type=client_credential
                 &appid=${constant.wx.appId}
                 &secret=${constant.wx.appSecret}`;
    let option = {
      url: url,
      method: "GET",
      json: true,
      headers: {
        "content-type": "application/json"
      }
    };
    request(option, (err, resp, body) => {
      console.log("get token body", body);

      const { access_token } = body;
      sendMessage(access_token);
      resolve(body)
    });
  })
};

function sendMessage(accessToken) {
  return new Promise((resolve, reject) => {
    const url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + accessToken;
    const data = {
      touser: "owyap5vYkZT2Br-hlzThQ0f-soHk",
      template_id: "Craqa2f8DB9rqWOpn917FHLKwhEHk-J9nZAt2P-nYiU",
      data: {
        test: "eeee"
      }
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
      console.log("send message", body, err, resp);

      resolve(body);
    });
  })
}

// function getOpenId(code) {
//   const url = `https://api.weixin.qq.com/sns/oauth2/access_token?
//                appid=${config.appid}
//                &secret=${config.appsecret}
//                &code=${code}
//                &grant_type=authorization_code`;
//   request(url, (err, resp, body) => {
//     console.log("get open id", body, err, resp);

//     if (!err && resp.statusCode == 200) {
//       const openId = body.openid;
//       getToken()
//     }
//   })
// }

setTimeout(async () => {
  // token
  const { access_token } = await getToken();
}, 1000);
