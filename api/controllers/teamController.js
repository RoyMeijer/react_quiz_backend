'use strict';

const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const QuizEvent = mongoose.model('QuizEvent');

exports.createTeam = async (req, res) => {
  try {
    const team = new Team(req.body);
    const savedTeam = await team.save();

    req.session.teamdata = { teamId: savedTeam._id, team_name: savedTeam.team_name };

    res.json(savedTeam);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTeamsOfQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quizEvent = await QuizEvent.findById(quizId);

    if (!quizEvent) {
      return res.status(404).json({ message: 'No quiz found' });
    }

    res.json(quizEvent.teams);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTeam = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const teamId = req.params.teamId;

    const quizEvent = await QuizEvent.findById(quizId);

    if (!quizEvent) {
      return res.status(404).json({ message: 'No quiz found' });
    }

    const team = quizEvent.teams.find(team => team._id === teamId);

    if (team) {
      res.json(team);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
