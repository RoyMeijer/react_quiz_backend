'use strict';

module.exports = function (app) {
    const team = require('../controllers/teamController');

    // deprecated route
    app.route('/teams')
        .get(team.getTeamsOfQuiz);

    app.route('/events/:quizId/teams/:teamId')
        .get(team.getTeam)

    app.route('/teams/:quizId')
    .get(team.getTeamsOfQuiz)
};
