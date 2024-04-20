import { Module } from '@nestjs/common';
import { CollaboratorsService } from './services/collaborators.service';
import { CollaboratorsController } from './collaborators.controller';
import { ValidateCompanyOwnershipService } from '../companies/services/validate-company-ownership.service';
import { ValidateWorkScheduleService } from './services/validate-work-schedule.service';
import { ValidateCollaboratorOwnershipService } from './services/validate-collaborator-ownership.service';
import { ValidateCollaboratorWorksService } from './services/validate-collaborator-works.service';
import { ValidateServiceTypeOwnershipService } from '../service-types/services/validate-service-type-ownership.service';
import { ConvertDate } from 'src/shared/utils/convertDate';
import { ValidateCollaboratorHasAvailableTimesService } from './services/validate-collaborator-has-available-times.service';
import { ValidateCollaboratorHaveServiceTypeService } from './services/validate-collaborator-have-service-type.service';

@Module({
  controllers: [CollaboratorsController],
  providers: [
    CollaboratorsService,
    ValidateCompanyOwnershipService,
    ValidateServiceTypeOwnershipService,
    ValidateCollaboratorOwnershipService,
    ValidateCollaboratorWorksService,
    ValidateWorkScheduleService,
    ValidateCollaboratorHasAvailableTimesService,
    ValidateCollaboratorHaveServiceTypeService,
    ConvertDate,
  ],
})
export class CollaboratorsModule {}
