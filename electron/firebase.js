var admin = require("firebase-admin");
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

var serviceAccount = require("./serviceAccountKey.json");
const { Model } = require("firebase-admin/machine-learning");

// initialize app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://thulasi-sticker-kadai-default-rtdb.firebaseio.com"
});

// connect database
const db = admin.database();

// signup user function
async function signupUser(username, password) {
  const usersRef = db.ref('users'); // ref user

  try {
    // check if user exitsts
    const snapshot = await usersRef.child(username).once('value');

    if (snapshot.exists()) {
      return { success: false, message: 'Username already taken' };
    }

    // check if password is smaller than 6 char
    if(password.length < 6)
    {
      return { success: false, message: 'Password should be 6 character long' };
    }

    // hash password and upload to database
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await usersRef.child(username).set({
      password: hashedPassword,
      createdAt: Date.now(),
      lastOnline: Date.now()
    });

    return { success: true, message: 'Signup successful' };
  }
  catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'Signup failed: ' + error.message };
  }
}

// signin user function
async function signinUser(username, password) {
  const usersRef = db.ref('users'); // ref user

  try {
    // check if user exists
    const snapshot = await usersRef.child(username).once('value');

    if (!snapshot.exists()) {
      return { success: false, message: 'User does not exist' };
    }

    // check password
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

// start new chat function
async function startNewChat(username, yourusername) {
  try {
    const snapshot = await db.ref('users').child(username).once('value'); // user ref
    
    // chat ref
    const chat1 = await db.ref('chats').child(username+yourusername).once('value');
    const chat2 = await db.ref('chats').child(yourusername+username).once('value');

    // check if user exists
    if (!snapshot.exists()) {
      return { success: false, message: 'User does not exist' };
    }
    // check if chat exists
    else if(chat1.exists() || chat2.exists()) {
      // update chat
      await db.ref(`users/${yourusername}/chats`).update({
        [yourusername + username]: Date.now()
      });

      return { success: true, message: 'chat already exits'};
    }
    // create new chat
    else {
      // init chat
      await db.ref('chats').child(yourusername+username).set({
        "participants" : {
          "user1" : yourusername, "user2":username
        },
        "messages" : {
          "root" : "Chat Created at " + new Date().toLocaleString()
        }
      });

      // update chat in users profile
      await db.ref(`users/${yourusername}/chats`).update({
        [yourusername + username]: Date.now()
      });

      await db.ref(`users/${username}/chats`).update({
        [yourusername + username]: Date.now()
      });

      return { success: true, message: 'new chat created' };
    }
  }
  catch (error) {
    console.error('New chat error:', error);
    return { success: false, message: 'New chat failed ' + error.message };
  }
}

// get recent chat function
async function getRecentChat(yourusername) {
  try {
    const snapshot = await db.ref(`users/${yourusername}/chats`).once('value'); // user chat ref

    if (!snapshot.exists()) {
      return []; // No chats found
    }

    const chats = snapshot.val();

    // Sort chat entries by timestamp (descending)
    const sortedChatsId = Object.entries(chats)
      .sort((a, b) => b[1] - a[1]) // Sort by timestamp
      .map(([chatId]) => chatId);  // Return only the chat IDs

    // get recent chat username
    const recentChats = []
    for (const chatId of sortedChatsId) {
      const snapshot = await db.ref(`chats/${chatId}/participants`).once('value');
      const participants = snapshot.val();

      if (!participants) continue;

      if (participants.user1 !== yourusername) {
        recentChats.push(participants.user1);
      }
      else if (participants.user2 !== yourusername) {
        recentChats.push(participants.user2);
      }
    }
    return recentChats;
  }
  catch (error) {
    console.error("Error fetching recent chats:", error);
    return [];
  }
}

// update last online
async function lastOnline(username) {
  try {
    const userRef = await db.ref(`users/${username}/lastOnline`);
    userRef.set(Date.now());
    return { success: true };
  }
  catch (error) {
    console.error('Last online update error ', error);
    return { success: false, message: 'Last online update failed ' + error.message };
  }
}

// get info about recent chat user
async function getChatUserInfo(yourUsername, chatUsername) {
  try {
    const userRef = await db.ref(`users/${yourUsername}`);
    const snapshot = await db.ref(`users/${chatUsername}/lastOnline`).once('value');
    const recentChatUserLastOnline = snapshot.val();

    const info = { userName: chatUsername, userlastOnline: recentChatUserLastOnline };
    return info;
  }
  catch(error) {
    console.error('Recent Chat user Info error ', error);
    return { success: false, message: 'Recent Chat user Info failed ' + error.message };
  }
}

module.exports = { signupUser, signinUser, startNewChat, 
                    getRecentChat, lastOnline, getChatUserInfo }