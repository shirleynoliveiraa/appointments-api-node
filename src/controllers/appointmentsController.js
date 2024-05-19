const Appointment = require('../models/Appointment');
const Professional = require('../models/Professional');
const checkAvailability = require('../utils/checkAvailability');

exports.createAppointment = async (req, res) => {
  try {
    const { professionalId, client, startTime, date } = req.body;

    // Create date objects in UTC
    const startDateTime = new Date(`${date}T${startTime}:00Z`); // Z indicates UTC
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60000); // Add 60 minutes

    // Check for availability
    const professional = await Professional.findById(professionalId);
    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    const dayOfWeek = startDateTime.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });

    const availability = professional.availability.find(avail => avail.day === dayOfWeek);
    if (!availability) {
      return res.status(400).json({ error: 'No availability for this day' });
    }

    const startSlot = startDateTime.toISOString().slice(11, 16);

    if (!availability.slots.includes(startSlot)) {
      return res.status(400).json({ error: 'Slot not available' });
    }

    // Fetch booked appointments for the professional on the given date
    const bookedAppointments = await Appointment.find({
      professional: professionalId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999),
      },
    });

    if (!checkAvailability(availability.slots, startDateTime.toISOString(), bookedAppointments)) {
      return res.status(400).json({ error: 'Slot not available' });
    }

    const isPenultimateSlot = availability.slots.indexOf(startSlot) === availability.slots.length - 2;
    if (isPenultimateSlot) {
      const lastSlot = availability.slots[availability.slots.length - 1];
      if (!checkAvailability(availability.slots, lastSlot, bookedAppointments)) {
        return res.status(400).json({ error: 'Slot not available' });
      }
    }

    const slotIndex = availability.slots.indexOf(startSlot);
    availability.slots.splice(slotIndex, 1);

    await professional.save();

    const newAppointment = new Appointment({
      professional: professionalId,
      client,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      date: new Date(date).toISOString().slice(0, 10),
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
