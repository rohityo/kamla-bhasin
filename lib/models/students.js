
// const Schwifty = require('schwifty');
const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class Students extends Model {
  static get tableName() {
    return 'users';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      name: Joi.string().required(),
      mobile: Joi.string().required(),
      createdAt: Joi.date(),
    });
  }

  $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
  }
};
