const {Schema, model} = require("mongoose");

const courseSchema = new Schema({
    courses: {
        type: Object,
        required: true
    },
    timestamp: {
        type: Date
    }
});

export default model("Course", courseSchema);