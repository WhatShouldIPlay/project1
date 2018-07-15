const express = require("express");
const userRoutes = express.Router();
const User = require("../models/User");

userRoutes.get('/', (req,res,next)=>{
  User.findById(req.user.id).populate('profilePic')
    .then(user=>{
      res.render('user/profile', {user})
    })
    .catch(err=>{
      console.log(err.message);
      next();
    })
});

module.exports = userRoutes;