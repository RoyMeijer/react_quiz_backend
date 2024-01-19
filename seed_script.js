var mongoose = require('mongoose');
require('./api/models/quizEvent');
require('./api/models/question');

var questionData = require('./question_data/vragen');

var dbName = 'Quizzer';
mongoose.connect('mongodb://localhost/' + dbName);

var QuizEvent = mongoose.model('QuizEvent');
var question = mongoose.model('question');
//

question.create(questionData.questions, function(err) {
    if (err) return done(err);
    done();
});

QuizEvent.remove({}, function (err) {
    if(err) return done(err);
    done();
});

function done(err) {
    if (err) console.log(err);

    mongoose.connection.close();
    console.log('All done -- bye now');
}
