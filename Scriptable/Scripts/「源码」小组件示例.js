// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: fire;
//
// iOS 桌面组件脚本 @「小件件」
// 开发说明：请从 Widget 类开始编写，注释请勿修改
// https://x.im3x.cn
//

// 添加require，是为了vscode中可以正确引入包，以获得自动补全等功能
if (typeof require === 'undefined') require = importModule;
const { Base } = require('./「小件件」开发环境');

// @组件代码开始
class Widget extends Base {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg);
    this.name = '看看谁在偷偷掉分';
    this.logo = 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg';
    this.desc = '王者荣耀好友列表';
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render() {
    const data = await this.getData();
    switch (this.widgetFamily) {
      case 'large':
        return await this.renderLarge(data);
      case 'medium':
        return await this.renderMedium(data);
      default:
        return await this.renderSmall(data);
    }
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall(data) {
    return await this.renderMedium(data, 1);
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium(data, num = 4) {
    let listWidget = new ListWidget();
    await this.renderHeader(listWidget, this.logo, this.name);

    data
      .slice(0, num)
      .filter(
        ({
          user: {
            mainRoleInfo: { serverId },
          },
        }) => serverId
      )
      .sort((a, b) => {
        if (a.online === b.online) {
          return b.offlineTime - a.offlineTime;
        } else {
          return b.online - a.online;
        }
      })
      .map((item, index) => {
        // 数据提取
        const {
          user: {
            mainRoleInfo: { roleDesc, roleName },
          },
          online,
          offlineTime,
        } = item;
        const cell = listWidget.addStack();
        cell.centerAlignContent();
        const idx = cell.addText(String(index + 1));
        idx.font = Font.boldSystemFont(14);
        if (index === 0) {
          idx.textColor = new Color('#fe2d46', 1);
        } else if (index === 1) {
          idx.textColor = new Color('#ff6600', 1);
        } else if (index === 2) {
          idx.textColor = new Color('#faa90e', 1);
        } else {
          idx.textColor = new Color('#9195a3', 1);
        }
        cell.addSpacer(10);
        const status = online ? '在线' : offlineTime ? this.formatTimestamp(parseInt(offlineTime) * 1000) : '离线 未知';
        const text = `${roleName} ${roleDesc} ${status}`;
        // 数据填充
        const cell_text = cell.addText(text);
        cell_text.font = Font.lightSystemFont(14);
        cell_text.lineLimit = 2;
        listWidget.addSpacer();
      });
    return listWidget;
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge(data) {
    return await this.renderMedium(data, 11);
  }

  formatTimestamp(timestamp) {
    let date = new Date(timestamp);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${hours
      .toString()
      .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * 获取数据函数，函数名可不固定
   */
  async getData() {
    const req = new Request('https://kohcamp.qq.com/user/getcampfriendsbygo');
    req.method = 'POST';
    req.headers = {};
    req.body = {};

    const res = await req.loadString();
    if (res) {
      const {
        data: { userList = null },
        returnCode = null,
      } = JSON.parse(res);
      if (returnCode === 0 && userList) {
        return userList;
      }
    }
    return [];
  }

  /**
   * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
   * @param {string} url 打开的链接
   */
  async actionOpenUrl(url) {
    Safari.openInApp(url, false);
  }
}
// @组件代码结束

const { Testing } = require('./「小件件」开发环境');
await Testing(Widget);
