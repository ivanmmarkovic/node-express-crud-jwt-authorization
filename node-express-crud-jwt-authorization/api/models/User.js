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
    this.salt = crypto.randomBytes(16).toString('hex'); 
    this.hash = crypto.pbkdf2Sync(password, this.salt,  
        1000, 64, `sha512`).toString(`hex`);
};

usersSchema.methods.updatePassword = function(password){
    this.hash = crypto.pbkdf2Sync(password, this.salt,  
        1000, 64, `sha512`).toString(`hex`);
};

usersSchema.methods.verifyPassword = function(password){
    let hash = crypto.pbkdf2Sync(password, this.salt,  
        1000, 64, `sha512`).toString(`hex`);
    return hash == this.hash;
};

mongoose.model('User', usersSchema);

