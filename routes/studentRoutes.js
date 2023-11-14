const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');



router.get('/student',function(req,res){
    res.render('../views/viewer');
});

router.get('/student/private',function(req,res){
    res.render('../views/studentPrivate')
})


module.exports=router;