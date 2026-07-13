import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsFutureDate } from '../../common/validators/is-future-date.validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsEmail()
  customerEmail!: string;

  @IsString()
  @IsNotEmpty()
  customerPhone!: string;

  @IsDateString()
  @IsFutureDate({ message: 'bookingDate cannot be in the past' })
  bookingDate!: string;

  @IsString()
  @IsNotEmpty()
  bookingTime!: string;

  @IsString()
  @IsNotEmpty()
  serviceId!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
