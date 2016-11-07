var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema;

var sliderSchema = new Schema({
    name : {
        type: String
    },
    description : {
        type: String
    },
    image: {
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

module.exports = mongoose.model('Slider', sliderSchema);