const checkAvailability = (slots, startSlot, bookedAppointments, duration = 60) => {
  const start = new Date(startSlot);
  const end = new Date(start.getTime() + duration * 60000);

  for (const appointment of bookedAppointments) {
    const appointmentStart = new Date(appointment.startTime);
    const appointmentEnd = new Date(appointment.endTime);

    if (
      (start >= appointmentStart && start < appointmentEnd) ||
      (end > appointmentStart && end <= appointmentEnd) ||
      (start <= appointmentStart && end >= appointmentEnd)
    ) {
      return false;
    }
  }
  return true;
};

module.exports = checkAvailability;
