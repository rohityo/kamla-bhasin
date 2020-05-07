
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
      email: Joi.string().required(),
      profilepicture: Joi.string().required(),
      googleuserid: Joi.string().required(),
      center: Joi.string(),
      githublink: Joi.string(),
      linkedinlink: Joi.string(),
      mediumlink: Joi.string(),
      Admin: Joi.boolean(),
      SuperAdmin: Joi.boolean()
    });
  }

  $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
  }
};
