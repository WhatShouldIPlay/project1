const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const Picture = require("../models/Picture");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const multer = require('multer');
const upload = require("../cloudinaryConfig/cloudinary.js");


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/user/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", upload.single('profilePic'), (req, res, next) => {
  const {username, password, email, age } = req.body;
  
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    console.log(req)
    const newPic = new Picture({
      filename: req.file.originalname,
      path: `/uploads/${req.file.filename}`
    })
  
    const newUser = new User({
      username,
      password: hashPass,
      email,
      age,
      profilePic: newPic
    });

    newPic.save()
      .then(()=>{
        newUser.save()
          .then(()=>{
            res.redirect("/auth/login");
          })
      })
      .catch(err=>{
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//Google social login
authRoutes.get("/google", passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

authRoutes.get("/google/callback", passport.authenticate("google", {
  successRedirect: "/user/profile",
  failureRedirect: "/"
}));


module.exports = authRoutes;
