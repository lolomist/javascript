const { model, Schema } = require("mongoose");
const { User } = require('../../user/schemas/User');
const findOrCreate = require('mongoose-find-or-create')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {type: String},
    username: {type: String},
    date: {
        type: Date,
        default: Date.now
    },
    local: {
        type: Boolean,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    }
})

UserSchema.plugin(findOrCreate)

const User = model('User', UserSchema);

module.exports.User = User;
module.exports.UserSchema = UserSchema;