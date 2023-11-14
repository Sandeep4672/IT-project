const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/',function(req,res){
    res.render('../views/public');
});

router.get('/signup',authController.getSignup);

router.post('/signup',authController.signup);

router.get('/teacher/private',function(req,res){
    res.render('../views/teacher-private')
})

module.exports = router;