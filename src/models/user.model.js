const mongoose = require('mongoose');
const validator = require('validator');


const developerSchema = new mongoose.Schema({
    dev_name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    dev_email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        default: 'password'
    },
    role: {
        type: String,
        default: 'developer',
    }, //Developer
    profile_pic: [{
        filename: {type: String, required:true},
        filepath: String,
        filetype: String
    }],
    feedbacks_received: [], //stores the each feedback
    feedbacks_to_send: [] /*stores the id of feedback forms to be shared - gets updated every Friday*/
})

const Developer = mongoose.model('developer', developerSchema);

module.exports = Developer;