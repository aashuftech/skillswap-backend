const mongoose =  require('mongoose');
const { Schema } = mongoose;

const SkillSchema = new mongoose.Schema({
    name: String,
    offer: String,
})

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    skills: [SkillSchema],
}) 

module.exports = mongoose.model('user', UserSchema);