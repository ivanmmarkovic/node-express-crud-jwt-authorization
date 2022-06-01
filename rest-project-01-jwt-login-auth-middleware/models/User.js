const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type:String,
        unique: true
    },
    email: {
        type:String,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    createdAt: {
        type:Date
    },
    updatedAt: {
        type:Date
    }
});


const UserModel = mongoose.model('UserModel', UserSchema);
module.exports = UserModel;