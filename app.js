require('dotenv').config();

const { MongoClient } = require('mongodb');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const baseRoutes = require('./routes/baseRoutes.js');
const studentRoutes = require('./routes/studentRoutes.js');
const teacherRoutes = require('./routes/teacherRoutes.js');
const expressSession = require('express-session');
const db = require('./data/database');

const createSessionConfig = require('./config/session');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectAuthMiddleware = require('./middlewares/protect-auth');
const protectAdminMiddleware = require('./middlewares/protect-admin');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(checkAuthStatusMiddleware);
app.use(baseRoutes);
app.use(protectAuthMiddleware, studentRoutes);
app.use(protectAdminMiddleware, teacherRoutes);

app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('broadcastCode', (code) => {
        io.emit('codeBroadcast', code);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('submitCode', (code, studentName) => {
        console.log("Sent code");
        io.emit('codeSubmission', code);
        io.emit('notification', `${studentName} sent you a request`);
    });

    socket.on('teacherFeedback', (feedback) => {
        io.emit('teacherFeedback', feedback);
    });
});

const PORT = process.env.PORT || 3000;

db.connectToDatabase()
    .then(() => {
        server.listen(PORT, function (req, res) {
            console.log("Connected to the database and server started")
        });
    })
    .catch((error) => {
        console.log('Failed to connect to the database!');
        console.log(error);
    });
