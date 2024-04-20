import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from './repositories/users.repositories';
import { CompaniesRepository } from './repositories/companies.repositories';
import { ServicesRepository } from './repositories/services.repositories';
import { CollaboratorsRepository } from './repositories/collaborators.repositories';
import { AppointmentsRepository } from './repositories/appointments.repositories';
import { ClientsRepository } from './repositories/clients.repositories';
import { WorkSchedulesRepository } from './repositories/workSchedules.repositories';
import { ServiceTypesRepository } from './repositories/serviceTypes.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CompaniesRepository,
    ServiceTypesRepository,
    ServicesRepository,
    CollaboratorsRepository,
    WorkSchedulesRepository,
    AppointmentsRepository,
    ClientsRepository,
  ],
  exports: [
    UsersRepository,
    CompaniesRepository,
    ServiceTypesRepository,
    ServicesRepository,
    CollaboratorsRepository,
    WorkSchedulesRepository,
    AppointmentsRepository,
    ClientsRepository,
  ],
})
export class DatabaseModule {}
