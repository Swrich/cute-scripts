const { default: axios } = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
};

const LOGIN_URL = 'https://my.freenom.com/dologin.php';
const DOMAIN_INFO_URL = 'https://my.freenom.com/domains.php?a=renewals';

function login() {
  const formData = new FormData();
  formData.append('username', '');
  formData.append('password', '');
  client
    .request({
      url: LOGIN_URL,
      method: 'POST',
      headers: {
        ...HEADERS,
        Referer: 'https://my.freenom.com/clientarea.php',
      },
      data: formData,
    })
    .then(({ config }) => {
      console.log(config.jar.toJSON());
      console.log(jar);
      //   getDomainInfo()
    });
}
login()
function getDomainInfo() {
  client
    .request({
      url: DOMAIN_INFO_URL,
      method: 'GET',
      headers: {
        ...HEADERS,
        Referer: 'https://my.freenom.com/clientarea.php',
      }
    })
    .then(({ config, data }) => {
      console.log(config.jar.toJSON());
      console.log(data);
    });
}

module.exports = {
  login,
};
