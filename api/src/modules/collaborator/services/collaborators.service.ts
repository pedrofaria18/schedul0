import { ConflictException, Injectable } from '@nestjs/common';
import {
  CreateCollaboratorDto,
  WorkScheduleDto,
} from '../dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from '../dto/update-collaborator.dto';
import { CollaboratorsRepository } from 'src/shared/database/repositories/collaborators.repositories';
import { ValidateCompanyOwnershipService } from '../../companies/services/validate-company-ownership.service';
import { ValidateWorkScheduleService } from './validate-work-schedule.service';
import { ValidateCollaboratorOwnershipService } from './validate-collaborator-ownership.service';
import { WorkSchedulesRepository } from 'src/shared/database/repositories/workSchedules.repositories';
import { ValidateCollaboratorWorksService } from './validate-collaborator-works.service';
import { ValidateServiceTypeOwnershipService } from 'src/modules/service-types/services/validate-service-type-ownership.service';
import { ValidateCollaboratorHasAvailableTimesService } from './validate-collaborator-has-available-times.service';
import { ValidateCollaboratorHaveServiceTypeService } from './validate-collaborator-have-service-type.service';

@Injectable()
export class CollaboratorsService {
  constructor(
    private readonly collaboratorsRepo: CollaboratorsRepository,
    private readonly workSchedulesRepo: WorkSchedulesRepository,
    private readonly validateCompanyOwnershipService: ValidateCompanyOwnershipService,
    private readonly validateServiceTypeOwnershipService: ValidateServiceTypeOwnershipService,
    private readonly validateWorkScheduleService: ValidateWorkScheduleService,
    private readonly validateCollaboratorOwnershipService: ValidateCollaboratorOwnershipService,
    private readonly validateCollaboratorWorksService: ValidateCollaboratorWorksService,
    private readonly validateCollaboratorHasAvailableTimesService: ValidateCollaboratorHasAvailableTimesService,
    private readonly validateCollaboratorHaveServiceTypeService: ValidateCollaboratorHaveServiceTypeService,
  ) {}

  async findAllByCompanyId(
    userId: string,
    companyId: string,
    serviceIds?: string[],
  ) {
    serviceIds = JSON.parse(serviceIds[0]);

    await this.validateCompanyOwnershipService.validate(userId, companyId);

    return this.collaboratorsRepo.findMany({
      where: {
        companyId,
        services: {
          every: {
            id: {
              in: serviceIds,
            },
          },
        },
      },
      include: {
        serviceTypes: {
          select: {
            id: true,
            name: true,
            description: true,
            duration: true,
            price: true,
          },
        },
        address: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
        workSchedules: {
          select: {
            id: true,
            dayOfWeek: true,
            startTimeMorning: true,
            endTimeMorning: true,
            startTimeAfternoon: true,
            endTimeAfternoon: true,
          },
        },
      },
    });
  }

  async findOneByCollaboratorId(userId: string, collaboratorId: string) {
    await this.validateCollaboratorOwnershipService.validate(
      userId,
      collaboratorId,
    );

    return this.collaboratorsRepo.findFirst({
      where: {
        id: collaboratorId,
      },
      include: {
        serviceTypes: {
          select: {
            id: true,
            name: true,
            description: true,
            duration: true,
            price: true,
          },
        },
        address: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
        workSchedules: {
          select: {
            id: true,
            dayOfWeek: true,
            startTimeMorning: true,
            endTimeMorning: true,
            startTimeAfternoon: true,
            endTimeAfternoon: true,
          },
        },
      },
    });
  }

  async findAllAvailableTimesByCollaboratorId(
    userId: string,
    collaboratorId: string,
    timestamp: string,
    serviceTypeId: string,
  ) {
    await this.validateCollaboratorOwnershipService.validate(
      userId,
      collaboratorId,
    );

    await this.validateCollaboratorWorksService.validate(
      collaboratorId,
      timestamp,
    );

    await this.validateCollaboratorHaveServiceTypeService.validate(
      collaboratorId,
      serviceTypeId,
    );

    await this.validateDateHasPassed(timestamp);

    const hoursAvailable =
      this.validateCollaboratorHasAvailableTimesService.validate(
        false,
        collaboratorId,
        timestamp,
      );

    return hoursAvailable;
  }

  async create(userId: string, createCollaboratorDto: CreateCollaboratorDto) {
    const {
      firstName,
      lastName,
      email,
      phone,
      companyId,
      serviceIds,
      address,
      workSchedules,
    } = createCollaboratorDto;

    await this.validateCompanyOwnershipService.validate(userId, companyId);

    await this.validateServiceTypeOwnershipService.validateMany(
      userId,
      companyId,
      serviceIds,
    );

    await this.validateCollaboratorAlreadyExists(companyId, email);

    this.validateWorkScheduleService.validate(workSchedules);

    return this.collaboratorsRepo.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        companyId,
        serviceTypes: {
          connect: serviceIds.map((id) => ({ id })),
        },
        address: {
          create: {
            city: address.city,
            state: address.state,
            street: address.street,
            zipCode: address.zipCode,
            companyId,
          },
        },
        workSchedules: {
          create: workSchedules,
        },
      },
      include: {
        serviceTypes: {
          select: {
            id: true,
            name: true,
            description: true,
            duration: true,
            price: true,
          },
        },
        address: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
        workSchedules: {
          select: {
            id: true,
            dayOfWeek: true,
            startTimeMorning: true,
            endTimeMorning: true,
            startTimeAfternoon: true,
            endTimeAfternoon: true,
          },
        },
      },
    });
  }

  async update(
    userId: string,
    collaboratorId: string,
    updateCollaboratorDto: UpdateCollaboratorDto,
  ) {
    const {
      firstName,
      lastName,
      email,
      phone,
      companyId,
      serviceIds,
      address,
      workSchedules,
    } = updateCollaboratorDto;

    await this.validateCollaboratorOwnershipService.validate(
      userId,
      collaboratorId,
    );

    await this.validateServiceTypeOwnershipService.validateMany(
      userId,
      companyId,
      serviceIds,
    );

    await this.validateCollaboratorAlreadyExists(
      companyId,
      email,
      collaboratorId,
    );

    this.validateWorkScheduleService.validate(workSchedules);

    await this.updateCollaboratorWorkSchedules(collaboratorId, workSchedules);

    return this.collaboratorsRepo.update({
      where: { id: collaboratorId },
      data: {
        email,
        firstName,
        lastName,
        phone,
        companyId,
        serviceTypes: {
          set: serviceIds.map((id) => ({ id })),
        },
        address: {
          create: {
            city: address.city,
            state: address.state,
            street: address.street,
            zipCode: address.zipCode,
            companyId,
          },
        },
      },
      include: {
        serviceTypes: {
          select: {
            id: true,
            name: true,
            description: true,
            duration: true,
            price: true,
          },
        },
        address: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
        workSchedules: {
          select: {
            id: true,
            dayOfWeek: true,
            startTimeMorning: true,
            endTimeMorning: true,
            startTimeAfternoon: true,
            endTimeAfternoon: true,
          },
        },
      },
    });
  }

  async remove(userId: string, collaboratorId: string) {
    await this.validateCollaboratorOwnershipService.validate(
      userId,
      collaboratorId,
    );

    await this.collaboratorsRepo.delete({
      where: {
        id: collaboratorId,
      },
    });

    return null;
  }

  private async validateCollaboratorAlreadyExists(
    companyId: string,
    collaboratorEmail: string,
    collaboratorId?: string,
  ) {
    const collaboratorAlreadyExists = await this.collaboratorsRepo.findFirst({
      where: {
        email: collaboratorEmail,
        companyId,
        NOT: {
          id: collaboratorId,
        },
      },
    });

    if (collaboratorAlreadyExists) {
      throw new ConflictException('Collaborator already exists');
    }
  }

  private async updateCollaboratorWorkSchedules(
    collaboratorId: string,
    workSchedules: WorkScheduleDto[],
  ) {
    const existingWorkSchedules = await this.workSchedulesRepo.findMany({
      where: {
        collaboratorId: collaboratorId,
      },
    });

    workSchedules.forEach(async (newWorkSchedule) => {
      const existingSchedule = existingWorkSchedules.find(
        (existingSchedule) =>
          existingSchedule.dayOfWeek === newWorkSchedule.dayOfWeek,
      );

      if (existingSchedule) {
        await this.workSchedulesRepo.update({
          where: { id: existingSchedule.id },
          data: newWorkSchedule,
        });
        return;
      }

      await this.workSchedulesRepo.create({
        data: {
          ...newWorkSchedule,
          collaboratorId: collaboratorId,
        },
      });

      return;
    });
  }

  private async validateDateHasPassed(timestamp: string) {
    const actualDate = new Date();

    if (actualDate.getTime() > new Date(timestamp).getTime()) {
      throw new ConflictException('This date already passed');
    }
  }
}
