import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
