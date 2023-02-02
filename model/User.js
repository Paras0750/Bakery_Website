const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        // required: true,
    },
    salt: {
        type: String,
        // required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    orders: []
});

module.exports = mongoose.model("User", UserSchema);