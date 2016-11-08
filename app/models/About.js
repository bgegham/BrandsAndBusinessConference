var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    uniqueValidator     = require('mongoose-unique-validator');

var aboutSchema = new Schema({
    text1 : {
        type: String,
        default: ""
    },
    text2 : {
        type: String,
        default: ""
    },
    text3 : {
        type: String,
        default: ""
    },
    text4 : {
        type: String,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
});

aboutSchema.plugin(uniqueValidator);

module.exports = mongoose.model('About', aboutSchema);