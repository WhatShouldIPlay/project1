const express = require("express");
const appointmentRoutes = express.Router();
const Appointment = require("../models/Appointment");
const Game = require("../models/Game");
const User = require("../models/User");
const Group = require("../models/Group");
const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

appointmentRoutes.get('/list', (req, res, next) => {
  Appointment.find({})
    .populate('players', 'username')
    .populate('group', 'name')
    .populate('game', 'name')
    .then(appointment => {
      appointment.map(e => {
        let date2 = e.date.toString();
        e['date2'] = date2.slice(0, date2.indexOf(':00 GMT'));
        return e
      })
      res.render('appointment/list', {
        appointment
      })
    })
    .catch(err => {
      console.log(err.message);
      next();
    })
});

appointmentRoutes.get('/new', (req, res, next) => {
  res.render('appointment/new');
})

appointmentRoutes.post('/new', (req, res, next) => {
  let {
    date,
    time,
    players,
    group,
    game
  } = req.body;
  if (date == '' ||
    time == '' ||
    players == '' ||
    group == '' ||
    game == ''
  ) res.render('appointment/new', {
    message: 'Every field is required'
  })
  players = players.split(', ');
  Promise.all([
      User.find({
        username: {
          $in: players
        }
      }),
      Group.find({
        name: group
      }),
      Game.find({
        name: game
      })
    ]).then(result => {
      const newAppointment = new Appointment({
        date: new Date(date),
        time,
        players: result[0],
        group: result[1][0]._id,
        game: result[2][0]._id
      })
      console.log(newAppointment.date);
      newAppointment.save()
        .then(() => {
          res.redirect('/appointment/list')
        })
        .catch(e => {
          console.log(e.message)
          next();
        })
    })
    .catch(e => {
      console.log(e.message);
      next();
    });
})

appointmentRoutes.get('/:id', (req, res, next) => {
  Appointment.findById(req.params.id)
    .populate('players')
    .populate('group', 'name')
    .populate('game', 'name')
    .then(appointment => {
      console.log(appointment);
      res.render('appointment/appointment', {
        appointment
      });
    })
    .catch(err => {
      console.log(err.message);
      next();
    })
})

appointmentRoutes.post('/:id/delete', (req, res, next) => {
  Appointment.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/appointment/list');
    })
    .catch(e => {
      console.log(e.message);
      next();
    })
})

appointmentRoutes.get('/:id/edit', (req, res, next) => {
  Appointment.findById(req.params.id)
    .populate('group', 'name')
    .populate('players', 'username')
    .populate('game', 'name')
    .then(appointment => {
      res.render('appointment/edit', {
        appointment
      });
    })
    .catch(err => {
      console.log(err.message);
      next();
    });
})

appointmentRoutes.post('/:id/edit', (req, res, next) => {
  let {
    date,
    time,
    players,
    group,
    game
  } = req.body;
  const update = {
    date,
    time,
    players,
    group,
    game
  }

  if (date == "") delete update.date;
  if (time == "") delete update.time;
  if (players == "") delete update.players;
  if (group == "") delete update.group;
  if (game == "") delete update.game;


  Appointment.findByIdAndUpdate(req.params.id, update)
    .then(() => {
      res.redirect("/appointment/list");
    })
    .catch(e => {
      console.log(e.message);
      next();
    });
});

appointmentRoutes.post('/search', (req, res, next) => {
  let {
    game,
    date,
    group
  } = req.body;

  Promise.all([
      Group.findOne({
        name: group
      }).select('_id'),
      Game.findOne({
        name: game
      }).select('_id')
    ])
    .then(result => {
      let groupQuery = {}, gameQuery = {}, dateQuery = {};
      if(result[0]) groupQuery = { group: result[0] };
      if(result[1]) gameQuery = { game: result[1] };
      if(date){
        checkDate = new Date(date);
        dateQuery =  { date: { $gte: checkDate } }
      } 

      Appointment.find({
          $and: [groupQuery, gameQuery, dateQuery]
        })
        .populate('players', 'username')
        .populate('group', 'name')
        .populate('game', 'name')
        .then(app => {
          app.map(e => {
            let date2 = e.date.toString();
            e['date2'] = date2.slice(0, date2.indexOf(':00 GMT'));
            return e
          })
          res.render('appointment/list', {
            appointment: app
          })
        })
        .catch(e => {
          console.log(e.message);
          next();
        })
    })
})

module.exports = appointmentRoutes;