import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { DatabaseModule } from './shared/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { CompaniesModule } from './modules/companies/companies.module';
import { CollaboratorsModule } from './modules/collaborator/collaborators.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ServiceTypesModule } from './modules/service-types/service-types.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    CompaniesModule,
    CollaboratorsModule,
    AppointmentsModule,
    ClientsModule,
    ServiceTypesModule,
  ],
  controllers: [],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
