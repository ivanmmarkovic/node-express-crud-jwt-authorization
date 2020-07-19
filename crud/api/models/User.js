const mongoose = require('mongoose');
const crypto = require('crypto');

const usersSchema = new mongoose.Schema({
    id: String,
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    salt: String,
    hash: String
});

usersSchema.methods.setPassword = function(password){
    // Creating a unique salt for a particular user 
    this.salt = crypto.randomBytes(16).toString('hex'); 
  
    // Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest 
    this.hash = crypto.pbkdf2Sync(password, this.salt,  
    1000, 64, `sha512`).toString(`hex`); 
};

usersSchema.methods.verifyPassword = function(password, userSalt, userHash){
    const hash = crypto.pbkdf2Sync(password,  
        userSalt, 1000, 64, `sha512`).toString(`hex`); 
    return userHash == hash; 
};

usersSchema.methods.updatePassword = function(newPassword, userSalt){
    let hash = crypto.pbkdf2Sync(password, this.salt,  
        1000, 64, `sha512`).toString(`hex`);  
    return hash;
};

mongoose.model('User', usersSchema);