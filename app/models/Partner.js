var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    uniqueValidator     = require('mongoose-unique-validator');

var partnerSchema = new Schema({
    name : {
        type: String,
        index: true
    },
    link : {
        type: String
    },
    avatar: {
        type : Schema.ObjectId
    },
    priority : {
        type: Number,
        default: 1,
        index: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
});

partnerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Partner', partnerSchema);