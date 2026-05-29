
const admin = require('firebase-admin');
require('dotenv').config();

let serviceAccount;

try {
  if (!process.env.SERVICE_ACOOUNT) {
    // Esto evitará que JSON.parse rompa el servidor y te dará un log claro
    console.error("❌ ERROR CRÍTICO: La variable 'SERVICE_ACOOUNT' no está llegando al servidor.");
    process.exit(1); 
  }

  serviceAccount = JSON.parse(process.env.SERVICE_ACOOUNT);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  console.log("✅ Firebase Admin inicializado correctamente.");

} catch (error) {
  console.error("❌ Error al parsear o inicializar Firebase:", error.message);
  process.exit(1);
}

module.exports = admin;
