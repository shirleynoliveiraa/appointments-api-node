jest.setTimeout(30000);

const Professional = require('../src/models/Professional');
const Appointment = require('../src/models/Appointment');
const professionalsController = require('../src/controllers/professionalsController');

jest.mock('../src/models/Professional');
jest.mock('../src/models/Appointment');

describe('Professional Endpoints - Get Available Slots', () => {
  it('should get available slots for a professional within a date range', async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const req = {
      params: { professionalId: '6649cce267be6e94a8f6c84b' },
      query: {
        startDate: '2024-05-20',
        endDate: '2024-05-21',
      },
    };

    Professional.findById.mockResolvedValue({
      _id: '6649cce267be6e94a8f6c84b',
      availability: [
        {
          day: 'Monday',
          slots: ['08:00', '08:30', '09:00', '09:30', '10:00'],
        },
        {
          day: 'Tuesday',
          slots: ['08:00', '08:30', '09:00', '09:30', '10:00'],
        },
      ],
    });

    Appointment.find.mockResolvedValue([
      {
        professional: '6649cce267be6e94a8f6c84b',
        date: '2024-05-20',
        startTime: '08:00',
      },
      {
        professional: '6649cce267be6e94a8f6c84b',
        date: '2024-05-21',
        startTime: '09:00',
      },
    ]);

    await professionalsController.getAvailableSlotsByProfessional(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      Monday: ['08:00', '08:30', '09:00', '09:30', '10:00'],
      Tuesday: ['08:00', '08:30', '09:00', '09:30', '10:00'],
    });
  });
});

describe('Professional Endpoints', () => {
  it('should update professional availability', async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const req = {
      params: { professionalId: '6649cce267be6e94a8f6c84b' },
      body: {
        availability: [
          {
            day: 'Monday',
            slots: ['08:00', '09:00', '10:00'],
          },
          {
            day: 'Tuesday',
            slots: ['08:00', '09:00', '10:00'],
          },
        ],
      },
    };

    Professional.findById.mockResolvedValue({
      _id: '6649cce267be6e94a8f6c84b',
      availability: [
        {
          day: 'Monday',
          slots: ['08:00', '08:30', '09:00', '09:30', '10:00'],
        },
      ],
      save: jest.fn(),
    });

    Appointment.find.mockResolvedValue([]);

    await professionalsController.updateProfessional(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      _id: '6649cce267be6e94a8f6c84b',
      availability: [
        {
          day: 'Monday',
          slots: ['08:00', '09:00', '10:00'],
        },
        {
          day: 'Tuesday',
          slots: ['08:00', '09:00', '10:00'],
        },
      ],
    }));
  });
});
