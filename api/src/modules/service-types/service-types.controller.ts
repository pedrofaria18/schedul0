import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ServiceTypesService } from './services/service-types.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { ActiveUserId } from 'src/shared/decorators/activeUserId';

@Controller('service-types')
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Get('company/:companyId')
  findAllByCompanyId(
    @ActiveUserId() userId: string,
    @Param('companyId', ParseUUIDPipe) companyId: string,
  ) {
    return this.serviceTypesService.findAllByCompanyId(userId, companyId);
  }

  @Post()
  create(
    @ActiveUserId() userId: string,
    @Body() createServiceDto: CreateServiceTypeDto,
  ) {
    return this.serviceTypesService.create(userId, createServiceDto);
  }

  @Put(':serviceId')
  update(
    @ActiveUserId() userId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Body() updateServiceDto: UpdateServiceTypeDto,
  ) {
    return this.serviceTypesService.update(userId, serviceId, updateServiceDto);
  }

  @Delete(':serviceId')
  remove(
    @ActiveUserId() userId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ) {
    return this.serviceTypesService.remove(userId, serviceId);
  }
}
