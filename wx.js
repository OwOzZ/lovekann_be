const request = require("request");
const { wx } = require("./constant");

/**
 * 获取token
 * @returns 
 */
function getToken () {
  return new Promise((resolve, reject) => {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wx.appId}&secret=${wx.appSecret}`;
    let option = {
      url: url,
      method: "GET",
      json: true,
      headers: {
        "content-type": "application/json"
      }
    };
    request(option, (err, resp, body) => {
      resolve(body);
    });
  })
}

/**
 * 发送模版消息
 * @param {*} accessToken 
 * @returns 
 */
function sendMessage(accessToken, message) {
  return new Promise((resolve, reject) => {
    const url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + accessToken;
    const data = {
      touser: "owyap5vYkZT2Br-hlzThQ0f-soHk",
      template_id: "UlDupLN7oYNkT1e4ZnLiV4G4T6lGlMMmDVj4jpLprVM",
      data: message
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
    }
  )
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

module.exports = {
  getToken,
  sendMessage
}