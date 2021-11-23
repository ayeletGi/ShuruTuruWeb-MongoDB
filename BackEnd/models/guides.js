const mongoose = require('mongoose')
const validator = require('validator')

var GuideSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    cellular: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    }
}, { timestamps: false }
);

const Guide = mongoose.model('Guide', GuideSchema, "Guides");

module.exports = Guide