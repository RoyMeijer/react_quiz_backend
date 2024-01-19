'use strict';

module.exports = function(app) {
  const quizEvent = require('../controllers/quizEventController');

  // quizEvent routes
  app.route('/quizevent')
	.get(quizEvent.list_all_quiz_events)
	.post(quizEvent.create_a_quiz_event);

  app.route('/currentquiz')
	.get(quizEvent.get_current_quiz);

  app.route('/quizzes')
	.post(quizEvent.join_quiz);

  app.route('/categories')
	.get(quizEvent.list_all_categories);

  app.route('/quizevents/:id/teams')
  .post(quizEvent.updateTeams)

};
