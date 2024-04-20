import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { WorkScheduleDays } from 'src/modules/collaborator/entities/WorkSchedules';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;
}

export class WorkScheduleDto {
  @IsEnum(WorkScheduleDays)
  @IsNotEmpty()
  dayOfWeek: WorkScheduleDays;

  @IsString()
  @IsNotEmpty()
  startTimeMorning: string;

  @IsString()
  @IsNotEmpty()
  endTimeMorning: string;

  @IsString()
  @IsNotEmpty()
  startTimeAfternoon: string;

  @IsString()
  @IsNotEmpty()
  endTimeAfternoon: string;
}

export class CreateCollaboratorDto {
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

  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @IsArray()
  @IsNotEmpty()
  @IsUUID(undefined, { each: true })
  serviceIds: string[];

  @IsObject()
  @IsNotEmptyObject()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkScheduleDto)
  @IsNotEmpty()
  workSchedules: WorkScheduleDto[];
}
