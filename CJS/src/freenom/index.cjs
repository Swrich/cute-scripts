const { default: axios } = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));
const FormData = require('form-data');
const fs = require('fs');
const yaml = require('js-yaml');

class Freenom {
  static LOGIN_URL = 'https://my.freenom.com/dologin.php';
  static DOMAIN_INFO_URL = 'https://my.freenom.com/domains.php?a=renewals';
  static REFERER_URL = 'https://my.freenom.com/clientarea.php';
  static HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'User-Agent': Freenom.getChromeVersionUserAgent(),
  };
  static CONFIG_PATH = `${__dirname}/config.yml`;
  constructor() {
    // user's config
    this.username = '';
    this.password = '';
    this.bark = '';
  }

  async login() {
    try {
      const formData = new FormData();
      formData.append('username', this.username);
      formData.append('password', this.password);
      const { config } = await client.request({
        url: Freenom.LOGIN_URL,
        method: 'POST',
        headers: {
          ...Freenom.HEADERS,
          Referer: Freenom.REFERER_URL,
        },
        data: formData,
      });
      const cookieConfig = config.jar.toJSON();

      if (cookieConfig && cookieConfig.cookies && cookieConfig.cookies.length > 0) {
        if (cookieConfig.cookies.some(({ key, value }) => key === 'WHMCSZH5eHTGhfvzP' && value)) {
          this.Succeedog('Get login cookie succeed! ^_^');
          return true;
        } else {
          throw new Error('Get login cookie failed QAQ');
        }
      }
    } catch (error) {
      this.Errorog(error);
      return false;
    }
  }

  async getDomainInfoHtml() {
    try {
      const { data, config } = await client.request({
        url: Freenom.DOMAIN_INFO_URL,
        method: 'GET',
        headers: {
          ...Freenom.HEADERS,
          Referer: Freenom.REFERER_URL,
        },
      });
      return data || null;
    } catch (error) {
      this.Errorog(error);
      return false;
    }
  }

  parseDomainHtml(htmlStr) {
    try {
      if (!htmlStr || (htmlStr && !/<a[^>]+>Logout<\/a>/i.test(htmlStr))) {
        throw new Error(`Login information not found! \n Current username : ${this.username}`);
      }
      const domain = htmlStr.match(/(?<=<td>)[a-zA-Z0-9]+\.[a-z]{2,3}/)[0];
      const status = htmlStr.match(/(?<=<td>)Active/)[0];
      const days = htmlStr.match(/(?<=<td>\s*<span class="textgreen">)\d+ Days/)[0];
      const text = `${domain} : ${status} : ${days}`;
      this.Succeedog(text);
      return { domain, status, days, text };
    } catch (error) {
      this.Errorog(error);
      return false;
    }
  }

  async notify(title, content) {
    try {
      if (!title || !content) throw new Error('Notify Error');
      if (this.bark.endsWith('/')) {
        this.bark = this.bark.slice(0, -1);
      }
      await axios.get(`${this.bark}/${title}/${content}`);
      this.Succeedog('Send message successful');
    } catch (error) {
      console.error(error);
    }
  }

  static getChromeVersionUserAgent() {
    const uaString =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36';
    const newVersion =
      Math.floor(Math.random() * (90 - 50 + 1) + 50) +
      '.0.' +
      Math.floor(Math.random() * (4000 - 2000 + 1) + 2000) +
      '.' +
      Math.floor(Math.random() * (100 - 1 + 1) + 1);
    return uaString.replace(/Chrome\/\d+\.\d+\.\d+\.\d+/i, 'Chrome/' + newVersion);
  }

  userConfig() {
    try {
      Object.entries(yaml.load(fs.readFileSync(Freenom.CONFIG_PATH, 'utf8'))).forEach(([key, value]) => {
        this.hasOwnProperty.call(this, key) && (this[key] = value);
        if (!this[key]) throw new Error('User Config Error');
      });
      return true;
    } catch (error) {
      this.Errorog(error);
      return false;
    }
  }

  Errorog(str) {
    const title = `<<<<< Error Info >>>>>\n`;
    const end = `\n <<<<< Error Info End At ${this.getCurrentTime()} >>>>>\n`;
    console.error('\x1b[1m\x1b[31m%s\x1b[0m', `${title}${str}${end}`);
    this.notify('Error', str)
  }
  Succeedog(str) {
    const title = `<<<<< Succeed Info >>>>>\n`;
    const end = `\n<<<<< Succeed Info End At ${this.getCurrentTime()} >>>>>\n`;
    console.log('\x1b[32m%s\x1b[0m', `${title}${str}${end}`);
  }
  getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  async main() {
    if (this.userConfig() && (await this.login())) {
      const html = await this.getDomainInfoHtml();
      const { text } = this.parseDomainHtml(html);
      text && this.notify('Freenom', `${text} \n ${this.getCurrentTime()}`);
    }
  }
}

!(async function () {
  new Freenom().main();
})();
