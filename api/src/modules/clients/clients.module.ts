import { Module } from '@nestjs/common';
import { ClientsService } from './services/clients.service';
import { ClientsController } from './clients.controller';
import { ValidateCompanyOwnershipService } from '../companies/services/validate-company-ownership.service';
import { ValidateClientOwnershipService } from './services/validate-client-ownership.service';

@Module({
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ValidateCompanyOwnershipService,
    ValidateClientOwnershipService,
  ],
})
export class ClientsModule {}
