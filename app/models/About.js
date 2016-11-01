var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    uniqueValidator     = require('mongoose-unique-validator');

var aboutSchema = new Schema({
    text : {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
});

aboutSchema.plugin(uniqueValidator);

module.exports = mongoose.model('About', aboutSchema);