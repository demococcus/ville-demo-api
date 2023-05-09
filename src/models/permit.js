const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema;

const permitSchema = new Schema({

    status: {
        type: Number,
        enum: [1, 2, 3],
        default: 1

    },

    geom: {
        type: {
          type: String,
          enum: ['Polygon'],
        },
        coordinates: {
          type: [[[Number]]],
        }
    },

    mapZoom: {type: Number},
    centroid: {type: Array},
    insideElements: {type: Number, default: 0},

    dateCreated: {type: Date, default: Date.now},
    dateModified: {type: Date},
    dateSubmitted: {type: Date},
    
    companyName: {type: String, minlength: 4, maxlength: 80},
    isPrivateCompany: {type: Boolean},
    certificateNumber: {type: String, uppercase: true, minlength: 10, maxlength: 10},

    firstName: {type: String, minlength: 2, maxlength: 80},
    lastName: {type: String, minlength: 2, maxlength: 80},
    phone: {type: String, minlength: 8, maxlength: 10},
    phoneExt: {type: String, maxlength: 8},
    email: {type: String, minlength: 4, maxlength: 80,
        validate(value) {
          if (value !== null && !validator.isEmail(value)) {
            throw new Error('Email is invalid')
          }
        }
    },
    
    periodStart: {type: String, minlength: 8, maxlength: 10}, 
    periodEnd: {type: String, minlength: 8, maxlength: 10}, 

    acceptA: {type: Boolean},
    acceptB: {type: Boolean},
    acceptC: {type: Boolean},
    
})



const Permit = mongoose.model('Permit', permitSchema)

module.exports = Permit