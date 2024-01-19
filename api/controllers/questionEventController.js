'use strict';

const mongoose = require('mongoose');
const QuestionEvent = mongoose.model('Question');
const QuizEvent = mongoose.model('QuizEvent');
const questionData = require('../../question_data/vragen');

// Helper function to get questions based on categories
const getQuestions = (categories) => {
  const sortedCategories = questionData.questions.filter(question =>
    categories.includes(question.category)
  );
  return sortedCategories;
};

exports.event_questions = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const roundId = req.params.roundId;

    const event = await QuizEvent.findById(quizId).exec();
    if (!event) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const round = event.quiz_round.find(round => round._id == roundId);
    if (!round) {
      return res.status(404).json({ message: 'Round not found' });
    }

    const questions = getQuestions(round.categories);
    const randomQuestion = [];
    
    for (let i = 0; i < 3; i++) {
      const question = questions[Math.floor(Math.random() * questions.length)];
      if (!event.question_history.some(e => e.question === question.question)) {
        randomQuestion.push(question);
      } else {
        i--;
      }
    }

    res.json({ questions: randomQuestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create_a_question_event = (req, res) => {
  const question_event = new QuestionEvent(req.body);

  question_event.save((err, event) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(event);
    }
  });
};

exports.save_current_question = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const roundId = req.params.roundId;
    const question = req.body.question;

    const event = await QuizEvent.findById(quizId).exec();
    if (!event) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const round = event.quiz_round.find(round => round._id == roundId);
    if (!round) {
      return res.status(404).json({ message: 'Round not found' });
    }

    round.current_question = {
      question: question.question,
      category: question.category,
      answer: question.answer
    };

    event.question_history.push(question);
    await event.save();

    res.json({ message: 'question saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.get_current_question = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const event = await QuizEvent.findById(quizId).exec();
    if (!event) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const round = event.quiz_round[event.quiz_round.length - 1];
    if (round) {
      res.json({
        question: round.current_question.question,
        category: round.current_question.category,
        answer: round.current_question.answer
      });
    } else {
      res.json({ message: 'no question yet' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.save_round_answer = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const teamId = req.params.teamId;
    const answer = req.body.answer;

    const event = await QuizEvent.findById(quizId).exec();
    if (!event) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const team = event.teams.find(team => team._id == teamId);
    if (team) {
      team.answer = answer;
      await event.save();
      res.json({ message: 'answer saved' });
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.get_current_answers = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const answersList = [];

    const event = await QuizEvent.findById(quizId).exec();
    if (!event) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    event.teams.forEach(team => {
      answersList.push({
        answer: team.answer,
        team_name: team.team_name,
        team_id: team._id
      });
    });

    if (answersList.length > 0) {
      res.json({ team_responses: answersList });
    } else {
      res.json({ message: 'no answers yet' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
