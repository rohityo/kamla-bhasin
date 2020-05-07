const Util = require('util');
const Schmervice = require('schmervice');
const SecurePassword = require('secure-password');
const JWT = require('jsonwebtoken');
const fs = require('fs');
const Dotenv = require('dotenv');
const _ = require('underscore');
const CONSTANTS = require('../constants');
const { OAuth2Client } = require('google-auth-library');
const {  role } = require('../config/index');

// const CONSTANTS = require('../constants');
// const sendEmail = require('../helpers/sendEmail');

Dotenv.config({ path: `${__dirname}/../.env` });

module.exports = class K_Details_Service extends Schmervice.Service {


  async findById(email, txn) {
    const { Students_details } = this.server.models();

    const user = await Students_details.query(txn).where('email',email)
    return user;
  }
  // here we are indetifying their roles 

  async verifyrole(email){
    // const { Students } = this.server.models();
    const { Admin, SuperAdmin } = role;
    email = email.trim();
    // console.log(email.length)
    if(Admin.includes(email)){
      return "Admin"
    }
    else if(SuperAdmin.includes(email)){
      return "SuperAdmin"
    }
    else{
      return "student"
    }    
}

  async findAll(txn) {
    const { Students_details } = this.server.models();
    const students_details = await Students_details.query(txn);

    return students_details;
  }

  async findbyEmail(email) {
    const { Students_details } = this.server.models();
    const student = await Students_details.query().where("email",email)
    return student
  }

  async create(details, txn=null) {
    const { Students_details } = this.server.models();

    const students_details = await Students_details.query(txn).insertGraph(details);
    return students_details;
  }

// update the users deatils if it exist in database.

async userUpdate(email, k_details, txn = null) {
  const details = k_details  
  const { Students_details } = this.server.models();

  const updateUser = await Students_details.query(txn)
    .update(details)
    .where({ email: email });
  return updateUser;
}
};