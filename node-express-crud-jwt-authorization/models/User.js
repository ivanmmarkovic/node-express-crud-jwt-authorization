const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});


UserSchema.pre('save', function(next){
    let user = this;
    bcrypt.hash(user.password, 3, (err, hash) => {
        user.password = hash;
        next();
    });
});


const UserModel = mongoose.model("UserModel", UserSchema);
module.exports = UserModel;