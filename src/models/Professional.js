const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfessionalSchema = new Schema({
  name: { type: String, required: true },
  availability: [
    {
      day: { type: String, required: true },
      slots: [String]  // ["08:00", "08:30", "09:00", "09:30", "10:00"]
    }
  ]
});

module.exports = mongoose.model('Professional', ProfessionalSchema);
