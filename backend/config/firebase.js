const admin = require('firebase-admin');
require('dotenv').config();


// const serviceAccount = require(
//   '../serviceAccountKey.json'
// );
const serviceAccount = process.env.SERVICE_ACOOUNT
admin.initializeApp({
  credential:
    admin.credential.cert(
      serviceAccount
    ),
});

module.exports = admin;