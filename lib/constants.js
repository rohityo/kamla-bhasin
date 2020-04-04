const Dotenv = require('dotenv');

Dotenv.config({ path: `${__dirname}/../.env` });

module.exports = {
  valueX: 'x',
  valueY: 2,
  users: {
    jwt: {
      secret: process.env.JWT_SIGNING_SECRET,
      expiresIn: '7d',
    },
    auth: {
      googleClientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    },
  },
}