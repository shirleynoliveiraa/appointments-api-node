const Professional = require('../models/Professional');
const Appointment = require('../models/Appointment');
const checkAvailability = require('../utils/checkAvailability');

exports.createProfessional = async (req, res) => {
  try {
    const newProfessional = new Professional(req.body);
    await newProfessional.save();
    res.status(201).json(newProfessional);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProfessional = async (req, res) => {
  try {
    const { professionalId } = req.params;
    const { availability } = req.body;

    if (!professionalId) {
      return res.status(400).json({ error: 'Professional ID is required' });
    }

    const professional = await Professional.findById(professionalId);
    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    availability.forEach(newDay => {
      const existingDayIndex = professional.availability.findIndex(day => day.day === newDay.day);
      if (existingDayIndex !== -1) {
        professional.availability[existingDayIndex].slots = newDay.slots;
      } else {
        professional.availability.push(newDay);
      }
    });

    for (const day of professional.availability) {
      const bookedAppointments = await Appointment.find({
        professional: professionalId,
        date: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lte: new Date().setHours(23, 59, 59, 999),
        },
      });

      for (const slot of day.slots) {
        if (!checkAvailability(day.slots, slot, bookedAppointments)) {
          return res.status(400).json({ error: 'Slot not available' });
        }
      }
    }

    await professional.save();

    return res.status(200).json(professional);
  } catch (error) {
    console.error('Error updating professional:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAvailableSlotsByProfessional = async (req, res) => {
  try {
    const { professionalId } = req.params;

    const { startDate, endDate } = req.query;

    if (!professionalId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Professional ID, start date, and end date are required' });
    }

    const professional = await Professional.findById(professionalId);
    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    const appointments = await Appointment.find({
      professional: professionalId,
      date: { $gte: startDate, $lte: endDate }
    });

    const availableSlots = professional.availability.reduce((available, day) => {
      const dayAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.getDay() === day.day && appointmentDate >= new Date(startDate) && appointmentDate <= new Date(endDate);
      });

      const bookedSlots = dayAppointments.map(appointment => appointment.startTime);

      const dayAvailableSlots = day.slots.filter(slot => !bookedSlots.includes(slot));
      available[day.day] = dayAvailableSlots;
      return available;
    }, {});

    return res.json(availableSlots);
  } catch (err) {
    console.error('Error fetching professional availability:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteProfessional = async (req, res) => {
  try {
    const { professionalId } = req.params;

    if (!professionalId) {
      return res.status(400).json({ error: 'Professional ID is required' });
    }

    const professional = await Professional.findByIdAndDelete(professionalId);
    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    return res.status(200).json({ message: 'Professional deleted successfully' });
  } catch (error) {
    console.error('Error deleting professional:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};