import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  IsDateString,
  IsNumber,
  IsPositive,
  IsString,
  IsEmail,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ClientDto {
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class ServiceDto {
  @IsUUID()
  @IsNotEmpty()
  serviceTypeId: string;

  @IsUUID()
  @IsNotEmpty()
  collaboratorId: string;

  @IsNotEmpty()
  @IsDateString()
  dateTime: string;
}

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @ValidateNested()
  @Type(() => ClientDto)
  client: ClientDto;

  @IsArray()
  @IsNotEmpty()
  @Type(() => ServiceDto)
  @ValidateNested({ each: true })
  services: ServiceDto[];

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  total: number;
}
