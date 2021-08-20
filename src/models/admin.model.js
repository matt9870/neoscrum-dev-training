const mongoose = require('mongoose');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
    admin_name: {
        type: String,
        required: true,
        trim: true
    },
    admin_email: {
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
        default: 'admin@neoscum'
    },
    role: {
        type: String,
        default: 'admin',
    }, //Admin
})

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;