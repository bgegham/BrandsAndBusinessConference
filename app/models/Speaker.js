var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    uniqueValidator     = require('mongoose-unique-validator');

var speakerSchema = new Schema({
    tab_country : {
        type: String,
        index: true,
        default: "armenia"
    },
    name : {
        type: String,
        index: true,
        default: ""
    },
    position : {
        type: String,
        default: ""
    },
    company : {
        type: String,
        default: ""
    },
    country : {
        type: String,
        default: ""
    },
    avatar: {
        type : Schema.ObjectId
    },
    priority : {
        type : Number,
        default : 1
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
});

speakerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Speaker', speakerSchema);