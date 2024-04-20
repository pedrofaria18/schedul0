import { Module } from '@nestjs/common';
import { CompaniesService } from './services/companies.service';
import { CompaniesController } from './companies.controller';
import { ValidateCompanyOwnershipService } from './services/validate-company-ownership.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, ValidateCompanyOwnershipService],
})
export class CompaniesModule {}
