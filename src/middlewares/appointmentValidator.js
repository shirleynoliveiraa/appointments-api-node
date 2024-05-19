const { body } = require('express-validator');

const isValidTime = (value) => {
  const regex = /^([01]\d|2[0-3]):(00|30)$/; // Verifica o formato HH:mm e se os minutos são 00 ou 30
  return regex.test(value);
};

const validateAppointmentCreation = [
  body('professionalId').isMongoId().withMessage('Invalid professional ID'),
  body('client').isString().withMessage('Client name must be a string'),
  body('startTime')
    .custom(isValidTime)
    .withMessage('Start time must be in the format HH:mm and in 30-minute intervals (e.g., 08:00, 08:30)'),
  body('date').isISO8601().withMessage('Date must be a valid date')
];

module.exports = {
  validateAppointmentCreation
};
