const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  professional: { type: Schema.Types.ObjectId, ref: 'Professional', required: true },
  client: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
