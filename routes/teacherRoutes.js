const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

const Chat = require('../models/chat.model');

router.get('/',function(req,res){
    res.render('../views/public');
});

router.get('/signup',authController.getSignup);

router.post('/signup',authController.signup);

router.get('/teacher/private', async function (req, res) {
    try {
      const studentName = req.query.student;
      const code = await Chat.getCodeSubmissionsByUsername(studentName);
      console.log(code);
      res.render('../views/teacher-private', { studentName, code });
    } catch (error) {
      console.error('Error retrieving code from the database:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });

module.exports = router;