const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const Chat = require('../models/chat.model');


router.get('/student',function(req,res){
    res.render('../views/viewer');
});

router.get('/student/private',function(req,res){
    res.render('../views/studentPrivate')
});


router.post('/student/codeSubmission', async function (req, res) {
  const { code, username } = req.body;
  try {
    await Chat.saveCodeSubmission(username, code);
    
    const notificationMessage = `${username} submitted code.`;
    console.log("Student Routes: ",notificationMessage);
    await Chat.addNotification(username, notificationMessage);

    res.json({ success: true, message: 'Code submission saved successfully.' });
  } catch (error) {
    console.error('Error saving code submission:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});
  

router.get('/student/hasSubmittedCode', async function (req, res) {
  try {
    const username = req.session.name;
    console.log("Student Route",username);
    const hasSubmittedCode = await Chat.getNotificationsByUsername(username);

    res.json({ hasSubmittedCode: !!hasSubmittedCode });
  } catch (error) {
    console.error('Error checking code submission status:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});


router.get('/student/getStudentName',function(req,res){
    const userId = req.session.uid;
  const name = req.session.name;
  const isAdmin = req.session.isAdmin;

  console.log("Student routes",userId,name,isAdmin);

  res.json({
    userId: userId,
    name: name,
    isAdmin: isAdmin
  });
});


module.exports=router;