const express = require('express');
const router = express.Router();
const professionalsController = require('../controllers/professionalsController');
const {
  validateProfessionalCreation,
  validateProfessionalUpdate,
  validateAvailabilityQuery,
  validateProfessionalId
} = require('../middlewares/professionalValidator');
const handleValidationErrors = require('../middlewares/errorHandler');

router.post('/', validateProfessionalCreation, handleValidationErrors, professionalsController.createProfessional);
router.put('/:professionalId', validateProfessionalUpdate, handleValidationErrors, professionalsController.updateProfessional);
router.get('/:professionalId/availability', validateAvailabilityQuery, handleValidationErrors, professionalsController.getAvailableSlotsByProfessional);
router.delete('/:professionalId', validateProfessionalId, handleValidationErrors, professionalsController.deleteProfessional);

module.exports = router;
