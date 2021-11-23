const mongoose = require('mongoose')
const id_validator = require ('mongoose-id-validator');

var SiteSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: false }
);

var TourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    start_date: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Doration must be a postive number')
            }
        }
    },
    price: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Price must be a postive number')
            }
        }
    },

    path: [SiteSchema],

    guide: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guide',
        required:true
    },
},  { timestamps: false }
);

const Tour = mongoose.model('Tour', TourSchema, "Tours");
TourSchema.plugin(id_validator);

const Site = mongoose.model('Site', SiteSchema, "Sites");
SiteSchema.plugin(id_validator);

module.exports = {Tour , Site}
