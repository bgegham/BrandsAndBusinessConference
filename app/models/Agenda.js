var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    uniqueValidator     = require('mongoose-unique-validator');

var descriptionLeft = new Schema([
    { text : String },
    { text : String },
    { text : String },
    { text : String },
    { text : String },
    { text : String },
    { text : String },
    { text : String }
]);
var descriptionRight = new Schema([
    { text : String },
    { text : String },
    { text : String },
    { text : String },
    { text : String },
    { text : String },
    { text : String },
    { text : String }
]);
var _selfSpeakers = new Schema([
    { text : String },
    { text : String },
    { text : String },
    { text : String },
    { text : String },
    { text : String },
    { text : String },
    { text : String }
]);
var agendaSchema = new Schema({
    date : {
        type: String
    },
    label : {
        type: String,
        default : "",
        index: true
    },
    time : {
        type: String,
        default : ""
    },
    date_sm : {
        type: String,
        default : ""
    },
    descriptionLeft : descriptionLeft,
    descriptionRight : descriptionRight,
    speakers: _selfSpeakers,
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
});

agendaSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Agenda', agendaSchema);