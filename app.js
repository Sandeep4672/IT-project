const path = require('path');
const http = require('http');
const socketIO = require('socket.io'); 
const express = require('express');
const baseRoutes=require('./routes/baseRoutes.js')
const studentRoutes = require('./routes/studentRoutes.js');
const teacherRoutes=require('./routes/teacherRoutes.js');
const db = require('./data/database');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectAuthMiddleware=require('./middlewares/protect-auth');
const protectAdminMiddleware=require('./middlewares/protect-admin');


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
app.use(protectAuthMiddleware,studentRoutes);
app.use(protectAdminMiddleware,teacherRoutes);

app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist'));

io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('broadcastCode', (code) => {
      io.emit('codeBroadcast', code);
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
    
    socket.on('submitCode', (code) => {
      io.emit('codeSubmission', code);
    });
    socket.on('teacherFeedback', (feedback) => {
      io.emit('teacherFeedback', feedback);
    });
  });

db.connectToDatabase()
  .then(function () {
    server.listen(3000,function(req,res){
        console.log("Connected to database and server started")
    });
  })
  .catch(function (error) {
    console.log('Failed to connect to the database!');
    console.log(error);
  });
