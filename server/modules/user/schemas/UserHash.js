const { model, Schema } = require("mongoose");
const { UserSchema } = require('./User')

const UserHashSchema = new Schema({
    user: {
        type: UserSchema,
        required: true
    },
    pwdRecoverHash: {type: String},
})

const UserHash = model('UserHash', UserHashSchema);

module.exports.UserHash = UserHash;