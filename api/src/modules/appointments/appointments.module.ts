import { Module } from '@nestjs/common';
import { AppointmentsService } from './services/appointments.service';
import { AppointmentsController } from './appointments.controller';
import { ValidateCompanyOwnershipService } from '../companies/services/validate-company-ownership.service';
import { ValidateCollaboratorOwnershipService } from '../collaborator/services/validate-collaborator-ownership.service';
import { ValidateAppointmentOwnershipService } from './services/validate-appointment-ownership.service';
import { ClientsService } from '../clients/services/clients.service';
import { ValidateClientOwnershipService } from '../clients/services/validate-client-ownership.service';
import { ValidateCollaboratorWorksService } from '../collaborator/services/validate-collaborator-works.service';
import { ValidateServiceTypeOwnershipService } from '../service-types/services/validate-service-type-ownership.service';
import { ValidateCollaboratorHaveServiceTypeService } from '../collaborator/services/validate-collaborator-have-service-type.service';
import { ValidateCollaboratorHasAvailableTimesService } from '../collaborator/services/validate-collaborator-has-available-times.service';
import { ConvertDate } from 'src/shared/utils/convertDate';

@Module({
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    ValidateCompanyOwnershipService,
    ValidateServiceTypeOwnershipService,
    ValidateCollaboratorOwnershipService,
    ValidateCollaboratorWorksService,
    ValidateCollaboratorHaveServiceTypeService,
    ValidateCollaboratorHasAvailableTimesService,
    ValidateAppointmentOwnershipService,
    ValidateClientOwnershipService,
    ConvertDate,
    ClientsService,
  ],
})
export class AppointmentsModule {}
