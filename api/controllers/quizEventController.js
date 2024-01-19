const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const QuizEvent = mongoose.model('QuizEvent');
const questionData = require('../../question_data/vragen');
const Category = mongoose.model('Category');

// Helper function to get unique categories
const getUniqueCategories = () => {
  const categories = questionData.questions.map(question => question.category);
  return [...new Set(categories)];
};

exports.get_current_quiz = (req, res) => {
  if (req.session.quizEventId) {
    QuizEvent.findById(req.session.quizEventId, (err, data) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.json({ quiz: data, found: true });
      }
    });
  } else {
    return res.status(200).json({ message: 'No quiz event selected yet', found: false });
  }
};

exports.list_all_quiz_events = (req, res) => {
  QuizEvent.find({}, (err, events) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(events);
  });
};

exports.create_a_quiz_event = (req, res) => {
  const quiz_event = new QuizEvent(req.body);
  quiz_event.save((err, event) => {
    if (err) {
      return res.status(500).send(err);
    }
    req.session.quizEventId = event._id;
    return res.json(event);
  });
};

exports.list_all_categories = (req, res) => {
  const uniqueCategoryNames = getUniqueCategories();
  const categoryModels = uniqueCategoryNames.map(name => new Category({ name }));
  return res.json(categoryModels);
};

exports.join_quiz = (req, res) => {
  const { id, password, team_name } = req.body;

  QuizEvent.findById(id, (err, event) => {
    if (err) {
      return res.sendStatus(400);
    }

    if (!event) {
      return res.status(301).json({ message: 'No quiz found' });
    }

    if (event.password !== password) {
      return res.status(401).json({ error: 'Password incorrect' });
    }

    if (event.teams.some(e => e.team_name === team_name)) {
      return res.status(403).json({ error: 'Duplicate name' });
    }

    const teamId = event.teams.length;

    event.teams.push({
      _id: teamId,
      team_name: team_name,
      approved: false
    });

    event.save().then((data) => {
      res.json({
        quiz_id: data._id,
        team_id: teamId
      });
    });
  });
};

exports.updateTeams = (req, res) => {
  const id = req.params.id;

  QuizEvent.findById(id, (err, data) => {
    if (err) {
      return res.sendStatus(400);
    }

    req.body.forEach((acceptedTeam) => {
      const teamIndex = data.teams.findIndex(team => team._id == acceptedTeam.id);
      if (teamIndex !== -1) {
        data.teams[teamIndex].approved = true;
      }
    });

    data.save().then(() => {
      res.sendStatus(200);
    });
  });
};
