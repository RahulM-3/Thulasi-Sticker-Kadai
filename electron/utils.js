const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, './encodeKey.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const secretHex = config.SECRET_KEY


const algorithm = 'aes-256-cbc';
const secretKey = crypto.createHash('sha256').update(secretHex).digest();
const iv = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    data: encrypted
  };
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(encrypted.iv, 'hex')
  );
  let decrypted = decipher.update(encrypted.data, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

module.exports = { encrypt, decrypt }