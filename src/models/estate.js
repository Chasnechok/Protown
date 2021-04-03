const {Schema, model, ObjectId } = require("mongoose");
const { customAlphabet } = require('nanoid');
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 10);

const estateSchema = new Schema({
    _id: {
        'type': String,
        default: () => nanoid()
    },
    label: {
        type: String
    },
    agent:{
        type: String
    },
    isHidden: {
        type: Boolean
    },
    realised: {
        type: {}
    },
    type: {
        type: String
    },
    price: {
        type: Number
    },
    deal: {
        type: String
    },
    currency: {
        type: String
    },
    adress: {
        type: Object
    },
    details: {
        type: Object
    },
    extras: {
        type: Object
    },
    images: {
        type: Array
    },
    note: {
        type: String
    },
    createdAt: {
        type: Date
    }
});

export default model("Estate", estateSchema);