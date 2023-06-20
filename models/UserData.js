const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
    info: {
        type: Object,
        required: true
    },
    userAgent: {
        type: String
    }
});

module.exports = mongoose.model("UserData", userDataSchema);