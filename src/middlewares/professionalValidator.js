const { body, param, query } = require('express-validator');

const validateProfessionalCreation = [
  body('name').isString().withMessage('Name must be a string'),
  body('availability').isArray().withMessage('Availability must be an array'),
  body('availability.*.day').isString().withMessage('Day must be a string'),
  body('availability.*.slots').isArray().withMessage('Slots must be an array'),
  body('availability.*.slots.*').matches(/^\d{2}:\d{2}$/).withMessage('Slot must be in HH:MM format')
];

const validateProfessionalUpdate = [
  param('professionalId').isMongoId().withMessage('Invalid professional ID'),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('availability').optional().isArray().withMessage('Availability must be an array'),
  body('availability.*.day').optional().isString().withMessage('Day must be a string'),
  body('availability.*.slots').optional().isArray().withMessage('Slots must be an array'),
  body('availability.*.slots.*').optional().matches(/^\d{2}:\d{2}$/).withMessage('Slot must be in HH:MM format')
];

const validateAvailabilityQuery = [
  param('professionalId').isMongoId().withMessage('Invalid professional ID'),
  query('startDate').isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').isISO8601().withMessage('End date must be a valid date')
];

const validateProfessionalId = [
  param('professionalId').isMongoId().withMessage('Invalid professional ID'),
];

module.exports = {
  validateProfessionalCreation,
  validateProfessionalUpdate,
  validateAvailabilityQuery,
  validateProfessionalId
};
