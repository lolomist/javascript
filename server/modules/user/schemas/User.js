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
    rooms: [{
        roomName: {
            type: String,
            required: true
        },archived: {
            status: {
                type: Boolean,
                required: true
            },
            message: [{
                date: {
                    type: String,
                },user: {
                    type: String,
                },message: {
                    type: String,
                }
            }]
        }}
    ],
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
    }
})

UserSchema.plugin(findOrCreate)

const User = model('User', UserSchema);

module.exports.User = User;
module.exports.UserSchema = UserSchema;