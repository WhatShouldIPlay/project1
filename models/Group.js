const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const groupSchema = new Schema({
  name: String,
  location: String,
  img: {type: Schema.Types.ObjectId, ref:'Picture'},
  members: [{type: Schema.Types.ObjectId, ref:'User'}],
  newMembers: Boolean 
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;