var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    uniqueValidator     = require('mongoose-unique-validator');


var workshopSchema = new Schema({
    date : {
        type: String
    },
    time : {
        type: String,
        default : ""
    },
    date_sm : {
        type: String,
        default : ""
    },
    conducts : {
        type: String,
        default : ""
    },
    theme : {
        type: String,
        default : "",
        index: true
    },
    color : {
        type: String,
        default : "1288df"
    },
    bgcolor : {
        type: String,
        default : "fff"
    },
    priority : {
        type: Number,
        default : 1
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
});

workshopSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Workshop', workshopSchema);