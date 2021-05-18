const { model, Schema } = require("mongoose");
const findOrCreate = require('mongoose-find-or-create')

const RoomSchema = new Schema({
    name: {type: String},
    members: [{
            type: String,
            required: true
        }
    ],
    ownerId: {
        type: String,
        required: true
    },
    messages: [
        {type: String}
    ],
})

RoomSchema.plugin(findOrCreate)

const Room = model('Room', RoomSchema);

module.exports.Room = Room;
module.exports.RoomSchema = RoomSchema;