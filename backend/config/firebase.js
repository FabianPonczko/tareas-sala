const admin = require('firebase-admin');
require('dotenv').config();


// const serviceAccount = require(
//   '../serviceAccountKey.json'
// );
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT)
admin.initializeApp({
  credential:
    admin.credential.cert(
      serviceAccount
    ),
});

module.exports = admin;