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
  } 
  catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'Signup failed: ' + error.message };
  }
}

async function signinUser(username, password) {
  const usersRef = db.ref('users');

  try {
    const snapshot = await usersRef.child(username).once('value');

    if (!snapshot.exists()) {
      return { success: false, message: 'User does not exist' };
    }

    const userData = snapshot.val();
    const hashedPassword = userData.password;

    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return { success: false, message: 'Incorrect password' };
    }

    return { success: true, message: 'Sign in successful' };
  } 
  catch (error) {
    console.error('Signin error:', error);
    return { success: false, message: 'Signin failed: ' + error.message };
  }
}

module.exports = { signupUser, signinUser }