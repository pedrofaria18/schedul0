import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class CreateClientDto {
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
