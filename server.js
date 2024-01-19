require('./api/models/quizEvent');
require('./api/models/category');
require('./api/models/question');
const port = process.env.PORT || 8080;
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors({origin: true, credentials: true}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 7 * 24 * 60 * 60 * 1000}
    })
);

io.on('connection', function connection(socket) {
    socket.on('CreateQuizEvent', function () {
        io.emit('UpdateQuizEvent');
    });
    socket.on('ApprovedTeams', function () {
        io.emit('TeamsAccepted');
    });
    socket.on('JoinQuiz', function () {
        io.emit('RefreshTeams');
    });
    socket.on('SendQuestion', function () {
        io.emit('RefreshQuestion');
    });
    socket.on('SendAnswer', function (data) {
        io.emit('RefreshTeamAnswers', data);
    });
    socket.on('CloseQuestion', function (data) {
        io.emit('QuestionClosed', data);
    });
    socket.on('HandleAnswers', function (data) {
        io.emit('RefreshAnswers', data);
    });
    socket.on('EndQuiz', function () {
        io.emit('EndQuiz');
    });
});

require('./api/routes/quizEventRoutes')(app);
require('./api/routes/teamRoutes')(app);
require('./api/routes/QuestionEventRoutes')(app);

const mongoose = require('mongoose');
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Quizzer', { useMongoClient: true });

server.listen(port);
// exports.ios = io;