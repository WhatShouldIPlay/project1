const express = require("express");
const userRoutes = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
const axios = require('axios');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// READ User

userRoutes.get('/profile', (req,res,next)=>{
  User.findById(req.user._id).populate('profilePic')
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

userRoutes.post('/profile/delete', (req, res, next)=>{
    User.findByIdAndRemove(req.user._id)
      .then(()=>{
        res.redirect('/');
      })
      .catch(err=>{
        console.log(err.message);
        next();
      });
});

// GET page to update one User

userRoutes.get('/profile/edit', (req, res, next)=>{
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
userRoutes.post('/profile/edit', (req, res, next)=>{
  console.log(req.body);
  console.log('aqui entra')
  let {username, password, email, age } = req.body;
  if(username == '') username = req.user.username;
  if(password == '') password = req.user.password;
  if(email == '') email = req.user.email;
  if(age == '') age = req.user.age;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  User.findByIdAndUpdate(req.user._id , { username, password: hashPass, email, age })
      .then( user => {
        console.log(`User ${user.username} succesfully updated`)
        res.redirect('/user/profile')
      })
      .catch(err=>{
        console.log(err.message);
        next();
      });
});

userRoutes.get('/profile/import', (req, res, next)=>{
  
  const { importUsername } = req.query;
    axios.get(`https://bgg-json.azurewebsites.net/collection/${importUsername}?grouped=true` )
      .then(resp=>{
        resp.data = resp.data.filter(e=>e.owned==true)
        dataResult=[];
        console.log(resp.data[1]);
        resp.data.forEach(e=>{
          newGame = new Game({
            name: e.name,
            minPlayers: e.minPlayers,
            maxPlayers: e.maxPlayers,
            owner: req.user._id,
          });
          dataResult.push(newGame);
        });

        Game.create(dataResult)
          .then(games=>{
            let gamesId = [];
            games.forEach(e=>gamesId.push(e._id))
            User.findByIdAndUpdate(req.user._id, {games: gamesId})
            .then(games=>{
              console.log(`Imported ${games.length} Games`)
              res.redirect('/user/profile')
            })
          })
      })
      .catch(e=>{
        console.log(e);
        next();
      })
})

module.exports = userRoutes;