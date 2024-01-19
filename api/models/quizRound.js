const mongoose = require('mongoose');
const questionSchema = require('./question');

const quizSchema = new mongoose.Schema({
    _id: Number,
    categories: [String],
    current_question: questionSchema
});

mongoose.model('quizRound', quizSchema);

module.exports = quizSchema;