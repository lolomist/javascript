const { model, Schema } = require("mongoose");
const findOrCreate = require('mongoose-find-or-create')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {type: String},
    username: {type: String},
    friends: [{type: String}],
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
    },
    pending: {
        type: String,
        default:true
    }
})

UserSchema.plugin(findOrCreate)

const User = model('User', UserSchema);

module.exports.User = User;
module.exports.UserSchema = UserSchema;