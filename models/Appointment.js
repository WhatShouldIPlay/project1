const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const AppointmentSchema = new Schema({
  date: Date,
  date2: String,
  players:[{ type: Schema.Types.ObjectId, ref:'User'}],
  group: { type: Schema.Types.ObjectId, ref: 'Group'},
  game: { type: Schema.Types.ObjectId, ref: 'Game'}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
