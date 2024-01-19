'use strict';

const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const QuizEvent = mongoose.model('QuizEvent');

exports.saveRound = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const event = await QuizEvent.findById(quizId);

    if (!event) {
      return res.status(404).json({ message: 'No quiz found' });
    }

    const roundId = event.quiz_round.length;
    event.quiz_round.push({
      "_id": roundId,
      "categories": req.body.categories
    });

    await event.save();
    res.json({ "roundId": roundId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approve_answers = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const correctTeams = req.body.correct_teams;
    const event = await QuizEvent.findById(quizId);

    if (!event) {
      return res.status(404).json({ message: 'No quiz found' });
    }

    event.teams.forEach((team) => {
      if (correctTeams.includes(String(team._id))) {
        team.correct_answers++;
      }
    });

    await event.save();
    res.json({ 'message': 'answers approved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.closeRound = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const roundId = req.params.roundId;
    const event = await QuizEvent.findById(quizId);

    if (!event) {
      return res.status(404).json({ message: 'No quiz found' });
    }

    event.teams.sort((a, b) => b.correct_answers - a.correct_answers);

    for (let i = 0; i < event.teams.length; i++) {
      if (i === 0) {
        event.teams[i].round_points += 4;
      } else if (i === 1) {
        event.teams[i].round_points += 2;
      } else if (i === 2) {
        event.teams[i].round_points += 1;
      } else if (i > 2) {
        event.teams[i].round_points += 0.1;
      }
      event.teams[i].correct_answers = 0;
    }

    await event.save();
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
