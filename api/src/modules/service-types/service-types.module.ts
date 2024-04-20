import { Module } from '@nestjs/common';
import { ValidateCompanyOwnershipService } from '../companies/services/validate-company-ownership.service';
import { ValidateServiceTypeOwnershipService } from './services/validate-service-type-ownership.service';
import { ServiceTypesService } from './services/service-types.service';
import { ServiceTypesController } from './service-types.controller';

@Module({
  controllers: [ServiceTypesController],
  providers: [
    ServiceTypesService,
    ValidateCompanyOwnershipService,
    ValidateServiceTypeOwnershipService,
  ],
})
export class ServiceTypesModule {}
