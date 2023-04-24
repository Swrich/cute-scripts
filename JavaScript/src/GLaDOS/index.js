import Env from '../../utils/Env';
const $ = new Env('GLaDOS');
const signcookie = 'evil_gladoscookie';
const signauthorization = 'evil_galdosauthorization';

var sicookie = $.getdata(signcookie);
var siauthorization = $.getdata(siauthorization);
var account;
var expday;
var remain;
var remainday;
var change;
var changeday;
var msge;
var message = '';

!(async () => {
  if (typeof $request != 'undefined') {
    getCookie();
    return;
  }
  await signin();
  await status();
})()
  .catch((e) => {
    $.log('', `❌失败! 原因: ${e}!`, '');
  })
  .finally(() => {
    $.done();
  });

function signin() {
  return new Promise((resolve) => {
    const header = {
      Accept: `application/json, text/plain, */*`,
      Origin: `https://glados.rocks`,
      'Accept-Encoding': `gzip, deflate, br`,
      Cookie: sicookie,
      'Content-Type': `application/json;charset=utf-8`,
      Host: `glados.rocks`,
      Connection: `keep-alive`,
      'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1`,
      Authorization: siauthorization,
      'Accept-Language': `zh-cn`,
    };
    const body = `{ "token": "glados.network" }`;
    const signinRequest = {
      url: 'https://glados.rocks/api/user/checkin',
      headers: header,
      body: body,
    };
    $.post(signinRequest, (error, response, data) => {
      $.log(error, response, data);
      var body = response.body;
      console.log(body);
      var obj = JSON.parse(body);
      $.log(body, sicookie, siauthorization);
      if (obj.message != 'oops, token error') {
        if (obj.message != 'Please Try Tomorrow') {
          var date = new Date();
          var y = date.getFullYear();
          var m = date.getMonth() + 1;
          if (m < 10) m = '0' + m;
          var d = date.getDate();
          if (d < 10) d = '0' + d;
          var time = y + '-' + m + '-' + d;
          var business = obj.list[0].business;
          var sysdate = business.slice(-10);
          if (JSON.stringify(time) == JSON.stringify(sysdate)) {
            change = obj.list[0].change;
            changeday = parseInt(change);
            message += `今日签到获得${changeday}天`;
          } else {
            message += `今日签到获得0天`;
          }
        } else {
          message += '今日已签到';
        }
      } else {
        message += obj.message;
      }
      resolve();
    });
  });
}

function status() {
  return new Promise((resolve) => {
    const statusRequest = {
      url: 'https://glados.rocks/api/user/status',
      headers: { Cookie: sicookie },
    };
    $.get(statusRequest, (error, response, data) => {
      var body = response.body;
      var obj = JSON.parse(body);
      if (obj.code == 0) {
        account = obj.data.email;
        expday = obj.data.days;
        remain = obj.data.leftDays;
        remainday = parseInt(remain);
        message += `\n已用${expday}天,剩余${remainday}天`;
        $.msg('GLaDOS', `账户：${account}`, message);
      } else {
        $.log(response);
        $.msg('GLaDOS', '', '❌请重新登陆更新Cookie');
      }
      resolve();
    });
  });
}

function getCookie() {
  if ($request && $request.method != 'OPTIONS' && $request.url.match(/checkin/)) {
    $.log('gladosheaders:', JSON.stringify($request.headers));
    const sicookie = $request.headers['cookie'];
    $.log('gladosCookie:', sicookie);
    $.setdata(sicookie, signcookie);
    const siauthorization = $request.headers['authorization'];
    $.log('gladosAuthorization:', siauthorization);
    $.setdata(siauthorization, signauthorization);
    $.msg('GLaDOS', '', '获取签到Cookie成功🎉');
  }
}
