const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token)
            throw new Error();
        id = jwt.verify(token, process.env.JWT_SECRET).id;
        const user = await User.findOne({_id: id, 'tokens.token': token});
        if(!user)
            throw new Error();
        req.user = user;
        req.token = token;
        next()
    }

    catch(e) {
        console.log(e);
    }
}

module.exports = auth;