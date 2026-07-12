import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    // Check whether the selected service exists
    const service = await this.prisma.service.findUnique({
      where: {
        id: createBookingDto.serviceId,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Prevent duplicate bookings
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        serviceId: createBookingDto.serviceId,
        bookingDate: new Date(createBookingDto.bookingDate),
        bookingTime: createBookingDto.bookingTime,
      },
    });

    if (existingBooking) {
      throw new ConflictException('This time slot is already booked.');
    }

    return this.prisma.booking.create({
      data: {
        customerName: createBookingDto.customerName,
        customerEmail: createBookingDto.customerEmail,
        customerPhone: createBookingDto.customerPhone,
        bookingDate: new Date(createBookingDto.bookingDate),
        bookingTime: createBookingDto.bookingTime,
        notes: createBookingDto.notes,
        serviceId: createBookingDto.serviceId,
      },
    });
  }
  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        service: true,
      },
      orderBy: {
        bookingDate: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }
  async update(id: string, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id);

    if (
      updateBookingDto.serviceId &&
      updateBookingDto.bookingDate &&
      updateBookingDto.bookingTime
    ) {
      const existingBooking = await this.prisma.booking.findFirst({
        where: {
          serviceId: updateBookingDto.serviceId,
          bookingDate: new Date(updateBookingDto.bookingDate),
          bookingTime: updateBookingDto.bookingTime,
          NOT: {
            id,
          },
        },
      });

      if (existingBooking) {
        throw new ConflictException('This time slot is already booked.');
      }
    }

    return this.prisma.booking.update({
      where: {
        id,
      },
      data: {
        ...updateBookingDto,
        bookingDate: updateBookingDto.bookingDate
          ? new Date(updateBookingDto.bookingDate)
          : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.booking.delete({
      where: {
        id,
      },
    });
  }
}
