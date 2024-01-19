const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    _id: Number,
    team_name: {type: String, required: true},
    approved: {type: Boolean, required: true},
    answer: String,
    round_points: {type: Number, default: 0},
    correct_answers: {type: Number, default: 0}
});

mongoose.model('Team', teamSchema);

module.exports = teamSchema;