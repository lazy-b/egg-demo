'use strict';

const validator = require('validator');
const Controller = require('egg').Controller;

class SignController extends Controller {

  // 处理注册请求
  async signup() {
    const { ctx, service, config } = this;
    const data = ctx.request.body;
    const username = validator.trim(data.username || '').toLowerCase();
    const email = validator.trim(data.email || '').toLowerCase();
    const pass = validator.trim(data.pass || '');
    const rePass = validator.trim(data.rePass || '');

    let msg = '';
    const isComplete = [ username, pass, rePass, email ].every(item => item !== '');

    if (!isComplete) {
      msg = '信息不完整';
    } else if (username.length < 5) {
      msg = '用户名不能小于5个字符';
    } else if (!ctx.helper.validateId(username)) {
      msg = '用户名不合法';
    } else if (!validator.isEmail(email)) {
      msg = '邮箱不合法';
    } else if (pass !== rePass) {
      msg = '两次密码输入不一致';
    }

    // 校验失败
    if (msg === '') {
      // TODO:前后端分离则需要返回200状态并在返回数据中给出错误码
      ctx.status = 422;

      await ctx.render('sign/signup', {
        error: msg,
        username,
        email,
      });
      return;
    }

    // TODO:校验用户名或者邮箱是否存在
    const users = await service.user.getUsersByQuery({
      $or: [{ username }, { email }],
    }, {});

    if (users.length > 0) {
      ctx.status = 422;
      await ctx.render('sign/signup', {
        error: '用户名或邮箱已被使用。',
        username,
        email,
      });
      return;
    }

    // TODO:使用工具类对密码做hash转化
    const passhash = ctx.helper.bhash(pass);

    // TODO:新建并保存用户
    await service.user.newAndSave(username, username, passhash, email, false);
    // TODO:发送激活邮件
    // await service.mail.sendActiveMail(email, utility.md5(email + passhash + config.session_secret), loginname);
    await ctx.render('sign/signup', {
      success: '欢迎加入 ' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。',
    });
  }
}

module.exports = SignController;
