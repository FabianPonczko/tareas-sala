const admin = require('firebase-admin');
require('dotenv').config();


// const serviceAccount = require(
//   '../serviceAccountKey.json'
// );
const serviceAccount = JSON.parse(process.env.SERVICE_ACOOUNT)

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential:
    admin.credential.cert(
      serviceAccount
    ),
});

module.exports = admin;