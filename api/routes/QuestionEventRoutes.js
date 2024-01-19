'use strict';

module.exports = function(app) {
  const questionEvent = require('../controllers/questionEventController');
  const round = require('../controllers/RoundController');

  // quizEvent routes
  app.route('/events/:quizId/rounds/:roundId/questions')
	.get(questionEvent.event_questions)
	.post(questionEvent.save_current_question);
  app.route('/events/:quizId/rounds/currentquestions')
	.get(questionEvent.get_current_question);
  app.route('/events/:quizId/rounds')
	.post(round.saveRound);
  app.route('/events/:quizId/teams/:teamId')
	.post(questionEvent.save_round_answer);
  app.route('/events/:quizId/answers').
	get(questionEvent.get_current_answers);
  app.route('/events/:quizId/answers')
	.post(round.approve_answers);
    app.route('/events/:quizId/closedrounds/:roundId')
    .get(round.closeRound)
};
