const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const { validateAppointmentCreation } = require('../middlewares/appointmentValidator');
const handleValidationErrors = require('../middlewares/errorHandler');

router.post('/', validateAppointmentCreation, handleValidationErrors, appointmentsController.createAppointment);

module.exports = router;
