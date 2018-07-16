const express = require("express");
const gameRoutes = express.Router();
const Game = require("../models/Game");
const Picture = require("../models/Picture");
const multer = require('multer');
const upload = multer({dest: './uploads'});

// READ Games

gameRoutes.get('/', (req,res,next)=>{
  Game.find({}).populate('img')
    .then(game=>{
      res.render('game/list', {game})
    })
    .catch(err=>{
      console.log(err.message);
      next();
    })
});

gameRoutes.get('/:id', (req, res, next)=>{
  Game.findById(req.params.id).populate('img')
    .then(game=>{
      res.render('game/game', {game});
    })
    .catch(err=>{
      console.log(err.message);
      next();
    })
})

gameRoutes.get('/new', upload.single('img'), (req, res, next)=>{
  res.render('game/new');
})

gameRoutes.post('/new', upload.single('img'), (req,res,next)=>{
  console.log(req.file);
  const { name, theme, category, minPlayers, maxPlayers, minAge, maxAge, difficulty } = req.body;
  if( name == '' ||
      theme == '' ||
      category == '' ||
      minPlayers == '' ||
      maxPlayers == '' ||
      minAge == '' ||
      maxAge == '' ||
      difficulty == ''){
        res.render('game/new', {message: 'Every field is required'})
      }
  const newPic = new Picture({
    filename: req.file.originalname,
    path: `/uploads/${req.file.filename}`
  });
  const newGame = new Game({
    name,
    theme,
    category,
    minPlayers,
    maxPlayers,
    minAge,
    maxAge,
    difficulty,
    img: newPic
  })

  newPic.save()
    .then(()=>{
      newGame.save()
        .then(()=>{
          res.redirect('/user/profile')
        })
    })
})

gameRoutes. post('/:id/delete', (req, res, next)=>{
  Game.findByIdAndRemove(req.params.id)
    .then(()=>{
      res.redirect('/user/profile');
    })
    .catch(e=>{
      console.log(e.message);
      next();
    })
})

gameRoutes.get('/:id/edit', (req, res, next)=>{
  Game.findById(req.params.id)
  .then(game=>{
    res.render('game/edit', {game});
  })
  .catch(err=>{
    console.log(err.message);
    next();
  });
})

gameRoutes.post('/:id/edit', (req, res, next)=>{
  let { name, theme, category, minPlayers, maxPlayers, minAge, maxAge, difficulty } = req.body;
  Game.findById(req.params.id)
    .then(game=>{
      if(name=='') name = game.name;
      if(theme=='') theme = game.theme;
      if(category=='') category = game.category;
      if(minPlayers =='') minPlayers = game.minPlayers ;
      if(maxPlayers=='') maxPlayers = game.maxPlayers;
      if(minAge=='') minAge = game.minAge;
      if(maxAge=='') maxAge = game.maxAge;
      if(difficulty=='') difficulty = game.difficulty;
      Game.findByIdAndUpdate(game._id, {name, theme, category, minPlayers, maxPlayers, minAge, maxAge, difficulty})
        .then(()=>{
          res.redirect('/user/profile')
        })
        .catch(e=>{
          console.log(e.message)
          next();
        });
    })

})
module.exports = gameRoutes;