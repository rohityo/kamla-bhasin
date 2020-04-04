
const Util = require('util');
const Schmervice = require('schmervice');
const SecurePassword = require('secure-password');
const JWT = require('jsonwebtoken');
const fs = require('fs');
const Dotenv = require('dotenv');
const _ = require('underscore');
const { OAuth2Client } = require('google-auth-library');
// const CONSTANTS = require('../constants');
// const sendEmail = require('../helpers/sendEmail');

Dotenv.config({ path: `${__dirname}/../.env` });

function displayUser({ password, ...user }) {
  return { ...user };
}

module.exports = class StudentService extends Schmervice.Service {
  async findById(id, txn) {
    const { Students } = this.server.models();

    const user = await Students.query(txn).throwIfNotFound().findById(id);
    return user;
  }

  async findAll(txn) {
    const { Students } = this.server.models();
    const students = await Students.query(txn);

    return students;
  }

  async create(details, txn=null) {
    const { Students } = this.server.models();

    const student = await Students.query(txn).insertGraph(details);
    return student;
  }
};
