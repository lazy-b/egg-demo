'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config, middleware } = app;

  const { sign } = controller;

  const createUserLimit = middleware.createUserLimit(config.create_user_per_ip);

  // 跳转到注册页面
  router.get('/signup', sign.showSignup);
  // 提交注册信息
  router.post('/signup', createUserLimit, sign.signup);

  router.get('/signin', sign.showLogin); // 进入登录页面
};
