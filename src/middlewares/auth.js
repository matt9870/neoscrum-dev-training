const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const secretKey = require('../config/auth.config');

generateToken = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.find({ dev_email: email }, (err, user) => {
        if (err || user.length === 0) {
            res.status(400).send({
                message: `User Not Found! Check username and try again\n Error: ${err}`
            })
            return;
        }
        var passwordMatch = bcrypt.compareSync(password, user[0].password);
        if (!passwordMatch) {
            res.status(400).send({
                message: `Credentials not valid, enter correct password`
            })
            return;
        }
        var token = jwt.sign({
            name: user[0].dev_name,
            type: `engineer`
        },
        secretKey.secret, { expiresIn: 3000 });
//        secretKey.secret, { expiresIn: 3000 });
        if (!token) {
            return res.status(400).json({
                message: `User not authenticated!`,
            })
        }
        res.locals.currentUser = { name: user[0].dev_name, email: user[0].dev_email, token};
        if(user[0].role === 'admin'){
            return res.status(200).send({message:'You are the Admin and have been authorized', token});
        }
        next();
    })
}

verifyToken = async (req, res, next) => {
    let bearerToken = req.headers['authorization' || 'Authorization'];
    if (!bearerToken) {
        console.log(`no token received`);
        return res.status(403).json({
            message: "No token provided - User is not authorized!"
        })
    }
    let bearerTokenParts = bearerToken.split(' ');
    let token = bearerTokenParts[1];
    jwt.verify(token, secretKey.secret, (err, result) => {
        if (err) {
            console.log("Token invalid");
            res.status(403).json({ message: "Unauthorized", token: 'Invalid' })
            return;
        }
        else {
            res.locals.username=result.name;
            next();
        }
    })
}

const auth = { generateToken, verifyToken }

module.exports = auth;