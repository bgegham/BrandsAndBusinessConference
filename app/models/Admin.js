var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    uniqueValidator     = require('mongoose-unique-validator');

var adminSchema = new Schema({
    username: {
        type : String,
        unique: true,
        required: "'{PATH}' is  required."
    },
    password: {
        type : String,
        required: "'{PATH}' is  required."
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
});

adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Admin', adminSchema);