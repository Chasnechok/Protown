const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    agentIdentifier: {
        type: String,
        required: true,
        max: 20
    },
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    password: {
        type: String,
        required: true,
        min: 12,
        max: 1024
    },
    fullName: {
        type: String
    },
    photoLink: {
        type: String
    },
    mobile: {
        type: String
    }
});

export default model("User", userSchema);