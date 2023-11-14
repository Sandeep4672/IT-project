const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');



router.get('/student',function(req,res){
    res.render('../views/viewer');
});

router.get('/student/private',function(req,res){
    res.render('../views/studentPrivate')
})

router.get('/student/getStudentName',function(req,res){
    console.log("Hi");
    const userId = req.session.uid;
  const name = req.session.name;
  //console.log(req.session.name);
  const isAdmin = req.session.isAdmin;

  console.log(userId,name,isAdmin);

  // Do something with the user information
  res.json({
    userId: userId,
    name: name,
    isAdmin: isAdmin
  });
});


module.exports=router;