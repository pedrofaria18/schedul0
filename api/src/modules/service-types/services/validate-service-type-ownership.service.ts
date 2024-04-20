import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceTypesRepository } from 'src/shared/database/repositories/serviceTypes.repositories';

@Injectable()
export class ValidateServiceTypeOwnershipService {
  constructor(private readonly serviceTypesRepo: ServiceTypesRepository) {}

  async validate(userId: string, companyId: string, serviceTypeId: string) {
    const isOwner = await this.serviceTypesRepo.findFirst({
      where: {
        id: serviceTypeId,
        company: {
          id: companyId,
          userId,
        },
      },
    });

    if (!isOwner) {
      throw new NotFoundException('Service Type not found.');
    }
  }

  async validateMany(
    userId: string,
    companyId: string,
    serviceTypeIds: string[],
  ) {
    const serviceTypesExists = await this.serviceTypesRepo.findMany({
      where: {
        id: {
          in: serviceTypeIds,
        },
        company: {
          id: companyId,
          userId,
        },
      },
    });

    if (serviceTypesExists.length !== serviceTypeIds.length) {
      throw new NotFoundException('One or more services were not found.');
    }
  }
}
