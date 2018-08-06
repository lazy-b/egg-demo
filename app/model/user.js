'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  // 先列一些暂时想到的字段
  const UserSchema = new Schema({
    // 用户名
    username: { type: String },
    // 登录密码
    pass: { type: String },
    // 用户邮箱
    email: { type: String },

    // 用户等级
    level: { type: String },
    // 用户积分
    score: { type: Number, default: 0 },

    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
  });

  UserSchema.index({ loginname: 1 }, { unique: true });
  UserSchema.index({ email: 1 }, { unique: true });
  UserSchema.index({ score: -1 });

  // 保存之前设置更新时间
  UserSchema.pre('save', function(next) {
    const now = new Date();
    this.update_at = now;
    next();
  });

  return mongoose.model('User', UserSchema);
};
