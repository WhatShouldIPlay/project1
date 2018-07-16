const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const gameTheme = ['Strategy', 'Card Game', 'Negotiation', 'Economics', 'Cooperative', 'Worker Placement']
const gameCategory = ['Eurogame', 'Adventure Game', 'Family Game', 'Party Game'];

const gameSchema = new Schema({
  name: {type: String, required: true},
  theme: {type: String, enum:gameTheme, default: 'Strategy'},
  category: {type: String, enum:gameCategory, default: 'Eurogame'},
  minPlayers: {type: Number, min:1},
  maxPlayers: Number,
  minRecomendedAge: {type: Number, min: 1},
  maxRecomendedAge: Number,
  difficulty: {type: Number, min: 0, max: 5},
  img: {type: Schema.Types.ObjectId, ref:'Picture'}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;
