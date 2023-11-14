const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


router.get('/login',authController.getLogin);

router.post('/login',authController.login);

router.post('/logout', authController.logout);


router.get('/401', function(req, res) {
    res.status(401).render('401');
  });
  
  router.get('/403', function(req, res) {
    res.status(403).render('403');
});

module.exports=router;