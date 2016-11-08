var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    uniqueValidator     = require('mongoose-unique-validator');

var userSchema = new Schema({
    firstName : {
        type: String,
        index: true,
        default:""
    },
    lastName : {
        type: String,
        default:""
    },
    birthDate : {
        type: String,
        default:""
    },
    phoneNumber : {
        type: String,
        default:""
    },
    gender : {
        type: String,
        default:""
    },
    position : {
        type: String,
        default:""
    },
    position_description : {
        type: String,
        default:""
    },
    email : {
        type : String,
        default:""
    },
    ticket : {
        type : String,
        default:""
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);