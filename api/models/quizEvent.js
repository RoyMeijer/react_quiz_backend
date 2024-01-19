const mongoose = require('mongoose');
const teamSchema = require('./team');
const quizRoundSchema = require('./quizRound');
const questionsSchema = require('./question');

const quizEventSchema = new mongoose.Schema({
    name: {type: String, required: true},
    started: {type: Boolean, required: true, default: false},
    password: {type: String, required: true},
    teams: [teamSchema],
    quiz_round: [quizRoundSchema],
    question_history: [questionsSchema]
}, {
    usePushEach: true
});

//TODO: should be quizrounds instead of quizround

mongoose.model('QuizEvent', quizEventSchema);