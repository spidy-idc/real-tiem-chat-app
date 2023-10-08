const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
});

userSchema.statics.verifyByCreds = async (username, password) => {
    const user = await userModel.findOne({username});
    if(!user)
        throw new Error('Login Failed');

    if(!await bcrypt.compare(password, user.password))
        throw new Error('Login Failed');
    
    return user;
}

userSchema.methods.generateJWTToken = async function() {
    const user = this;
    const id = user._id.toJSON();
    let token = jwt.sign({id}, process.env.JWT_SECRET);
    user.tokens.push({token});
    await user.save()
    return token;
}

userSchema.pre('save', async function(next) {
    var currentUser = this;
    if(currentUser.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;