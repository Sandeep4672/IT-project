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

const Chat = require('./models/chat.model');

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

const studentSocketIds = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('registerStudent', (studentName) => {
        studentSocketIds[studentName] = socket.id;
        console.log("hhh",studentSocketIds);
    });

    socket.on('broadcastCode', (code) => {
        io.emit('codeBroadcast', code);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('submitCode', (code, studentName) => {
        console.log("Sent code",studentName);
        const notification = {
            username: studentName,
            message: `${studentName} sent you a request`
        };
    
        io.emit('codeSubmission', code);
        io.emit('notification', notification);
        console.log('Notification emitted:');
        
    });

    socket.on('teacherFeedback', ({ feedback, studentUsername }) => {
        console.log("GMM", studentUsername);
    
        const studentSocketId = studentSocketIds[studentUsername];
        console.log(studentSocketIds);
        console.log("Hmm", studentSocketId);
    
        if (studentSocketId) {
            io.to(studentSocketId).emit('teacherFeedback', feedback);
        }
   
    });


    socket.on('deleteNotification', ({ studentName }) => {
        Chat.deleteNotificationByUsername(studentName);
        io.emit('notificationDeleted', { studentName });
    });

    socket.on('sendHighlightedCode', (highlightedCode,studentUsername) => {
        const studentSocketId = studentSocketIds[studentUsername];
        if (studentSocketId) {
            io.to(studentSocketId).emit('highlightedCodeToStudents', highlightedCode);
        }
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