const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  age: Number,
  games: [{type: Schema.Types.ObjectId, ref:'Game'}],
  profilePic: {type: Schema.Types.ObjectId, ref:'Picture'},
  groups: [{type: Schema.Types.ObjectId, ref:'Group'}]

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
