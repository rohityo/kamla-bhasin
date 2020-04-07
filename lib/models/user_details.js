
// const Schwifty = require('schwifty');
const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class Students_details extends Model {
  static get tableName() {
    return 'k_details';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      name: Joi.string().required(),
      parents_name: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pin_code: Joi.string().required(),
      createdAt: Joi.date()
    });
  }

  $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
  }
};