const admin = require('firebase-admin');
require('dotenv').config();


// const serviceAccount = require(
//   '../serviceAccountKey.json'
// );
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT)
console.log(
  'Firebase Project:',
  serviceAccount.project_id
);

console.log(
  'Firebase Email:',
  serviceAccount.client_email
);
admin.initializeApp({
  credential:
    admin.credential.cert(
      serviceAccount
    ),
});

module.exports = admin;