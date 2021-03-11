const {Schema, model} = require("mongoose");

const estateSchema = new Schema({
    label: {
        type: String
    },
    agent:{
        type: String
    },
    leased: {
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
    }
});

export default model("Estate", estateSchema);