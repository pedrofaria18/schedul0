import { ConflictException, Injectable } from '@nestjs/common';
import { CreateServiceTypeDto } from '../dto/create-service-type.dto';
import { UpdateServiceTypeDto } from '../dto/update-service-type.dto';
import { ValidateCompanyOwnershipService } from '../../companies/services/validate-company-ownership.service';
import { ValidateServiceTypeOwnershipService } from './validate-service-type-ownership.service';
import { ServiceTypesRepository } from 'src/shared/database/repositories/serviceTypes.repositories';

@Injectable()
export class ServiceTypesService {
  constructor(
    private readonly serviceTypesRepo: ServiceTypesRepository,
    private readonly validateCompanyOwnershipService: ValidateCompanyOwnershipService,
    private readonly validateServiceTypeOwnershipService: ValidateServiceTypeOwnershipService,
  ) {}

  async findAllByCompanyId(userId: string, companyId: string) {
    await this.validateCompanyOwnershipService.validate(userId, companyId);

    return this.serviceTypesRepo.findMany({
      where: {
        companyId,
      },
    });
  }

  async findOneByServiceId(userId: string, serviceTypeId: string) {
    const serviceType = await this.serviceTypesRepo.findFirst({
      where: {
        id: serviceTypeId,
      },
    });

    await this.validateServiceTypeOwnershipService.validate(
      userId,
      serviceType.companyId,
      serviceTypeId,
    );

    return this.serviceTypesRepo.findFirst({
      where: {
        id: serviceTypeId,
      },
    });
  }

  async create(userId: string, createServiceTypeDto: CreateServiceTypeDto) {
    const { name, description, price, duration, companyId } =
      createServiceTypeDto;

    await this.validateCompanyOwnershipService.validate(userId, companyId);

    await this.validateServiceTypeAlreadyExists(companyId, name);

    return this.serviceTypesRepo.create({
      data: {
        description,
        name,
        price,
        duration,
        companyId,
      },
    });
  }

  async update(
    userId: string,
    serviceTypeId: string,
    updateServiceTypeDto: UpdateServiceTypeDto,
  ) {
    const { name, description, price, duration, companyId } =
      updateServiceTypeDto;

    await this.validateServiceTypeOwnershipService.validate(
      userId,
      companyId,
      serviceTypeId,
    );

    await this.validateServiceTypeAlreadyExists(companyId, name, serviceTypeId);

    return this.serviceTypesRepo.update({
      where: { id: serviceTypeId },
      data: {
        name,
        description,
        price,
        duration,
        companyId,
      },
    });
  }

  async remove(userId: string, serviceTypeId: string) {
    const serviceType = await this.serviceTypesRepo.findFirst({
      where: {
        id: serviceTypeId,
      },
    });

    await this.validateServiceTypeOwnershipService.validate(
      userId,
      serviceType.companyId,
      serviceTypeId,
    );

    await this.serviceTypesRepo.delete({
      where: {
        id: serviceTypeId,
      },
    });

    return null;
  }

  private async validateServiceTypeAlreadyExists(
    companyId: string,
    serviceTypeName: string,
    serviceTypeId?: string,
  ) {
    const serviceType = await this.serviceTypesRepo.findFirst({
      where: {
        name: serviceTypeName,
        company: {
          id: companyId,
        },
        NOT: {
          id: serviceTypeId,
        },
      },
    });

    if (serviceType) {
      throw new ConflictException('Service already exists');
    }
  }
}
