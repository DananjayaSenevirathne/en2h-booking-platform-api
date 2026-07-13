import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

describe('BookingsService', () => {
  let service: BookingsService;

  const prismaMock = {
    service: {
      findUnique: jest.fn(),
    },
    booking: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('create() throws NotFoundException when the referenced service does not exist', async () => {
    prismaMock.service.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        customerPhone: '1234567890',
        bookingDate: '2026-07-13',
        bookingTime: '10:00',
        serviceId: 'service-1',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prismaMock.booking.findFirst).not.toHaveBeenCalled();
  });

  it('create() throws ConflictException when a duplicate slot exists', async () => {
    prismaMock.service.findUnique.mockResolvedValue({ id: 'service-1' });
    prismaMock.booking.findFirst.mockResolvedValue({ id: 'booking-1' });

    await expect(
      service.create({
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        customerPhone: '1234567890',
        bookingDate: '2026-07-13',
        bookingTime: '10:00',
        serviceId: 'service-1',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prismaMock.booking.create).not.toHaveBeenCalled();
  });

  it('update() throws ConflictException when moving a CANCELLED booking to COMPLETED', async () => {
    prismaMock.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      status: BookingStatus.CANCELLED,
      service: { id: 'service-1' },
    });

    await expect(
      service.update('booking-1', {
        status: BookingStatus.COMPLETED,
      }),
    ).rejects.toThrow('Cancelled bookings cannot be marked as completed');

    expect(prismaMock.booking.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.booking.update).not.toHaveBeenCalled();
  });
});
