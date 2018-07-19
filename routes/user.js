const express = require("express");
const userRoutes = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
const Picture = require("../models/Picture");
const axios = require('axios');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const upload = require("../cloudinaryConfig/cloudinary.js");



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

userRoutes.post("/:id/edit", upload.single("profilePic"), (req, res, next) => {
  let { username, password, email, age } = req.body;
  const update = {
    username,
    password,
    email,
    age,
  };
  
  if (!username) delete update.username;
  if (!password) {
    delete update.password
  } else {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
  }
  if (!email) delete update.email;
  if (!age) delete update.age; 
  if(req.file){
    const newPic = new Picture({
      filename: req.file.originalname,
      path: req.file.url
    })
    update.profilePic = newPic;
    newPic.save()
      .then(()=>{
        User.findByIdAndUpdate(req.params.id, update)
          .then(() => {
            res.redirect("/user/profile");
          })
          .catch(e => {
            console.log(e.message);
            next();
          });
      })
      .catch(e => {
        console.log(e.message);
        next();
      });
  } else {
  User.findByIdAndUpdate(req.params.id , update)
      .then( user => {
        res.redirect('/user/profile')
      })
      .catch(err=>{
        console.log(err.message);
        next();
      });
  }
});


userRoutes.get('/profile/import', (req, res, next)=>{
  
  const { importUsername } = req.query;
    axios.get(`https://bgg-json.azurewebsites.net/collection/${importUsername}?grouped=true` )
      .then(resp=>{
        resp.data = resp.data.filter(e=>e.owned==true)
        dataResult=[];
        imageResult=[];
        resp.data.forEach(e=>{
          newImage = new Picture({
            path: e.image,
            filename: `${e.name}.jpg`
          })
          newGame = new Game({
            name: e.name,
            minPlayers: e.minPlayers,
            maxPlayers: e.maxPlayers,
            owner: req.user._id,
            img: newImage._id
          });
          dataResult.push(newGame);
          imageResult.push(newImage);
        });
        console.log(dataResult[0]);
        console.log(imageResult[0])
        Promise.all([
          Game.create(dataResult),
          Picture.create(imageResult)
        ])
          .then(result=>{
            let gamesId = [];
            result[0].forEach(e=>gamesId.push(e._id))
            User.findByIdAndUpdate(req.user._id, {games: gamesId}, {new:true})
              .then(games=>{
                console.log(`Imported ${games.length} Games`)
                res.redirect('/user/profile')
              })
              .catch(e=>{
                console.log(e);
                res.render('/user/profile', {error: 'error'})
              })
          })
          .catch(e=>{
            console.log(e);
            res.render('/user/profile', {error: 'error'})
          })
      })
      .catch(e=>{
        console.log(e);
        const error='error'
        res.render('/user/profile', {error})
      })
})

module.exports = userRoutes;