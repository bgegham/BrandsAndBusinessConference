var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    uniqueValidator     = require('mongoose-unique-validator');


var agendaSchema = new Schema({
    date : {
        type: String
    },
    place : {
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
    description : {
        type: String,
        default : ""
    },
    color : {
        type: String,
        default : "333"
    },
    speakers: [],
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

agendaSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Agenda', agendaSchema);