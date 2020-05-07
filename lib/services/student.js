
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

function displayUser({ password, ...user }) {
  return { ...user };
}

module.exports = class StudentService extends Schmervice.Service {

  async findById(id, txn) {
    const { Students } = this.server.models();

    const user = await Students.query(txn).throwIfNotFound().findById(id);
    return user;
  }
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
    const { Students } = this.server.models();
    const students = await Students.query(txn);

    return students;
  }

  async findbyEmail(email) {
    const { Students } = this.server.models();
    const student = await Students.query().where("email",email)
    return student
  }

  async userlogin(txn) {
    const { Students } = this.server.models();
    const students = await Students.query(txn);

    return students;
  }

  async create(details, txn=null) {
    const { Students } = this.server.models();

    const student = await Students.query(txn).insertGraph(details);
    return student;
  }

  async googleLogin(idToken, txn = null) {
    const { Students } = this.server.models();
        
    const clientId = CONSTANTS.users.auth.googleClientID;

    const client = new OAuth2Client(clientId);
    //idToken jo client ne bheja hai, usko clientId jo google ki hai
    //usko use kar kar verify karo
    const response = await client.verifyIdToken({
      idToken: idToken,
      audience: clientId,
    });

    //agar idToken sahi hai, toh response theek se aayega, aur code continue hoga
    const userObj = {
      name: response.payload.name,
      email: response.payload.email,
      profilePicture: response.payload.picture,
      googleUserId: response.payload.sub,
    };

    let user = await Students.query(txn).findOne({ email: userObj.email });
      console.log(user);
          
      if (user === undefined) {
        console.log('hello undefined');
        // user is new , register kar lo
        user = await Students.query(txn).insert(userObj);
      } else {
        // user is old, login kar lo
        console.log(`hello ${user.name}`);
        user = await Students.query(txn).updateAndFetchById(user.id, userObj);
      }
  
      return user;
   
  }

   // Create JWT token for authentication purpose.
   async createToken(user) {
     
    const JWTtoken = await JWT.sign({ id: user.id, email: user.email }, CONSTANTS.users.jwt.secret,
      {
        algorithm: 'HS256',
        expiresIn: CONSTANTS.users.jwt.expiresIn,
      });
    // console.log(JWTtoken)
    return(JWTtoken)
  }
};
