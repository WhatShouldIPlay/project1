const express = require("express");
const userRoutes = express.Router();
const User = require("../models/User");

// READ User

userRoutes.get('/profile', (req,res,next)=>{
  User.findById(req.user.id).populate('profilePic')
    .then(user=>{
      res.render('user/profile', {user})
    })
    .catch(err=>{
      console.log(err.message);
      next();
    })
});

// Read All Users

userRoutes.get('/list', (req, res, next)=>{
  User.find({}).populate('profilePic')
    .then(users=>{
      res.render('user/list', {users})
    })
    .catch(err=>{
      console.log(err.message);
      next();
    });
})

// Read user by Id

userRoutes.get('/:id', (req, res, next)=>{
  User.findById(req.params.id).populate('profilePic')
    .then(user=>{
      res.render('user/profile', {user});
    })
    .catch(err=>{
      console.log(err.message);
      next();
    });
})

// Delete one User

userRoutes.post('/', (req, res, next)=>{
  if(confirm('You are going to delete your user, are you sure?')){
    User.deleteOne(req.user._id)
      .then(()=>{
        res.redirect('/');
      })
      .catch(err=>{
        console.log(err.message);
        next();
      });
  } else {
    res.redirect('/user/')
  }
});

// GET page to update one User

userRoutes.get('/user/profile/edit', (req, res, next)=>{
  User.findById(req.user._id)
    .then(user=>{
      res.render('user/edit', {user});
    })
    .catch(err=>{
      console.log(err.message);
      next();
    });
});

// POST to update one user
userRoutes.post('/user/profile/edit', (req, res, next)=>{
  const {username, password, email, age } = req.body;
  User.findByIdAndUpdate(req.params.id,{ username, password, email, age })
      .then( user => {
        console.log(`User ${user.username} succesfully updated`)
        res.redirect('/user/profile')
      })
      .catch(err=>{
        console.log(err.message);
        next();
      });
});

module.exports = userRoutes;