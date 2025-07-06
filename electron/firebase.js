var admin = require("firebase-admin");
const hashedPassword = require('crypto')

var serviceAccount = require("./serviceAccountKey.json");
const { Model } = require("firebase-admin/machine-learning");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://thulasi-sticker-kadai-default-rtdb.firebaseio.com"
});

const db = admin.database();

function signupUser(username, password) {
  const usersRef = db.ref('users');

  // Check if username already exists
  usersRef.child(username).once('value', (snapshot) => {
    if (snapshot.exists()) {
      console.log('Username already taken');
    }
    else {
      usersRef.child(username).set({
        password: password,
        createdAt: Date.now()
      }, (error) => {
        if (error) {
          console.error('Signup failed:', error);
        } else {
          console.log('User signed up successfully');
        }
      });
    }
  });
}

module.exports = { signupUser }