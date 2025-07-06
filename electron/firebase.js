var admin = require("firebase-admin");
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

var serviceAccount = require("./serviceAccountKey.json");
const { Model } = require("firebase-admin/machine-learning");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://thulasi-sticker-kadai-default-rtdb.firebaseio.com"
});

const db = admin.database();

async function signupUser(username, password) {
  const usersRef = db.ref('users');

  try {
    const snapshot = await usersRef.child(username).once('value');

    if (snapshot.exists()) {
      return { success: false, message: 'Username already taken' };
    }

    if(password.length < 6)
    {
      return { success: false, message: 'Password should be 6 character long' };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await usersRef.child(username).set({
      password: hashedPassword,
      createdAt: Date.now()
    });

    return { success: true, message: 'Signup successful' };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'Signup failed: ' + error.message };
  }
}

async function signinUser(username, password) {
  
}

module.exports = { signupUser }