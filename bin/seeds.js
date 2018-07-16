const mongoose = require('mongoose');
const User = require('../models/User');
const Group = require('../models/Group');
const Game = require('../models/Game');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


const users = [
  {
    username: "Paco",
    email: "pacopaco@gmail.com",
    age: 25,
    games: [],
    profilePic: {},
    groups: [],
    password: bcrypt.hashSync('123', bcrypt.genSaltSync(bcryptSalt))

  },
  {
    username: "Pepe",
    email: "pepepepe@gmail.com",
    age: 18,
    games: [],
    profilePic: {},
    groups: [],
    password: bcrypt.hashSync('123', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Amanda",
    email: "amandita@gmail.com",
    age: 28,
    games: [],
    profilePic: {},
    groups: [],
    password: bcrypt.hashSync('123', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Jose",
    email: "joselito@gmail.com",
    age: 21,
    games: [],
    profilePic: {},
    groups: [],
    password: bcrypt.hashSync('123', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Manuel",
    email: "manu123@gmail.com",
    age: 16,
    games: [],
    profilePic: {},
    groups: [],
    password: bcrypt.hashSync('123', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Marta",
    email: "martichuli@gmail.com",
    age: 20,
    games: [],
    profilePic: {},
    groups: [],
    password: bcrypt.hashSync('123', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Solo",
    email: "alonee@gmail.com",
    age: 19,
    games: [],
    profilePic: {},
    groups: [],
    password: bcrypt.hashSync('123', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Nita",
    email: "anitaita@gmail.com",
    age: 32,
    games: [],
    profilePic: {},
    groups: [],
    password: bcrypt.hashSync('123', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Terminator",
    email: "sayonarababy@gmail.com",
    age: 27,
    games: [],
    profilePic: {},
    groups: [],
    password: bcrypt.hashSync('123', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "Fabio",
    email: "fake123@gmail.com",
    age: 42,
    games: [],
    profilePic: {},
    groups: [],
    password: bcrypt.hashSync('123', bcrypt.genSaltSync(bcryptSalt))
  }
]


const groups = [
  {
    name: "Acero",
    location: "Madrid",
    img: {},
    members: [],
    newMembers: true
  },
  {
    name: "Mastodontes",
    location: "Madrid",
    img: {},
    members: [],
    newMembers: true
  },
  {
    name: "Elite",
    location: "Madrid",
    img: {},
    members: [],
    newMembers: false
  },
  {
    name: "Gatos malvados",
    location: "Barcelona",
    img: {},
    members: [],
    newMembers: true
    
  },
  {
    name: "Fantásticos",
    location: "Madrid",
    img: {},
    members: [],
    newMembers: false
    
  },
  {
    name: "Bichos",
    location: "Barcelona",
    img: {},
    members: [],
    newMembers: true
    
  },
  {
    name: "Melenas",
    location: "Madrid",
    img: {},
    members: [],
    newMembers: true
    
  }
]

const games = [
  {
    name: "Colonos de Catán",
    category: "Eurogame",
    minPlayers: 2,
    maxPlayers: 4,
    minRecomendedAge: 8,
    maxRecomendedAge: 99,
    difficulty: 2.35,
    theme: "Economics",
    img: {}
  },
  {
    name: "Agrícola",
    category: "Eurogame",
    minPlayers: 1,
    maxPlayers: 5,
    minRecomendedAge: 12,
    maxRecomendedAge: 99,
    difficulty: 3.40,
    theme: "Worker Placement",
    img: {}
  },
  {
    name: "Descend",
    category: "Adventure Game",
    minPlayers: 3,
    maxPlayers: 5,
    minRecomendedAge: 6,
    maxRecomendedAge: 99,
    difficulty: 2.35,
    theme: "Cooperative",
    img: {}
  },
]