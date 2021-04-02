const {Schema, model} = require("mongoose");

const estateSchema = new Schema({
    label: {
        type: String
    },
    agent:{
        type: String
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