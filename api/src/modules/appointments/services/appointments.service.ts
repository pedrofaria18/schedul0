import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { AppointmentsRepository } from 'src/shared/database/repositories/appointments.repositories';
import { ValidateCompanyOwnershipService } from 'src/modules/companies/services/validate-company-ownership.service';
import { ValidateCollaboratorOwnershipService } from 'src/modules/collaborator/services/validate-collaborator-ownership.service';
import { ValidateAppointmentOwnershipService } from './validate-appointment-ownership.service';
import { ClientsService } from 'src/modules/clients/services/clients.service';
import { ValidateCollaboratorWorksService } from 'src/modules/collaborator/services/validate-collaborator-works.service';
import { ServiceTypesRepository } from 'src/shared/database/repositories/serviceTypes.repositories';
import { ValidateServiceTypeOwnershipService } from 'src/modules/service-types/services/validate-service-type-ownership.service';
import { ValidateCollaboratorHaveServiceTypeService } from 'src/modules/collaborator/services/validate-collaborator-have-service-type.service';
import { ValidateCollaboratorHasAvailableTimesService } from 'src/modules/collaborator/services/validate-collaborator-has-available-times.service';
import { AppointmentStatus } from '../entities/AppointmentStatus';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepo: AppointmentsRepository,
    private readonly serviceTypesRepo: ServiceTypesRepository,
    private readonly validateCompanyOwnershipService: ValidateCompanyOwnershipService,
    private readonly validateServiceTypeOwnershipService: ValidateServiceTypeOwnershipService,
    private readonly validateCollaboratorOwnershipService: ValidateCollaboratorOwnershipService,
    private readonly validateCollaboratorWorksService: ValidateCollaboratorWorksService,
    private readonly validateCollaboratorHaveServiceTypeService: ValidateCollaboratorHaveServiceTypeService,
    private readonly validateAppointmentOwnershipService: ValidateAppointmentOwnershipService,
    private readonly validateCollaboratorHasAvailableTimesService: ValidateCollaboratorHasAvailableTimesService,
    private readonly clientsService: ClientsService,
  ) {}

  async findAllByCompanyId(userId: string, companyId: string) {
    await this.validateCompanyOwnershipService.validate(userId, companyId);

    return this.appointmentsRepo.findMany({
      where: {
        companyId,
      },
      include: {
        services: {
          select: {
            id: true,
            collaboratorId: true,
            dateTime: true,
            serviceType: {
              select: {
                id: true,
                name: true,
                description: true,
                duration: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  async findAllByCollaboratorId(userId: string, collaboratorId: string) {
    await this.validateCollaboratorOwnershipService.validate(
      userId,
      collaboratorId,
    );

    return this.appointmentsRepo.findMany({
      where: {
        collaboratorId,
      },
      include: {
        services: {
          select: {
            id: true,
            collaboratorId: true,
            dateTime: true,
            serviceType: {
              select: {
                id: true,
                name: true,
                description: true,
                duration: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(userId: string, appointmentId: string) {
    await this.validateAppointmentOwnershipService.validate(
      userId,
      appointmentId,
    );

    return this.appointmentsRepo.findFirst({
      where: {
        id: appointmentId,
      },
      include: {
        services: {
          select: {
            id: true,
            collaboratorId: true,
            dateTime: true,
            serviceType: {
              select: {
                id: true,
                name: true,
                description: true,
                duration: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  async create(userId: string, createAppointmentDto: CreateAppointmentDto) {
    const {
      client: clientDto,
      companyId,
      total,
      services,
    } = createAppointmentDto;

    await this.validateCompanyOwnershipService.validate(userId, companyId);

    for (const service of services) {
      await this.validateCollaboratorOwnershipService.validate(
        userId,
        service.collaboratorId,
      );

      await this.validateServiceTypeOwnershipService.validate(
        userId,
        companyId,
        service.serviceTypeId,
      );

      await this.validateCollaboratorHaveServiceTypeService.validate(
        service.collaboratorId,
        service.serviceTypeId,
      );

      const serviceSelected = await this.serviceTypesRepo.findFirst({
        where: {
          id: service.serviceTypeId,
        },
      });

      await this.validateCollaboratorWorksService.validate(
        service.collaboratorId,
        service.dateTime,
        serviceSelected.duration,
      );

      await this.validateCollaboratorHasAvailableTimesService.validate(
        true,
        service.collaboratorId,
        service.dateTime,
      );
    }

    const serviceTypeIds = services.map((service) => service.serviceTypeId);
    await this.validateTotalIsCorrect(serviceTypeIds, total);

    const dateTimes = services.map((service) => service.dateTime);
    await this.validateDateTimeAppointment(dateTimes);

    const { id: clientId } = await this.clientsService.create(
      userId,
      companyId,
      clientDto,
    );

    return this.appointmentsRepo.create({
      data: {
        total,
        clientId,
        companyId,
        services: {
          create: services.map((service) => ({
            dateTime: service.dateTime,
            collaboratorId: service.collaboratorId,
            serviceTypeId: service.serviceTypeId,
          })),
        },
      },
      include: {
        services: {
          select: {
            id: true,
            collaboratorId: true,
            dateTime: true,
            serviceType: {
              select: {
                id: true,
                name: true,
                description: true,
                duration: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  async update(
    userId: string,
    appointmentId: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return `${userId}, ${appointmentId}, ${updateAppointmentDto}`;
  }

  async updateStatus(
    userId: string,
    appointmentId: string,
    newStatus: AppointmentStatus,
  ) {
    await this.validateAppointmentOwnershipService.validate(
      userId,
      appointmentId,
    );

    await this.appointmentsRepo.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: newStatus,
      },
    });

    return 'Status altered';
  }

  async remove(userId: string, appointmentId: string) {
    await this.validateAppointmentOwnershipService.validate(
      userId,
      appointmentId,
    );

    await this.appointmentsRepo.delete({
      where: {
        id: appointmentId,
      },
    });

    return null;
  }

  private async validateTotalIsCorrect(
    serviceTypesIds: string[],
    total: number,
  ) {
    const serviceTypes = await this.serviceTypesRepo.findMany({
      where: {
        id: {
          in: serviceTypesIds,
        },
      },
    });

    const totalPrice = serviceTypes.reduce(
      (acc, serviceType) => acc + serviceType.price,
      0,
    );

    if (totalPrice !== total) {
      throw new NotAcceptableException('Total price is wrong');
    }
  }

  private async validateDateTimeAppointment(dateTimes: string[]) {
    const dates = dateTimes.map((dateTime) => dateTime.split('T')[0]);

    if (!dates.every((date) => date === dates[0])) {
      throw new NotAcceptableException(
        'The appointment can only have one date',
      );
    }
  }
}
