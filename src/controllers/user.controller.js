const userModel = require('../models/user.model');
const timeDuration = require('../helpers/msToDays.helper');
var generator = require('generate-password');
const bcrypt = require('bcrypt');
const sendWelcomeEmail = require('../emails/sendEmail');
const config = require('../config/default.json');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.APP.EMAIL_CONFIG.EMAIL,
        pass: config.APP.EMAIL_CONFIG.PASSWORD,
    },
});

//main controllers
exports.generatePassword = async (req, res, next) => {
    var password = generator.generate({
        length: 8
    });
    res.locals.newUserPassword = password;
    res.locals.newUserPasswordHashed = await bcrypt.hash(password, 8);
    next()
}

exports.createUser = async (req, res) => {
    try {
        const profilePicProps = req.file;
        if (profilePicProps === `Error`) {
            res.status(400).send({ message: "Upload an image in jpeg/jpg/png format" });
            return;
        }
        userModel.find({ dev_name: res.locals.username }, (err) => {
            if (err || !req.body) {
                res.status(400).send({ message: "Need to provide details to create a user" })
                return;
            }
        }).then(async data => {
            try {
                if (data[0].role === 'admin') {

                    const user = new userModel({
                        dev_name: req.body.name,
                        dev_email: req.body.email,
                        password: res.locals.newUserPasswordHashed,
                        profile_pic: [{
                            filename: profilePicProps.filename,
                            filepath: profilePicProps.destination,
                            filetype: profilePicProps.mimetype
                        }]
                    });

                    res.locals.newUserPasswordHashed = '';

                    var mailOptions = {
                        from: config.APP.EMAIL_CONFIG.EMAIL,
                        to: req.body.email,
                        subject: "Welcome to Neoscrum",
                        html: `<h2>You have been succesfully registered in Neoscrum Application<h2>
                              <h3>Congrats ${req.body.name} <br>You are now part of our Development Team </h3>
                              <h4>Please find below your credentials to sign in</h4>
                              <p>username : ${req.body.email} <br/> password : ${res.locals.newUserPassword}</p>
                              <p>Use this link to login: http://localhost:3000/login<p>`,
                    };

                    let emailStatus = 'Welcome email was not sent'

                    user.save(user).then(async data => {
                        try {
                            console.log(`email - ${req.body.email} password - ${res.locals.newUserPassword}`);
                            res.locals.newUserPassword = '';

                            let info = await transporter.sendMail(mailOptions);
                            if (info) emailStatus = 'Welcome email sent successfully'

                            res.status(201).send({
                                message: 'User created',
                                username: data.dev_name,
                                email: data.dev_email,
                                emailStatus
                            });
                        } catch (error) {
                            console.log(error);
                            res.status(400).send({ error, msg: `error while saving user data` })
                        }
                    }).catch(err => {
                        res.status(400).send({
                            message: err.message || "Error occurred"
                        });
                    });
                }
                else {
                    res.status(400).send({ msg: 'you are not the admin to create a user' })
                }
                return;
            } catch (error) {
                console.log(error);
                res.status(400).send({ error, msg: `error while sending email` })
            }
        })
    } catch (error) {
        console.log(err);
        res.status(400).send({ error, msg: `Couldn't find user ` })
    }
}

exports.login = async (req, res) => {
    const user = res.locals.currentUser;
    if (!user) {
        return res.status(400).send({ msg: 'no user found' })
    }
    return res.status(200).send({ msg: 'user found', user });
}

exports.getUserDashboard = async (req, res) => {
    userModel.find({ dev_name: res.locals.username }, (err) => {
        if (err) {
            console.log(err);
        }
    }).then(data => {
        res.status(200).send({
            username: data[0].dev_name,
            feedbacksReceived: data[0].feedbacks_received,
            email: data[0].dev_email,
            file: `images/${data[0].profile_pic[0].filename}`
        })
    }).catch(err => {
        res.status(400).send({ err })
    });
}

exports.logout = async (req, res) => {
    const message = 'Logging out';
    res.status(200).send({
        message
    })
}

//other controllers
exports.getAllUsers = async (req, res) => {
    //finding the logged in user and checking for admin role
    userModel.find({ dev_name: res.locals.username }, (err) => {
        if (err) {
            res.status(400).send({ message: "error while finding the logged in user" })
            return;
        }
    }).then(data => {
        if (data.length === 0) {
            res.status(400).send({ message: "error while finding the logged in user" })
            return;
        }
        else if (data[0].role === 'admin') {
            userModel.find({}, (err) => {
                if (err) {
                    res.status(400).send({ err });
                    return;
                }
            }).then(data => {
                res.status(200).send({
                    message: ` ${data.length} Users retrieved`,
                    data
                })
            }).catch(err => {
                res.status(400).send({
                    message: err.message || 'Some error occurred while getting users'
                })
            })
        }
        else {
            //returning error message since logged in user is not admin
            res.status(400).send({ msg: 'you are not the admin to create a user' })
        }
        return;
    })
}

exports.findUser = async (req, res) => {
    const email = req.body.email;
    userModel.find({ dev_email: email }, (err, user) => {
        if (err || user.length === 0) {
            res.status(400).send({
                message: `User Not Found!\n Error: ${err}`
            })
            return;
        }
        var feedbackRes;
        const no_feedbacks = user[0].feedbacks_received.length;
        if (no_feedbacks === 0) {
            feedbackRes = 'No feedbacks found'
        }
        else {
            const feedbacks = user[0].feedbacks_received;
            feedbackRes = [];
            for (let i = 0; i < no_feedbacks; i++) {
                feedbackRes.push({
                    sender_name: feedbacks[i].sender_name,
                    duration: timeDuration(Date.now() - feedbacks[i].createdAt),
                    message: feedbacks[i].feedback
                })
            }
            console.log(`response sent to frontend - ${feedbackRes}`);
        }

        res.status(200).send({
            message: 'User found along with feedbacks received',
            username: user[0].dev_name,
            feedbackRes
        })
    })
}

exports.uploadPicture = async (req, res) => {
    console.log('in controller - the file got from multer', req.file);
    //const fileProps = req.file;
    //console.log(`Path - ${fileProps.destination}\nFilename - ${fileProps.filename}\nFiletype - ${fileProps.mimetype}`);
    res.status(200).send();
    // res.status(200).send({
    //     path: fileProps.destination,
    //     filename: fileProps.filename,
    //     filetype: fileProps.mimetype
    // });
}

/*
exports.deleteUser = async (req, res) => {
    const username = req.body.name;
    userModel.deleteOne()
}
exports.deleteAllUsers = async (req, res) => {
    userModel.deleteMany()
}
*/
