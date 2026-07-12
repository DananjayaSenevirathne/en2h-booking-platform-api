import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { ServicesModule } from '../services/services.module';

import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [PrismaModule, ServicesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
