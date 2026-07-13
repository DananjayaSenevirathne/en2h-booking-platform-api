import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Prisma, BookingStatus } from '@prisma/client';
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
        status: BookingStatus.PENDING,
      },
    });
  }
  async findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10, search, status } = paginationQuery;

    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {};

    if (search) {
      where.OR = [
        {
          customerName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          customerEmail: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          service: {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          service: true,
        },
        skip,
        take: limit,
        orderBy: {
          bookingDate: 'asc',
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
    const booking = await this.findOne(id);

    if (
      booking.status === BookingStatus.CANCELLED &&
      updateBookingDto.status === BookingStatus.COMPLETED
    ) {
      throw new ConflictException(
        'Cancelled bookings cannot be marked as completed',
      );
    }

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

  async cancel(id: string) {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED) {
      return booking;
    }

    return this.prisma.booking.update({
      where: {
        id,
      },
      data: {
        status: BookingStatus.CANCELLED,
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
