const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: String,
    image: String,
    specialization: {
        type: String,
        unique: true
    },
});

const doctor = model('doctor', userSchema);

module.exports = doctor;
