import Env from '../../utils/Env';
const $ = new Env('Freenom.com');
const cookieName = 'swrich_freenomcookie';

const APP_COOKIE = $.getdata(cookieName);

// FreeNom登录地址
const LOGIN_URL = 'https://my.freenom.com/dologin.php';

// 域名状态地址
const DOMAIN_STATUS_URL = 'https://my.freenom.com/domains.php?a=renewals';

// 域名续期地址
const RENEW_DOMAIN_URL = 'https://my.freenom.com/domains.php?submitrenewals=true';

// 匹配token的正则
const TOKEN_REGEX = '/name="token"svalue="(?P<token>[^"]+)"/i';

// 匹配域名信息的正则
const DOMAIN_INFO_REGEX =
  '/<tr><td>(?P<domain>[^<]+)</td><td>[^<]+</td><td>[^<]+<span class="[^"]+">(?P<days>d+)[^&]+&domain=(?P<id>d+)"/i';

// 匹配登录状态的正则
const LOGIN_STATUS_REGEX = '/<li.*?Logout.*?</li>/i';

// 匹配无域名的正则
const NO_DOMAIN_REGEX = '/<trsclass="carttablerow"><tdscolspan="5">(?P<msg>[^<]+)</td></tr>/i';


const getCookieAndUserInfo = () => {
    const requset = {

    }
    $.post(requset)
}

!(async () => {
  if (typeof $request != 'undefined') {
    getCookie();
    return;
  }
  // await signin();
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
    });
  });
}

function status() {
  return new Promise((resolve) => {
    const statusRequest = {
      url: 'https://my.freenom.com/domains.php?a=renewals',
      headers: JSON.parse(siauthorization),
    };
    $.get(statusRequest, (error, response, data) => {
      $.log('Freenom renew response😈😈😈', JSON.stringify(response));
      resolve();
    });
  });
}

function getCookie() {
  if ($request && $request.headers) {
    console.log($request.headers);
    const headers = JSON.stringify($request.headers);
    $.setdata(headers, signauthorization);
    $.msg('Freenom', '', '获取Cookie成功🎉');
  }
}
