const mongoose = require("mongoose");
const User = require("../models/User");
const Group = require("../models/Group");
const Game = require("../models/Game");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

mongoose.connect("mongodb://localhost/whatshouldIplay");

const users = [
  {
    username: "Paco",
    email: "pacopaco@gmail.com",
    age: 25,
    games: [],
    groups: [],
    password: bcrypt.hashSync('ObjectId("123")', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Pepe",
    email: "pepepepe@gmail.com",
    age: 18,
    games: [],
    groups: [],
    password: bcrypt.hashSync('ObjectId("123")', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Amanda",
    email: "amandita@gmail.com",
    age: 28,
    games: [],
    groups: [],
    password: bcrypt.hashSync('ObjectId("123")', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Jose",
    email: "joselito@gmail.com",
    age: 21,
    games: [],
    groups: [],
    password: bcrypt.hashSync('ObjectId("123")', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Manuel",
    email: "manu@gmail.com",
    age: 16,
    games: [],
    groups: [],
    password: bcrypt.hashSync('ObjectId("123")', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Marta",
    email: "martichuli@gmail.com",
    age: 20,
    games: [],
    groups: [],
    password: bcrypt.hashSync('ObjectId("123")', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Solo",
    email: "alonee@gmail.com",
    age: 19,
    games: [],
    groups: [],
    password: bcrypt.hashSync('ObjectId("123")', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Nita",
    email: "anitaita@gmail.com",
    age: 32,
    games: [],
    groups: [],
    password: bcrypt.hashSync('ObjectId("123")', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Terminator",
    email: "sayonarababy@gmail.com",
    age: 27,
    games: [],
    groups: [],
    password: bcrypt.hashSync('ObjectId("123")', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Fabio",
    email: "fake@gmail.com",
    age: 42,
    games: [],
    groups: [],
    password: bcrypt.hashSync('ObjectId("123")', bcrypt.genSaltSync(bcryptSalt))
  }
];

const groups = [
  {
    name: "Acero",
    location: "Madrid",
    members: [],
    newMembers: true
  },
  {
    name: "Mastodontes",
    location: "Madrid",
    members: [],
    newMembers: true
  },
  {
    name: "Elite",
    location: "Madrid",
    members: [],
    newMembers: false
  },
  {
    name: "Gatos malvados",
    location: "Barcelona",
    members: [],
    newMembers: true
  },
  {
    name: "Fantásticos",
    location: "Madrid",
    members: [],
    newMembers: false
  },
  {
    name: "Bichos",
    location: "Barcelona",
    members: [],
    newMembers: true
  },
  {
    name: "Melenas",
    location: "Madrid",
    members: [],
    newMembers: true
  }
];

const games = [
  {
    name: "Colonos de Catán",
    category: "Eurogame",
    minPlayers: 2,
    maxPlayers: 4,
    minRecomendedAge: 8,
    maxRecomendedAge: 99,
    difficulty: 2.35,
    theme: "Economics"
  },
  {
    name: "Agrícola",
    category: "Eurogame",
    minPlayers: 1,
    maxPlayers: 5,
    minRecomendedAge: 12,
    maxRecomendedAge: 99,
    difficulty: 3.4,
    theme: "Worker Placement"
  },
  {
    name: "Descend",
    category: "Adventure Game",
    minPlayers: 3,
    maxPlayers: 5,
    minRecomendedAge: 6,
    maxRecomendedAge: 99,
    difficulty: 2.35,
    theme: "Cooperative"
  }
];

Promise.all([User.create(users), Group.create(groups), Game.create(games)])
  .then(results => {
    console.log(`created ${results[0].length} users`);
    console.log(`created ${results[1].length} groups`);
    console.log(`created ${results[2].length} games`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
  });
